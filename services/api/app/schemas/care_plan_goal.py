from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field



class CarePlanGoalCreate(BaseModel):
    care_plan_id: str
    description: str = Field(min_length=1, max_length=255)
    metric: str | None = None
    target_value: Decimal | None = None
    target_date: date | None = None
    achieved_at: datetime | None = None


class CarePlanGoalUpdate(BaseModel):
    care_plan_id: str | None = None
    description: str | None = None
    metric: str | None = None
    target_value: Decimal | None = None
    target_date: date | None = None
    achieved_at: datetime | None = None


class CarePlanGoalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    care_plan_id: str
    description: str
    metric: str | None
    target_value: Decimal | None
    target_date: date | None
    achieved_at: datetime | None
