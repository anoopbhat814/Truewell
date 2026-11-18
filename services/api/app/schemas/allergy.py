
from pydantic import BaseModel, ConfigDict, Field



class AllergyCreate(BaseModel):
    patient_id: str
    substance: str = Field(min_length=1, max_length=255)
    reaction: str | None = None
    severity: str = 'moderate'


class AllergyUpdate(BaseModel):
    patient_id: str | None = None
    substance: str | None = None
    reaction: str | None = None
    severity: str | None = None


class AllergyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    patient_id: str
    substance: str
    reaction: str | None
    severity: str
