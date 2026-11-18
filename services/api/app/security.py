import hashlib
import hmac
import os
import secrets
from datetime import timedelta

import jwt

from app.config import get_settings
from app.core.clock import utcnow
from app.core.rbac import Principal, Role
from app.errors import AuthenticationError

_SCRYPT_N, _SCRYPT_R, _SCRYPT_P = 2**14, 8, 1


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=_SCRYPT_N, r=_SCRYPT_R, p=_SCRYPT_P)
    return f"scrypt${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        scheme, salt_hex, digest_hex = stored.split("$")
    except ValueError:
        return False
    if scheme != "scrypt":
        return False
    digest = hashlib.scrypt(
        password.encode(), salt=bytes.fromhex(salt_hex), n=_SCRYPT_N, r=_SCRYPT_R, p=_SCRYPT_P
    )
    return hmac.compare_digest(digest.hex(), digest_hex)


def password_is_strong(password: str) -> bool:
    classes = [
        any(c.islower() for c in password),
        any(c.isupper() for c in password),
        any(c.isdigit() for c in password),
        any(not c.isalnum() for c in password),
    ]
    return len(password) >= 12 and sum(classes) >= 3


def create_access_token(principal: Principal) -> str:
    settings = get_settings()
    now = utcnow()
    claims = {
        "sub": principal.user_id,
        "role": principal.role.value,
        "pid": principal.patient_id,
        "cid": principal.clinician_id,
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_minutes),
        "typ": "access",
    }
    return jwt.encode(claims, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> Principal:
    settings = get_settings()
    try:
        claims = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationError("Access token has expired") from exc
    except jwt.PyJWTError as exc:
        raise AuthenticationError("Invalid access token") from exc
    if claims.get("typ") != "access":
        raise AuthenticationError("Wrong token type")
    return Principal(
        user_id=claims["sub"],
        role=Role(claims["role"]),
        patient_id=claims.get("pid"),
        clinician_id=claims.get("cid"),
    )


def new_refresh_token() -> tuple[str, str]:
    """Return (opaque token for the client, sha256 hash to persist)."""
    raw = secrets.token_urlsafe(48)
    return raw, hashlib.sha256(raw.encode()).hexdigest()


def hash_refresh_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()
