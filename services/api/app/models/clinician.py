from sqlalchemy import Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Clinician(IdMixin, Base):
    __tablename__ = "clinicians"
    __table_args__ = (Index("clinicians_user_id_idx", "user_id"), Index("clinicians_organization_id_idx", "organization_id"), Index("clinicians_specialty_idx", "specialty"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True)
    organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"))
    npi: Mapped[str] = mapped_column(unique=True)
    specialty: Mapped[str]
    title: Mapped[str | None]
    accepting_new: Mapped[bool] = mapped_column(default=True)
