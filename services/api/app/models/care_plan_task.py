from datetime import date, datetime

from sqlalchemy import Index, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class CarePlanTask(IdMixin, Base):
    __tablename__ = "care_plan_tasks"
    __table_args__ = (Index("care_plan_tasks_care_plan_id_idx", "care_plan_id"),)

    care_plan_id: Mapped[str] = mapped_column(ForeignKey("care_plans.id"))
    title: Mapped[str]
    assignee: Mapped[str] = mapped_column(default='PATIENT')
    due_on: Mapped[date | None] = mapped_column(Date)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
