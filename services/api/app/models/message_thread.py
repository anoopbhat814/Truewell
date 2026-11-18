from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.models.base import Base, IdMixin


class MessageThread(IdMixin, Base):
    __tablename__ = "message_threads"
    __table_args__ = (Index("message_threads_patient_id_idx", "patient_id"), Index("message_threads_clinician_id_idx", "clinician_id"), Index("message_threads_archived_idx", "archived"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    clinician_id: Mapped[str | None] = mapped_column(ForeignKey("clinicians.id"))
    subject: Mapped[str]
    archived: Mapped[bool] = mapped_column(default=False)
    last_message_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
