from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field



class MessageCreate(BaseModel):
    thread_id: str
    sender_id: str | None = None
    body: str
    read_at: datetime | None = None


class MessageUpdate(BaseModel):
    thread_id: str | None = None
    sender_id: str | None = None
    body: str | None = None
    read_at: datetime | None = None


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    thread_id: str
    sender_id: str
    body: str
    read_at: datetime | None
    sent_at: datetime
