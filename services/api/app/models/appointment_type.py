from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class AppointmentType(IdMixin, Base):
    __tablename__ = "appointment_types"

    code: Mapped[str] = mapped_column(unique=True)
    label: Mapped[str]
    duration_minutes: Mapped[int]
    telehealth_ok: Mapped[bool] = mapped_column(default=True)
    price_cents: Mapped[int] = mapped_column(default=0)
