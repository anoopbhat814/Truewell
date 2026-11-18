from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field



class TelehealthParticipantCreate(BaseModel):
    session_id: str
    user_id: str
    role: str = Field(min_length=1, max_length=255)
    joined_at: datetime | None = None
    left_at: datetime | None = None
    connection_quality: int | None = None


class TelehealthParticipantUpdate(BaseModel):
    session_id: str | None = None
    user_id: str | None = None
    role: str | None = None
    joined_at: datetime | None = None
    left_at: datetime | None = None
    connection_quality: int | None = None


class TelehealthParticipantRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    session_id: str
    user_id: str
    role: str
    joined_at: datetime | None
    left_at: datetime | None
    connection_quality: int | None
