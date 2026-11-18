from datetime import date

import pytest

from app.errors import ConflictError, ForbiddenError, ValidationFailed
from app.models.patient import Patient
from app.repositories.patient import PatientRepository
from app.schemas.patient import PatientCreate
from app.services.patient import PatientService, age_on


def make_payload(**kw):
    base = dict(user_id="u1", mrn="MRN-1", first_name="Ana", last_name="Lopez", date_of_birth=date(1990, 5, 17))
    base.update(kw)
    return PatientCreate(**base)


def test_age_calculation_handles_birthdays():
    assert age_on(date(2000, 6, 15), date(2025, 6, 14)) == 24
    assert age_on(date(2000, 6, 15), date(2025, 6, 15)) == 25


def test_create_and_duplicate_mrn(session, clinician_actor):
    service = PatientService(PatientRepository(session))
    created = service.create(make_payload(), clinician_actor)
    assert created.full_name == "Ana Lopez"
    with pytest.raises(ConflictError):
        service.create(make_payload(user_id="u2"), clinician_actor)


def test_future_birth_date_rejected(session, clinician_actor):
    service = PatientService(PatientRepository(session))
    with pytest.raises(ValidationFailed):
        service.create(make_payload(date_of_birth=date(2999, 1, 1)), clinician_actor)


def test_patient_cannot_read_other_patient(session, clinician_actor, patient_actor):
    service = PatientService(PatientRepository(session))
    other = service.create(make_payload(), clinician_actor)
    with pytest.raises(ForbiddenError):
        service.get(other.id, patient_actor)


def test_patient_listing_is_self_scoped(session, clinician_actor, patient_actor):
    service = PatientService(PatientRepository(session))
    service.create(make_payload(), clinician_actor)
    items, total = service.list(patient_actor, offset=0, limit=10)
    assert items == [] and total == 0
