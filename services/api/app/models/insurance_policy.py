from datetime import date, datetime

from sqlalchemy import Index, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class InsurancePolicy(IdMixin, Base):
    __tablename__ = "insurance_policies"
    __table_args__ = (Index("insurance_policies_patient_id_idx", "patient_id"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    payer_name: Mapped[str]
    member_id: Mapped[str]
    group_number: Mapped[str | None]
    plan_type: Mapped[str]
    copay_cents: Mapped[int] = mapped_column(default=0)
    deductible_cents: Mapped[int] = mapped_column(default=0)
    effective_on: Mapped[date] = mapped_column(Date)
    terminates_on: Mapped[date | None] = mapped_column(Date)
