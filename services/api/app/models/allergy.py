from sqlalchemy import Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Allergy(IdMixin, Base):
    __tablename__ = "allergies"
    __table_args__ = (Index("allergies_patient_id_idx", "patient_id"),)

    patient_id: Mapped[str] = mapped_column(ForeignKey("patients.id"))
    substance: Mapped[str]
    reaction: Mapped[str | None]
    severity: Mapped[str] = mapped_column(default='moderate')
