from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Index, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.models.base import Base, IdMixin


class LabResult(IdMixin, Base):
    __tablename__ = "lab_results"
    __table_args__ = (Index("lab_results_order_id_idx", "order_id"), Index("lab_results_flag_idx", "flag"),)

    order_id: Mapped[str] = mapped_column(ForeignKey("lab_orders.id"))
    analyte: Mapped[str]
    loinc_code: Mapped[str | None]
    value: Mapped[Decimal] = mapped_column(Numeric(12, 4))
    unit: Mapped[str]
    ref_low: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    ref_high: Mapped[Decimal | None] = mapped_column(Numeric(12, 4))
    flag: Mapped[str] = mapped_column(default='NORMAL')
    released_to_patient: Mapped[bool] = mapped_column(default=False)
    resulted_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
