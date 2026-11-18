from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import audit
from app.config import get_settings
from app.core.clock import utcnow
from app.core.rbac import Principal, Role
from app.errors import AuthenticationError, ConflictError, RateLimited, ValidationFailed
from app.models.clinician import Clinician
from app.models.patient import Patient
from app.models.user import AuthSession, User
from app.schemas.auth import RegisterRequest, TokenPair
from app.security import (
    create_access_token,
    hash_password,
    hash_refresh_token,
    new_refresh_token,
    password_is_strong,
    verify_password,
)


class LoginThrottle:
    """In-process failed-login counter. Redis backs the same interface in multi-replica deployments."""

    def __init__(self) -> None:
        self._failures: dict[str, list[datetime]] = {}

    def check(self, email: str) -> None:
        settings = get_settings()
        window = utcnow() - timedelta(minutes=settings.login_lockout_minutes)
        recent = [t for t in self._failures.get(email, []) if t > window]
        self._failures[email] = recent
        if len(recent) >= settings.login_max_attempts:
            raise RateLimited("Too many failed sign-in attempts. Try again later.")

    def fail(self, email: str) -> None:
        self._failures.setdefault(email, []).append(utcnow())

    def reset(self, email: str) -> None:
        self._failures.pop(email, None)


throttle = LoginThrottle()


class AuthService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def _principal_for(self, user: User) -> Principal:
        patient_id = self.session.scalar(select(Patient.id).where(Patient.user_id == user.id))
        clinician_id = self.session.scalar(select(Clinician.id).where(Clinician.user_id == user.id))
        return Principal(user.id, Role(user.role), patient_id, clinician_id)

    def _issue(self, user: User, user_agent: str | None, ip: str | None) -> TokenPair:
        settings = get_settings()
        raw, hashed = new_refresh_token()
        self.session.add(
            AuthSession(
                user_id=user.id,
                token_hash=hashed,
                user_agent=user_agent,
                ip_address=ip,
                expires_at=utcnow() + timedelta(days=settings.refresh_token_days),
            )
        )
        return TokenPair(
            access_token=create_access_token(self._principal_for(user)),
            refresh_token=raw,
            expires_in=settings.access_token_minutes * 60,
        )

    def register_patient(self, req: RegisterRequest) -> User:
        if not password_is_strong(req.password):
            raise ValidationFailed("Password must be 12+ characters and mix at least three character classes")
        if self.session.scalar(select(User.id).where(User.email == req.email.lower())):
            raise ConflictError("An account with this email already exists")
        user = User(email=req.email.lower(), password_hash=hash_password(req.password), role="PATIENT", display_name=req.display_name)
        self.session.add(user)
        self.session.flush()
        count = len(list(self.session.scalars(select(Patient.id))))
        self.session.add(
            Patient(
                user_id=user.id,
                mrn=f"MRN-{100001 + count}",
                first_name=req.first_name,
                last_name=req.last_name,
                date_of_birth=datetime.strptime(req.date_of_birth, "%Y-%m-%d").date(),
            )
        )
        audit.record(self.session, None, "register", "user", user.id)
        return user

    def login(self, email: str, password: str, user_agent: str | None = None, ip: str | None = None) -> TokenPair:
        email = email.lower()
        throttle.check(email)
        user = self.session.scalar(select(User).where(User.email == email))
        if user is None or not verify_password(password, user.password_hash):
            throttle.fail(email)
            audit.record(self.session, None, "login_failed", "user", user.id if user else "unknown", ip_address=ip)
            raise AuthenticationError("Incorrect email or password")
        throttle.reset(email)
        user.last_login_at = utcnow()
        audit.record(self.session, self._principal_for(user), "login", "user", user.id, ip_address=ip)
        return self._issue(user, user_agent, ip)

    def refresh(self, raw_token: str, user_agent: str | None = None, ip: str | None = None) -> TokenPair:
        stored = self.session.scalar(select(AuthSession).where(AuthSession.token_hash == hash_refresh_token(raw_token)))
        if stored is None or stored.expires_at < utcnow():
            raise AuthenticationError("Refresh token is invalid or expired")
        user = self.session.get(User, stored.user_id)
        if user is None:
            raise AuthenticationError("Account no longer exists")
        self.session.delete(stored)  # rotate: a refresh token is single-use
        return self._issue(user, user_agent, ip)

    def logout(self, raw_token: str) -> None:
        stored = self.session.scalar(select(AuthSession).where(AuthSession.token_hash == hash_refresh_token(raw_token)))
        if stored is not None:
            self.session.delete(stored)
