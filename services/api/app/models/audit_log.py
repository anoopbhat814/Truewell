from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.models.base import Base, IdMixin


class AuditLog(IdMixin, Base):
    __tablename__ = "audit_logs"
    __table_args__ = (
        Index("audit_logs_entity_type_entity_id_idx", "entity_type", "entity_id"),
        Index("audit_logs_actor_id_created_at_idx", "actor_id", "created_at"),
    )

    actor_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    action: Mapped[str]
    entity_type: Mapped[str]
    entity_id: Mapped[str]
    ip_address: Mapped[str | None]
    metadata_json: Mapped[str | None] = mapped_column("metadata", Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
