from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class TelehealthParticipant(IdMixin, Base):
    __tablename__ = "telehealth_participants"
    __table_args__ = (Index("telehealth_participants_session_id_idx", "session_id"), Index("telehealth_participants_user_id_idx", "user_id"),)

    session_id: Mapped[str] = mapped_column(ForeignKey("telehealth_sessions.id"))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    role: Mapped[str]
    joined_at: Mapped[datetime | None] = mapped_column(DateTime)
    left_at: Mapped[datetime | None] = mapped_column(DateTime)
    connection_quality: Mapped[int | None]
