from datetime import date

from pydantic import BaseModel, ConfigDict, Field



class InsurancePolicyCreate(BaseModel):
    patient_id: str
    payer_name: str = Field(min_length=1, max_length=255)
    member_id: str = Field(min_length=1, max_length=255)
    group_number: str | None = None
    plan_type: str = Field(min_length=1, max_length=255)
    copay_cents: int = 0
    deductible_cents: int = 0
    effective_on: date
    terminates_on: date | None = None


class InsurancePolicyUpdate(BaseModel):
    patient_id: str | None = None
    payer_name: str | None = None
    member_id: str | None = None
    group_number: str | None = None
    plan_type: str | None = None
    copay_cents: int | None = None
    deductible_cents: int | None = None
    effective_on: date | None = None
    terminates_on: date | None = None


class InsurancePolicyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    payer_name: str
    member_id: str
    group_number: str | None
    plan_type: str
    copay_cents: int
    deductible_cents: int
    effective_on: date
    terminates_on: date | None
