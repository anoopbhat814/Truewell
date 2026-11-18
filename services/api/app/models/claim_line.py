from sqlalchemy import Index, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, IdMixin


class ClaimLine(IdMixin, Base):
    __tablename__ = "claim_lines"
    __table_args__ = (Index("claim_lines_claim_id_idx", "claim_id"),)

    claim_id: Mapped[str] = mapped_column(ForeignKey("claims.id"))
    cpt_code: Mapped[str]
    icd10_code: Mapped[str]
    units: Mapped[int] = mapped_column(default=1)
    charge_cents: Mapped[int]
