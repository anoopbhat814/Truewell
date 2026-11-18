from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field



class AvailabilitySlotCreate(BaseModel):
    clinician_id: str
    starts_at: datetime
    ends_at: datetime
    is_booked: bool = False


class AvailabilitySlotUpdate(BaseModel):
    clinician_id: str | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    is_booked: bool | None = None


class AvailabilitySlotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    clinician_id: str
    starts_at: datetime
    ends_at: datetime
    is_booked: bool
