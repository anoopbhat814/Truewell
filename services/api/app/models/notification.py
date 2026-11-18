from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Notification(IdMixin, Base):
    __tablename__ = "notifications"
    __table_args__ = (Index("notifications_user_id_idx", "user_id"), Index("notifications_kind_idx", "kind"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    kind: Mapped[str]
    title: Mapped[str]
    body: Mapped[str] = mapped_column(Text)
    read_at: Mapped[datetime | None] = mapped_column(DateTime)
