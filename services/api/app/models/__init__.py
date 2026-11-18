"""Import every model so Base.metadata is complete for migrations and tests."""

from app.models import (  # noqa: F401
    audit_log,
    user,
    patient,
    clinician,
    organization,
    location,
    appointment_type,
    availability_slot,
    appointment,
    telehealth_session,
    telehealth_participant,
    medication,
    pharmacy,
    prescription,
    allergy,
    lab_order,
    lab_result,
    care_plan,
    care_plan_goal,
    care_plan_task,
    message_thread,
    message,
    message_attachment,
    document,
    insurance_policy,
    claim,
    claim_line,
    reminder,
    notification,
)
from app.models.base import Base

__all__ = ["Base"]
