"""Helpers for minimising exposure of protected health information in logs and exports."""

import re

_EMAIL = re.compile(r"(^.).*(@.*$)")


def mask_email(value: str) -> str:
    return _EMAIL.sub(r"\1***\2", value)


def mask_phone(value: str) -> str:
    digits = re.sub(r"\D", "", value)
    return f"***-***-{digits[-4:]}" if len(digits) >= 4 else "***"


def mask_member_id(value: str) -> str:
    return value[:2] + "*" * max(len(value) - 4, 0) + value[-2:] if len(value) > 4 else "****"


def initials(first: str, last: str) -> str:
    return f"{first[:1]}{last[:1]}".upper()
