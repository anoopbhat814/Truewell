
from pydantic import BaseModel, ConfigDict, Field



class PharmacyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    ncpdp_id: str = Field(min_length=1, max_length=255)
    phone: str | None = None
    city: str = Field(min_length=1, max_length=255)
    region: str = Field(min_length=1, max_length=255)


class PharmacyUpdate(BaseModel):
    name: str | None = None
    ncpdp_id: str | None = None
    phone: str | None = None
    city: str | None = None
    region: str | None = None


class PharmacyRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    ncpdp_id: str
    phone: str | None
    city: str
    region: str
