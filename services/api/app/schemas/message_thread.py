from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field



class MessageThreadCreate(BaseModel):
    patient_id: str
    clinician_id: str | None = None
    subject: str = Field(min_length=1, max_length=255)
    archived: bool = False


class MessageThreadUpdate(BaseModel):
    patient_id: str | None = None
    clinician_id: str | None = None
    subject: str | None = None
    archived: bool | None = None


class MessageThreadRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    clinician_id: str | None
    subject: str
    archived: bool
    last_message_at: datetime
