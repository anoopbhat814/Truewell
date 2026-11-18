from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import AppointmentMode, AppointmentStatus


class AppointmentCreate(BaseModel):
    patient_id: str
    clinician_id: str
    type_id: str
    location_id: str | None = None
    status: AppointmentStatus = AppointmentStatus.REQUESTED
    mode: AppointmentMode = AppointmentMode.IN_PERSON
    starts_at: datetime
    ends_at: datetime
    reason: str | None = None
    cancel_reason: str | None = None


class AppointmentUpdate(BaseModel):
    patient_id: str | None = None
    clinician_id: str | None = None
    type_id: str | None = None
    location_id: str | None = None
    status: AppointmentStatus | None = None
    mode: AppointmentMode | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    reason: str | None = None
    cancel_reason: str | None = None


class AppointmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    clinician_id: str
    type_id: str
    location_id: str | None
    status: AppointmentStatus
    mode: AppointmentMode
    starts_at: datetime
    ends_at: datetime
    reason: str | None
    cancel_reason: str | None
