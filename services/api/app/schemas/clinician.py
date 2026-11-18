
from pydantic import BaseModel, ConfigDict, Field



class ClinicianCreate(BaseModel):
    user_id: str
    organization_id: str
    npi: str = Field(min_length=1, max_length=255)
    specialty: str = Field(min_length=1, max_length=255)
    title: str | None = None
    accepting_new: bool = True


class ClinicianUpdate(BaseModel):
    user_id: str | None = None
    organization_id: str | None = None
    npi: str | None = None
    specialty: str | None = None
    title: str | None = None
    accepting_new: bool | None = None


class ClinicianRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    organization_id: str
    npi: str
    specialty: str
    title: str | None
    accepting_new: bool
