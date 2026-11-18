from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class LabOrder(IdMixin, Base):
    __tablename__ = "lab_orders"
    __table_args__ = (Index("lab_orders_patient_id_idx", "patient_id"), Index("lab_orders_clinician_id_idx", "clinician_id"), Index("lab_orders_status_idx", "status"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    clinician_id: Mapped[str] = mapped_column(ForeignKey("clinicians.id"))
    status: Mapped[str] = mapped_column(default='ORDERED')
    panel_code: Mapped[str]
    collected_at: Mapped[datetime | None] = mapped_column(DateTime)
