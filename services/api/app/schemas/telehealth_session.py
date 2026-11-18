from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import SessionStatus


class TelehealthSessionCreate(BaseModel):
    appointment_id: str
    room_name: str = Field(min_length=1, max_length=255)
    status: SessionStatus = SessionStatus.SCHEDULED
    started_at: datetime | None = None
    ended_at: datetime | None = None
    recording_consent: bool = False


class TelehealthSessionUpdate(BaseModel):
    appointment_id: str | None = None
    room_name: str | None = None
    status: SessionStatus | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    recording_consent: bool | None = None


class TelehealthSessionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    appointment_id: str
    room_name: str
    status: SessionStatus
    started_at: datetime | None
    ended_at: datetime | None
    recording_consent: bool
