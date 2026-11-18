from datetime import date
from typing import Any

from sqlalchemy import func, select

from app.core.rbac import Principal
from app.errors import ConflictError, ValidationFailed
from app.models.care_plan import CarePlan
from app.models.care_plan_task import CarePlanTask
from app.services.crud import CrudService

PLAN_TRANSITIONS = {
    "DRAFT": {"ACTIVE", "REVOKED"},
    "ACTIVE": {"ON_HOLD", "COMPLETED", "REVOKED"},
    "ON_HOLD": {"ACTIVE", "REVOKED"},
    "COMPLETED": set(),
    "REVOKED": set(),
}


class CarePlanService(CrudService[CarePlan]):
    entity = "care_plan"

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        ends: date | None = data.get("ends_on")
        if ends is not None and ends < data["starts_on"]:
            raise ValidationFailed("Care plan cannot end before it starts")
        return super().before_create(data, actor)

    def before_update(self, obj: CarePlan, changes: dict[str, Any], actor: Principal) -> dict[str, Any]:
        target = changes.get("status")
        if target is not None:
            target = getattr(target, "value", target)
            changes["status"] = target
            if target not in PLAN_TRANSITIONS[obj.status]:
                raise ConflictError(f"Cannot move care plan from {obj.status} to {target}")
            if target == "COMPLETED" and self.open_task_count(obj.id) > 0:
                raise ConflictError("Complete or remove open tasks before closing the plan")
        return changes

    def open_task_count(self, plan_id: str) -> int:
        stmt = select(func.count()).select_from(CarePlanTask).where(
            CarePlanTask.care_plan_id == plan_id, CarePlanTask.completed_at.is_(None)
        )
        return int(self.session.scalar(stmt) or 0)

    def progress(self, plan_id: str, actor: Principal) -> dict[str, float | int]:
        self.get(plan_id, actor)
        total = int(self.session.scalar(select(func.count()).select_from(CarePlanTask).where(CarePlanTask.care_plan_id == plan_id)) or 0)
        open_ = self.open_task_count(plan_id)
        done = total - open_
        return {"total": total, "completed": done, "percent": round(100 * done / total, 1) if total else 0.0}
