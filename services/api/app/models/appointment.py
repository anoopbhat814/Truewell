from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Appointment(IdMixin, Base):
    __tablename__ = "appointments"
    __table_args__ = (Index("appointments_patient_id_idx", "patient_id"), Index("appointments_clinician_id_idx", "clinician_id"), Index("appointments_type_id_idx", "type_id"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    clinician_id: Mapped[str] = mapped_column(ForeignKey("clinicians.id"))
    type_id: Mapped[str] = mapped_column(ForeignKey("appointment_types.id"))
    location_id: Mapped[str | None] = mapped_column(ForeignKey("locations.id"))
    status: Mapped[str] = mapped_column(default='REQUESTED')
    mode: Mapped[str] = mapped_column(default='IN_PERSON')
    starts_at: Mapped[datetime] = mapped_column(DateTime)
    ends_at: Mapped[datetime] = mapped_column(DateTime)
    reason: Mapped[str | None]
    cancel_reason: Mapped[str | None]
