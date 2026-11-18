from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class TelehealthSession(IdMixin, Base):
    __tablename__ = "telehealth_sessions"
    __table_args__ = (Index("telehealth_sessions_appointment_id_idx", "appointment_id"), Index("telehealth_sessions_status_idx", "status"),)

    appointment_id: Mapped[str] = mapped_column(ForeignKey("appointments.id"), unique=True)
    room_name: Mapped[str] = mapped_column(unique=True)
    status: Mapped[str] = mapped_column(default='SCHEDULED')
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime)
    recording_consent: Mapped[bool] = mapped_column(default=False)
