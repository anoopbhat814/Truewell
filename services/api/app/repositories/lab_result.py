from app.models.lab_result import LabResult
from app.repositories.base import BaseRepository


class LabResultRepository(BaseRepository[LabResult]):
    model = LabResult
    order_by = "resulted_at"

    def by_order_id(self, value, *, limit: int = 100) -> list[LabResult]:
        return self.list(limit=limit, **{"order_id": value})

    def by_flag(self, value, *, limit: int = 100) -> list[LabResult]:
        return self.list(limit=limit, **{"flag": value})
