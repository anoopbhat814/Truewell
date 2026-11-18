from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Medication(IdMixin, Base):
    __tablename__ = "medications"

    rxnorm_code: Mapped[str] = mapped_column(unique=True)
    name: Mapped[str]
    strength: Mapped[str | None]
    form: Mapped[str | None]
    is_controlled: Mapped[bool] = mapped_column(default=False)
