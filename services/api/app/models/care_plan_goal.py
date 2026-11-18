from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Index, Date, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class CarePlanGoal(IdMixin, Base):
    __tablename__ = "care_plan_goals"
    __table_args__ = (Index("care_plan_goals_care_plan_id_idx", "care_plan_id"),)

    care_plan_id: Mapped[str] = mapped_column(ForeignKey("care_plans.id"))
    description: Mapped[str]
    metric: Mapped[str | None]
    target_value: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    target_date: Mapped[date | None] = mapped_column(Date)
    achieved_at: Mapped[datetime | None] = mapped_column(DateTime)
