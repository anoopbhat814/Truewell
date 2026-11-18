from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Claim(IdMixin, Base):
    __tablename__ = "claims"
    __table_args__ = (Index("claims_patient_id_idx", "patient_id"), Index("claims_policy_id_idx", "policy_id"), Index("claims_appointment_id_idx", "appointment_id"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    policy_id: Mapped[str] = mapped_column(ForeignKey("insurance_policies.id"))
    appointment_id: Mapped[str | None] = mapped_column(ForeignKey("appointments.id"))
    status: Mapped[str] = mapped_column(default='DRAFT')
    total_cents: Mapped[int]
    allowed_cents: Mapped[int | None]
    paid_cents: Mapped[int | None]
    denial_code: Mapped[str | None]
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime)
    adjudicated_at: Mapped[datetime | None] = mapped_column(DateTime)
