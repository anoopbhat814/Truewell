from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Organization(IdMixin, Base):
    __tablename__ = "organizations"

    name: Mapped[str]
    npi: Mapped[str | None] = mapped_column(unique=True)
    timezone: Mapped[str] = mapped_column(default='America/New_York')
