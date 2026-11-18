from datetime import date, datetime

from sqlalchemy import Index, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class CarePlan(IdMixin, Base):
    __tablename__ = "care_plans"
    __table_args__ = (Index("care_plans_patient_id_idx", "patient_id"), Index("care_plans_clinician_id_idx", "clinician_id"), Index("care_plans_status_idx", "status"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    clinician_id: Mapped[str] = mapped_column(ForeignKey("clinicians.id"))
    title: Mapped[str]
    status: Mapped[str] = mapped_column(default='DRAFT')
    starts_on: Mapped[date] = mapped_column(Date)
    ends_on: Mapped[date | None] = mapped_column(Date)
    summary: Mapped[str | None]
