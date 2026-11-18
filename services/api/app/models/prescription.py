from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Prescription(IdMixin, Base):
    __tablename__ = "prescriptions"
    __table_args__ = (Index("prescriptions_patient_id_idx", "patient_id"), Index("prescriptions_clinician_id_idx", "clinician_id"), Index("prescriptions_medication_id_idx", "medication_id"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    clinician_id: Mapped[str] = mapped_column(ForeignKey("clinicians.id"))
    medication_id: Mapped[str] = mapped_column(ForeignKey("medications.id"))
    pharmacy_id: Mapped[str | None] = mapped_column(ForeignKey("pharmacies.id"))
    status: Mapped[str] = mapped_column(default='DRAFT')
    dosage: Mapped[str]
    frequency: Mapped[str]
    quantity: Mapped[int]
    refills: Mapped[int] = mapped_column(default=0)
    instructions: Mapped[str | None]
    issued_at: Mapped[datetime | None] = mapped_column(DateTime)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime)
