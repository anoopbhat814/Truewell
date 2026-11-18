from app.models.care_plan_goal import CarePlanGoal
from app.repositories.base import BaseRepository


class CarePlanGoalRepository(BaseRepository[CarePlanGoal]):
    model = CarePlanGoal
    order_by = "id"

    def by_care_plan_id(self, value, *, limit: int = 100) -> list[CarePlanGoal]:
        return self.list(limit=limit, **{"care_plan_id": value})
