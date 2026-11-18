from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.models.base import Base, IdMixin


class Message(IdMixin, Base):
    __tablename__ = "messages"
    __table_args__ = (Index("messages_thread_id_idx", "thread_id"), Index("messages_sender_id_idx", "sender_id"), Index("messages_sent_at_idx", "sent_at"),)

    thread_id: Mapped[str] = mapped_column(ForeignKey("message_threads.id"))
    sender_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    body: Mapped[str] = mapped_column(Text)
    read_at: Mapped[datetime | None] = mapped_column(DateTime)
    sent_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
