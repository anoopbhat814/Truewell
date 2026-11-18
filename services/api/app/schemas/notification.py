from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import NotificationKind


class NotificationCreate(BaseModel):
    user_id: str
    kind: NotificationKind
    title: str = Field(min_length=1, max_length=255)
    body: str
    read_at: datetime | None = None


class NotificationUpdate(BaseModel):
    user_id: str | None = None
    kind: NotificationKind | None = None
    title: str | None = None
    body: str | None = None
    read_at: datetime | None = None


class NotificationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    kind: NotificationKind
    title: str
    body: str
    read_at: datetime | None
