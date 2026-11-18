from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import CarePlanStatus


class CarePlanCreate(BaseModel):
    patient_id: str
    clinician_id: str
    title: str = Field(min_length=1, max_length=255)
    status: CarePlanStatus = CarePlanStatus.DRAFT
    starts_on: date
    ends_on: date | None = None
    summary: str | None = None


class CarePlanUpdate(BaseModel):
    patient_id: str | None = None
    clinician_id: str | None = None
    title: str | None = None
    status: CarePlanStatus | None = None
    starts_on: date | None = None
    ends_on: date | None = None
    summary: str | None = None


class CarePlanRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    clinician_id: str
    title: str
    status: CarePlanStatus
    starts_on: date
    ends_on: date | None
    summary: str | None
