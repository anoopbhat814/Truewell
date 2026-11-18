
from pydantic import BaseModel, ConfigDict, Field



class AppointmentTypeCreate(BaseModel):
    code: str = Field(min_length=1, max_length=255)
    label: str = Field(min_length=1, max_length=255)
    duration_minutes: int
    telehealth_ok: bool = True
    price_cents: int = 0


class AppointmentTypeUpdate(BaseModel):
    code: str | None = None
    label: str | None = None
    duration_minutes: int | None = None
    telehealth_ok: bool | None = None
    price_cents: int | None = None


class AppointmentTypeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    label: str
    duration_minutes: int
    telehealth_ok: bool
    price_cents: int
