from datetime import timedelta

import pytest

from app.errors import ConflictError, ForbiddenError, ValidationFailed
from app.repositories.appointment import AppointmentRepository
from app.schemas.appointment import AppointmentCreate, AppointmentUpdate
from app.services.appointment import AppointmentService


def payload(start, minutes=20, **kw):
    data = dict(patient_id="p-1", clinician_id="c-1", type_id="t-1", starts_at=start, ends_at=start + timedelta(minutes=minutes))
    data.update(kw)
    return AppointmentCreate(**data)


def test_double_booking_is_rejected(session, clinician_actor, tomorrow):
    svc = AppointmentService(AppointmentRepository(session))
    svc.create(payload(tomorrow), clinician_actor)
    with pytest.raises(ConflictError):
        svc.create(payload(tomorrow + timedelta(minutes=10)), clinician_actor)
    svc.create(payload(tomorrow + timedelta(minutes=20)), clinician_actor)


def test_past_and_inverted_windows(session, clinician_actor, tomorrow):
    svc = AppointmentService(AppointmentRepository(session))
    with pytest.raises(ValidationFailed):
        svc.create(payload(tomorrow, minutes=-5), clinician_actor)
    with pytest.raises(ValidationFailed):
        svc.create(payload(tomorrow - timedelta(days=3)), clinician_actor)


def test_patient_requests_start_as_requested(session, patient_actor, tomorrow):
    svc = AppointmentService(AppointmentRepository(session))
    appt = svc.create(payload(tomorrow, status="CONFIRMED"), patient_actor)
    assert appt.status == "REQUESTED"


def test_patient_may_only_cancel(session, patient_actor, clinician_actor, tomorrow):
    svc = AppointmentService(AppointmentRepository(session))
    appt = svc.create(payload(tomorrow), patient_actor)
    with pytest.raises(ForbiddenError):
        svc.update(appt.id, AppointmentUpdate(status="CONFIRMED"), patient_actor)
    svc.update(appt.id, AppointmentUpdate(status="CONFIRMED"), clinician_actor)
    cancelled = svc.update(appt.id, AppointmentUpdate(status="CANCELLED", cancel_reason="Conflict"), patient_actor)
    assert cancelled.status == "CANCELLED"
