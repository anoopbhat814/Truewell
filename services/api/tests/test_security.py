import pytest

from app.core.rbac import Principal, Role
from app.errors import AuthenticationError
from app.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    hash_refresh_token,
    new_refresh_token,
    password_is_strong,
    verify_password,
)


def test_password_roundtrip():
    stored = hash_password("Correct-Horse-9")
    assert verify_password("Correct-Horse-9", stored)
    assert not verify_password("wrong", stored)


def test_hashes_are_salted():
    assert hash_password("same-password-1A!") != hash_password("same-password-1A!")


def test_malformed_hash_is_rejected():
    assert not verify_password("x", "not-a-hash")
    assert not verify_password("x", "bcrypt$aa$bb")


@pytest.mark.parametrize(
    "password,ok",
    [("short1A!", False), ("alllowercaseletters", False), ("Longer-Passphrase-42", True), ("NoSymbols12345Ab", True)],
)
def test_password_strength(password, ok):
    assert password_is_strong(password) is ok


def test_access_token_roundtrip():
    principal = Principal("u1", Role.CLINICIAN, clinician_id="c9")
    decoded = decode_access_token(create_access_token(principal))
    assert decoded == principal


def test_tampered_token_rejected():
    token = create_access_token(Principal("u1", Role.PATIENT, patient_id="p1"))
    with pytest.raises(AuthenticationError):
        decode_access_token(token[:-3] + "abc")


def test_refresh_token_hash_matches():
    raw, hashed = new_refresh_token()
    assert hash_refresh_token(raw) == hashed
    assert len(raw) > 40
