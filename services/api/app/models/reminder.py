from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.models.base import Base, IdMixin


class Reminder(IdMixin, Base):
    __tablename__ = "reminders"
    __table_args__ = (Index("reminders_patient_id_idx", "patient_id"), Index("reminders_appointment_id_idx", "appointment_id"), Index("reminders_channel_idx", "channel"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    appointment_id: Mapped[str | None] = mapped_column(ForeignKey("appointments.id"))
    channel: Mapped[str]
    status: Mapped[str] = mapped_column(default='PENDING')
    message: Mapped[str]
    send_at: Mapped[datetime] = mapped_column(DateTime)
    sent_at: Mapped[datetime | None] = mapped_column(DateTime)
    attempts: Mapped[int] = mapped_column(default=0)
    last_error: Mapped[str | None]
