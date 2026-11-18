from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import LabStatus


class LabOrderCreate(BaseModel):
    patient_id: str
    clinician_id: str
    status: LabStatus = LabStatus.ORDERED
    panel_code: str = Field(min_length=1, max_length=255)
    collected_at: datetime | None = None


class LabOrderUpdate(BaseModel):
    patient_id: str | None = None
    clinician_id: str | None = None
    status: LabStatus | None = None
    panel_code: str | None = None
    collected_at: datetime | None = None


class LabOrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    clinician_id: str
    status: LabStatus
    panel_code: str
    collected_at: datetime | None
