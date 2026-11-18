from dataclasses import dataclass
from enum import Enum


class Role(str, Enum):
    PATIENT = "PATIENT"
    CLINICIAN = "CLINICIAN"
    NURSE = "NURSE"
    FRONT_DESK = "FRONT_DESK"
    BILLING = "BILLING"
    ADMIN = "ADMIN"


CARE_TEAM = frozenset({Role.CLINICIAN, Role.NURSE, Role.ADMIN})
STAFF = frozenset({Role.CLINICIAN, Role.NURSE, Role.FRONT_DESK, Role.BILLING, Role.ADMIN})
EVERYONE = frozenset(Role)


@dataclass(frozen=True)
class Principal:
    """The authenticated caller, decoded from a verified access token."""

    user_id: str
    role: Role
    patient_id: str | None = None
    clinician_id: str | None = None

    @property
    def is_patient(self) -> bool:
        return self.role is Role.PATIENT

    @property
    def is_staff(self) -> bool:
        return self.role in STAFF

    def can(self, allowed: frozenset[Role]) -> bool:
        return self.role in allowed
