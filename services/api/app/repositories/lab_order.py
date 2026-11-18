from app.models.lab_order import LabOrder
from app.repositories.base import BaseRepository


class LabOrderRepository(BaseRepository[LabOrder]):
    model = LabOrder
    order_by = "id"

    def by_status(self, value, *, limit: int = 100) -> list[LabOrder]:
        return self.list(limit=limit, **{"status": value})
