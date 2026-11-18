from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ReminderChannel, ReminderStatus


class ReminderCreate(BaseModel):
    patient_id: str
    appointment_id: str | None = None
    channel: ReminderChannel
    status: ReminderStatus = ReminderStatus.PENDING
    message: str = Field(min_length=1, max_length=255)
    send_at: datetime
    attempts: int = 0
    last_error: str | None = None


class ReminderUpdate(BaseModel):
    patient_id: str | None = None
    appointment_id: str | None = None
    channel: ReminderChannel | None = None
    status: ReminderStatus | None = None
    message: str | None = None
    send_at: datetime | None = None
    attempts: int | None = None
    last_error: str | None = None


class ReminderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    appointment_id: str | None
    channel: ReminderChannel
    status: ReminderStatus
    message: str
    send_at: datetime
    sent_at: datetime | None
    attempts: int
    last_error: str | None
