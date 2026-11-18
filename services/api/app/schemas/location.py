
from pydantic import BaseModel, ConfigDict, Field



class LocationCreate(BaseModel):
    organization_id: str
    name: str = Field(min_length=1, max_length=255)
    address_line1: str = Field(min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=255)
    region: str = Field(min_length=1, max_length=255)
    postal_code: str = Field(min_length=1, max_length=255)
    phone: str | None = None


class LocationUpdate(BaseModel):
    organization_id: str | None = None
    name: str | None = None
    address_line1: str | None = None
    city: str | None = None
    region: str | None = None
    postal_code: str | None = None
    phone: str | None = None


class LocationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    organization_id: str
    name: str
    address_line1: str
    city: str
    region: str
    postal_code: str
    phone: str | None
