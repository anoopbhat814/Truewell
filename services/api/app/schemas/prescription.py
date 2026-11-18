from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import PrescriptionStatus


class PrescriptionCreate(BaseModel):
    patient_id: str
    clinician_id: str
    medication_id: str
    pharmacy_id: str | None = None
    status: PrescriptionStatus = PrescriptionStatus.DRAFT
    dosage: str = Field(min_length=1, max_length=255)
    frequency: str = Field(min_length=1, max_length=255)
    quantity: int
    refills: int = 0
    instructions: str | None = None
    issued_at: datetime | None = None
    expires_at: datetime | None = None


class PrescriptionUpdate(BaseModel):
    patient_id: str | None = None
    clinician_id: str | None = None
    medication_id: str | None = None
    pharmacy_id: str | None = None
    status: PrescriptionStatus | None = None
    dosage: str | None = None
    frequency: str | None = None
    quantity: int | None = None
    refills: int | None = None
    instructions: str | None = None
    issued_at: datetime | None = None
    expires_at: datetime | None = None


class PrescriptionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    clinician_id: str
    medication_id: str
    pharmacy_id: str | None
    status: PrescriptionStatus
    dosage: str
    frequency: str
    quantity: int
    refills: int
    instructions: str | None
    issued_at: datetime | None
    expires_at: datetime | None
