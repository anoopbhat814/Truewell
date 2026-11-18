import pytest

from app.errors import AuthenticationError, ConflictError, RateLimited, ValidationFailed
from app.schemas.auth import RegisterRequest
from app.security import decode_access_token
from app.services.auth import AuthService, throttle

REG = dict(
    email="new.patient@patients.example",
    password="Str0ng-Passphrase!",
    display_name="New Patient",
    first_name="New",
    last_name="Patient",
    date_of_birth="1988-02-29",
)


@pytest.fixture(autouse=True)
def _reset_throttle():
    throttle._failures.clear()


def test_register_login_and_refresh_rotation(session):
    svc = AuthService(session)
    svc.register_patient(RegisterRequest(**REG))
    tokens = svc.login(REG["email"], REG["password"])
    principal = decode_access_token(tokens.access_token)
    assert principal.patient_id is not None
    rotated = svc.refresh(tokens.refresh_token)
    assert rotated.refresh_token != tokens.refresh_token
    with pytest.raises(AuthenticationError):
        svc.refresh(tokens.refresh_token)


def test_duplicate_registration(session):
    svc = AuthService(session)
    svc.register_patient(RegisterRequest(**REG))
    with pytest.raises(ConflictError):
        svc.register_patient(RegisterRequest(**REG))


def test_weak_password_rejected(session):
    with pytest.raises(ValidationFailed):
        AuthService(session).register_patient(RegisterRequest(**{**REG, "password": "alllowercase123"}))


def test_lockout_after_repeated_failures(session):
    svc = AuthService(session)
    svc.register_patient(RegisterRequest(**REG))
    for _ in range(5):
        with pytest.raises(AuthenticationError):
            svc.login(REG["email"], "wrong-password")
    with pytest.raises(RateLimited):
        svc.login(REG["email"], REG["password"])
