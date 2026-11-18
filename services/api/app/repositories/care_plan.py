from app.models.care_plan import CarePlan
from app.repositories.base import BaseRepository


class CarePlanRepository(BaseRepository[CarePlan]):
    model = CarePlan
    order_by = "id"

    def by_status(self, value, *, limit: int = 100) -> list[CarePlan]:
        return self.list(limit=limit, **{"status": value})
