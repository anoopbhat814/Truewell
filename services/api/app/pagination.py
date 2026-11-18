from typing import Generic, TypeVar

from fastapi import Query
from pydantic import BaseModel

T = TypeVar("T")


class PageParams:
    def __init__(
        self,
        offset: int = Query(0, ge=0),
        limit: int = Query(25, ge=1, le=100),
    ) -> None:
        self.offset = offset
        self.limit = limit


class Page(BaseModel, Generic[T]):
    items: list[T]
    total: int
    offset: int
    limit: int

    @property
    def has_more(self) -> bool:
        return self.offset + len(self.items) < self.total
