from sqlalchemy import Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Pharmacy(IdMixin, Base):
    __tablename__ = "pharmacies"
    __table_args__ = (Index("pharmacies_city_idx", "city"), Index("pharmacies_region_idx", "region"),)

    name: Mapped[str]
    ncpdp_id: Mapped[str] = mapped_column(unique=True)
    phone: Mapped[str | None]
    city: Mapped[str]
    region: Mapped[str]
