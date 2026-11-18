from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field



class DocumentCreate(BaseModel):
    patient_id: str
    title: str = Field(min_length=1, max_length=255)
    category: str = Field(min_length=1, max_length=255)
    storage_key: str = Field(min_length=1, max_length=255)


class DocumentUpdate(BaseModel):
    patient_id: str | None = None
    title: str | None = None
    category: str | None = None
    storage_key: str | None = None


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    title: str
    category: str
    storage_key: str
    uploaded_at: datetime
