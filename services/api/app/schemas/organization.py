
from pydantic import BaseModel, ConfigDict, Field



class OrganizationCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    npi: str | None = None
    timezone: str = 'America/New_York'


class OrganizationUpdate(BaseModel):
    name: str | None = None
    npi: str | None = None
    timezone: str | None = None


class OrganizationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    npi: str | None
    timezone: str
