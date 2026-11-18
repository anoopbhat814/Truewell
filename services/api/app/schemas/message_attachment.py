
from pydantic import BaseModel, ConfigDict, Field



class MessageAttachmentCreate(BaseModel):
    message_id: str
    file_name: str = Field(min_length=1, max_length=255)
    mime_type: str = Field(min_length=1, max_length=255)
    size_bytes: int
    storage_key: str = Field(min_length=1, max_length=255)


class MessageAttachmentUpdate(BaseModel):
    message_id: str | None = None
    file_name: str | None = None
    mime_type: str | None = None
    size_bytes: int | None = None
    storage_key: str | None = None


class MessageAttachmentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    message_id: str
    file_name: str
    mime_type: str
    size_bytes: int
    storage_key: str
