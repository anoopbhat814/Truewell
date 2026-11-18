
from pydantic import BaseModel, ConfigDict, Field



class MedicationCreate(BaseModel):
    rxnorm_code: str = Field(min_length=1, max_length=255)
    name: str = Field(min_length=1, max_length=255)
    strength: str | None = None
    form: str | None = None
    is_controlled: bool = False


class MedicationUpdate(BaseModel):
    rxnorm_code: str | None = None
    name: str | None = None
    strength: str | None = None
    form: str | None = None
    is_controlled: bool | None = None


class MedicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    rxnorm_code: str
    name: str
    strength: str | None
    form: str | None
    is_controlled: bool
