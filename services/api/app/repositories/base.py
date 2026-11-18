from typing import Any, Generic, TypeVar

from sqlalchemy import func, select
from sqlalchemy.orm import Session

ModelT = TypeVar("ModelT")


class BaseRepository(Generic[ModelT]):
    """Thin data-access layer over a single SQLAlchemy model."""

    model: type[ModelT]
    order_by: str = "created_at"

    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, entity_id: str) -> ModelT | None:
        return self.session.get(self.model, entity_id)

    def _filtered(self, filters: dict[str, Any]):
        stmt = select(self.model)
        for key, value in filters.items():
            if value is None:
                continue
            column = getattr(self.model, key, None)
            if column is None:
                raise ValueError(f"{self.model.__name__} has no column {key!r}")
            stmt = stmt.where(column == value)
        return stmt

    def list(self, *, offset: int = 0, limit: int = 25, desc: bool = True, **filters: Any) -> list[ModelT]:
        stmt = self._filtered(filters)
        column = getattr(self.model, self.order_by, None)
        if column is not None:
            stmt = stmt.order_by(column.desc() if desc else column.asc())
        return list(self.session.scalars(stmt.offset(offset).limit(limit)))

    def count(self, **filters: Any) -> int:
        stmt = self._filtered(filters).with_only_columns(func.count()).order_by(None)
        return int(self.session.scalar(stmt) or 0)

    def add(self, entity: ModelT) -> ModelT:
        self.session.add(entity)
        self.session.flush()
        return entity

    def update(self, entity: ModelT, changes: dict[str, Any]) -> ModelT:
        for key, value in changes.items():
            setattr(entity, key, value)
        self.session.flush()
        return entity

    def delete(self, entity: ModelT) -> None:
        self.session.delete(entity)
        self.session.flush()
