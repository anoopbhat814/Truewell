from sqlalchemy import Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class Location(IdMixin, Base):
    __tablename__ = "locations"
    __table_args__ = (Index("locations_organization_id_idx", "organization_id"),)

    organization_id: Mapped[str] = mapped_column(ForeignKey("organizations.id"))
    name: Mapped[str]
    address_line1: Mapped[str]
    city: Mapped[str]
    region: Mapped[str]
    postal_code: Mapped[str]
    phone: Mapped[str | None]
