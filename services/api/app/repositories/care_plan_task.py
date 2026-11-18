from app.models.care_plan_task import CarePlanTask
from app.repositories.base import BaseRepository


class CarePlanTaskRepository(BaseRepository[CarePlanTask]):
    model = CarePlanTask
    order_by = "id"

    def by_care_plan_id(self, value, *, limit: int = 100) -> list[CarePlanTask]:
        return self.list(limit=limit, **{"care_plan_id": value})
