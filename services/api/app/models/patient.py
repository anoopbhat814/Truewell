from datetime import date, datetime

from sqlalchemy import Index, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Patient(IdMixin, Base):
    __tablename__ = "patients"
    __table_args__ = (Index("patients_user_id_idx", "user_id"), Index("patients_primary_clinician_id_idx", "primary_clinician_id"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True)
    mrn: Mapped[str] = mapped_column(unique=True)
    first_name: Mapped[str]
    last_name: Mapped[str]
    date_of_birth: Mapped[date] = mapped_column(Date)
    sex_at_birth: Mapped[str | None]
    phone: Mapped[str | None]
    preferred_lang: Mapped[str] = mapped_column(default='en')
    primary_clinician_id: Mapped[str | None]

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
