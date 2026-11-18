from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.models.base import Base, IdMixin


class Document(IdMixin, Base):
    __tablename__ = "documents"
    __table_args__ = (Index("documents_patient_id_idx", "patient_id"), Index("documents_category_idx", "category"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    title: Mapped[str]
    category: Mapped[str]
    storage_key: Mapped[str] = mapped_column(unique=True)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
