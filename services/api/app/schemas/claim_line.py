
from pydantic import BaseModel, ConfigDict, Field



class ClaimLineCreate(BaseModel):
    claim_id: str
    cpt_code: str = Field(min_length=1, max_length=255)
    icd10_code: str = Field(min_length=1, max_length=255)
    units: int = 1
    charge_cents: int


class ClaimLineUpdate(BaseModel):
    claim_id: str | None = None
    cpt_code: str | None = None
    icd10_code: str | None = None
    units: int | None = None
    charge_cents: int | None = None


class ClaimLineRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    claim_id: str
    cpt_code: str
    icd10_code: str
    units: int
    charge_cents: int
