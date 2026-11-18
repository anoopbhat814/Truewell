"""Structural checks that keep ORM models, schemas and routers aligned."""

import importlib

import pytest

from app.models import Base

DOMAINS = [
    ("patient", "Patient", "patients"),
    ("clinician", "Clinician", "clinicians"),
    ("organization", "Organization", "organizations"),
    ("location", "Location", "locations"),
    ("appointment_type", "AppointmentType", "appointment-types"),
    ("availability_slot", "AvailabilitySlot", "availability"),
    ("appointment", "Appointment", "appointments"),
    ("telehealth_session", "TelehealthSession", "telehealth/sessions"),
    ("telehealth_participant", "TelehealthParticipant", "telehealth/participants"),
    ("medication", "Medication", "medications"),
    ("pharmacy", "Pharmacy", "pharmacies"),
    ("prescription", "Prescription", "prescriptions"),
    ("allergy", "Allergy", "allergies"),
    ("lab_order", "LabOrder", "lab-orders"),
    ("lab_result", "LabResult", "lab-results"),
    ("care_plan", "CarePlan", "care-plans"),
    ("care_plan_goal", "CarePlanGoal", "care-plan-goals"),
    ("care_plan_task", "CarePlanTask", "care-plan-tasks"),
    ("message_thread", "MessageThread", "message-threads"),
    ("message", "Message", "messages"),
    ("message_attachment", "MessageAttachment", "message-attachments"),
    ("document", "Document", "documents"),
    ("insurance_policy", "InsurancePolicy", "insurance/policies"),
    ("claim", "Claim", "insurance/claims"),
    ("claim_line", "ClaimLine", "insurance/claim-lines"),
    ("reminder", "Reminder", "reminders"),
    ("notification", "Notification", "notifications"),
]


@pytest.mark.parametrize("module,cls,plural", DOMAINS)
def test_model_registered_with_metadata(module, cls, plural):
    model = getattr(importlib.import_module(f"app.models.{module}"), cls)
    assert model.__tablename__ in Base.metadata.tables
    assert "id" in model.__table__.c


@pytest.mark.parametrize("module,cls,plural", DOMAINS)
def test_read_schema_covers_model_columns(module, cls, plural):
    model = getattr(importlib.import_module(f"app.models.{module}"), cls)
    schema = getattr(importlib.import_module(f"app.schemas.{module}"), f"{cls}Read")
    missing = set(model.__table__.c.keys()) - set(schema.model_fields) - {"created_at", "updated_at"}
    assert not missing, f"{cls}Read is missing {missing}"


@pytest.mark.parametrize("module,cls,plural", DOMAINS)
def test_router_prefix_matches_resource(module, cls, plural):
    router = importlib.import_module(f"app.routers.{module}").router
    assert router.prefix == f"/{plural}"
    methods = {m for r in router.routes for m in r.methods}
    assert {"GET", "POST", "PATCH", "DELETE"} <= methods
