from sqlalchemy import Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class MessageAttachment(IdMixin, Base):
    __tablename__ = "message_attachments"
    __table_args__ = (Index("message_attachments_message_id_idx", "message_id"),)

    message_id: Mapped[str] = mapped_column(ForeignKey("messages.id"))
    file_name: Mapped[str]
    mime_type: Mapped[str]
    size_bytes: Mapped[int]
    storage_key: Mapped[str] = mapped_column(unique=True)
