from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field



class CarePlanTaskCreate(BaseModel):
    care_plan_id: str
    title: str = Field(min_length=1, max_length=255)
    assignee: str = 'PATIENT'
    due_on: date | None = None
    completed_at: datetime | None = None


class CarePlanTaskUpdate(BaseModel):
    care_plan_id: str | None = None
    title: str | None = None
    assignee: str | None = None
    due_on: date | None = None
    completed_at: datetime | None = None


class CarePlanTaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    care_plan_id: str
    title: str
    assignee: str
    due_on: date | None
    completed_at: datetime | None
