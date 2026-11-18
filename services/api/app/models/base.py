import uuid
from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from app.core.clock import utcnow


def new_id() -> str:
    return uuid.uuid4().hex


class Base(DeclarativeBase):
    pass


class IdMixin:
    id: Mapped[str] = mapped_column(primary_key=True, default=new_id)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
