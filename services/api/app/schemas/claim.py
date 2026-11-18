from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ClaimStatus


class ClaimCreate(BaseModel):
    patient_id: str
    policy_id: str
    appointment_id: str | None = None
    status: ClaimStatus = ClaimStatus.DRAFT
    total_cents: int
    allowed_cents: int | None = None
    paid_cents: int | None = None
    denial_code: str | None = None
    submitted_at: datetime | None = None
    adjudicated_at: datetime | None = None


class ClaimUpdate(BaseModel):
    patient_id: str | None = None
    policy_id: str | None = None
    appointment_id: str | None = None
    status: ClaimStatus | None = None
    total_cents: int | None = None
    allowed_cents: int | None = None
    paid_cents: int | None = None
    denial_code: str | None = None
    submitted_at: datetime | None = None
    adjudicated_at: datetime | None = None


class ClaimRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    policy_id: str
    appointment_id: str | None
    status: ClaimStatus
    total_cents: int
    allowed_cents: int | None
    paid_cents: int | None
    denial_code: str | None
    submitted_at: datetime | None
    adjudicated_at: datetime | None
