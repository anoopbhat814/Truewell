from datetime import datetime

from sqlalchemy import Index, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class AvailabilitySlot(IdMixin, Base):
    __tablename__ = "availability_slots"
    __table_args__ = (Index("availability_slots_clinician_id_idx", "clinician_id"), Index("availability_slots_starts_at_idx", "starts_at"), Index("availability_slots_is_booked_idx", "is_booked"),)

    clinician_id: Mapped[str] = mapped_column(ForeignKey("clinicians.id"))
    starts_at: Mapped[datetime] = mapped_column(DateTime)
    ends_at: Mapped[datetime] = mapped_column(DateTime)
    is_booked: Mapped[bool] = mapped_column(default=False)
