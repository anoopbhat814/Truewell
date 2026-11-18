from datetime import datetime

from sqlalchemy import DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.models.base import Base, IdMixin, TimestampMixin


class User(IdMixin, TimestampMixin, Base):
    __tablename__ = "users"
    __table_args__ = (Index("users_role_idx", "role"),)

    email: Mapped[str] = mapped_column(unique=True)
    password_hash: Mapped[str]
    role: Mapped[str] = mapped_column(default="PATIENT")
    display_name: Mapped[str]
    mfa_enabled: Mapped[bool] = mapped_column(default=False)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)


class AuthSession(IdMixin, TimestampMixin, Base):
    __tablename__ = "sessions"

    user_id: Mapped[str]
    token_hash: Mapped[str] = mapped_column(unique=True)
    user_agent: Mapped[str | None]
    ip_address: Mapped[str | None]
    expires_at: Mapped[datetime] = mapped_column(DateTime)
