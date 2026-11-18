from app.core.phi import initials, mask_email, mask_member_id, mask_phone
from app.core.rbac import CARE_TEAM, STAFF, Principal, Role


def test_role_groups():
    assert Role.CLINICIAN in CARE_TEAM
    assert Role.BILLING in STAFF and Role.BILLING not in CARE_TEAM
    assert Role.PATIENT not in STAFF


def test_principal_helpers():
    p = Principal("u", Role.PATIENT, patient_id="p")
    assert p.is_patient and not p.is_staff
    assert p.can(frozenset({Role.PATIENT}))
    assert not p.can(CARE_TEAM)


def test_masking():
    assert mask_email("jane.doe@patients.example") == "j***@patients.example"
    assert mask_phone("+1 (555) 010-1234") == "***-***-1234"
    assert mask_member_id("EHP-5550001") == "EH*******01"
    assert mask_member_id("abc") == "****"
    assert initials("jo", "nguyen") == "JN"
