import pytest

from app.errors import ForbiddenError, NotFoundError
from app.models.audit_log import AuditLog
from app.repositories.allergy import AllergyRepository
from app.schemas.allergy import AllergyCreate, AllergyUpdate
from app.services.crud import CrudService


def make_service(session):
    service = CrudService(AllergyRepository(session))
    service.entity = "allergy"
    return service


def test_patient_creates_only_for_self(session, patient_actor):
    svc = make_service(session)
    obj = svc.create(AllergyCreate(patient_id="someone-else", substance="Penicillin"), patient_actor)
    assert obj.patient_id == "p-1"


def test_update_and_audit_trail(session, clinician_actor):
    svc = make_service(session)
    obj = svc.create(AllergyCreate(patient_id="p-1", substance="Latex"), clinician_actor)
    svc.update(obj.id, AllergyUpdate(severity="severe"), clinician_actor)
    actions = [a.action for a in session.query(AuditLog).order_by(AuditLog.action)]
    assert "create" in actions and "update" in actions
    assert svc.get(obj.id, clinician_actor).severity == "severe"


def test_missing_entity(session, clinician_actor):
    with pytest.raises(NotFoundError):
        make_service(session).get("nope", clinician_actor)


def test_patient_blocked_from_foreign_record(session, clinician_actor, patient_actor):
    svc = make_service(session)
    obj = svc.create(AllergyCreate(patient_id="p-2", substance="Shellfish"), clinician_actor)
    with pytest.raises(ForbiddenError):
        svc.get(obj.id, patient_actor)


def test_pagination_counts(session, clinician_actor):
    svc = make_service(session)
    for name in ("A", "B", "C"):
        svc.create(AllergyCreate(patient_id="p-1", substance=name), clinician_actor)
    items, total = svc.list(clinician_actor, offset=0, limit=2)
    assert len(items) == 2 and total == 3
