from decimal import Decimal
from typing import Any

from app.core.rbac import Principal
from app.errors import ForbiddenError
from app.models.lab_order import LabOrder
from app.models.lab_result import LabResult
from app.services.crud import CrudService

CRITICAL_FACTOR = Decimal("0.5")


def classify(value: Decimal, low: Decimal | None, high: Decimal | None) -> str:
    """Return the abnormal flag for a numeric result against its reference range."""
    if low is not None and high is not None:
        span = high - low
        if value < low - span * CRITICAL_FACTOR:
            return "CRITICAL_LOW"
        if value > high + span * CRITICAL_FACTOR:
            return "CRITICAL_HIGH"
    if low is not None and value < low:
        return "LOW"
    if high is not None and value > high:
        return "HIGH"
    return "NORMAL"


class LabResultService(CrudService[LabResult]):
    entity = "lab_result"
    patient_field = None

    def scope(self, actor: Principal) -> dict[str, Any]:
        return {"released_to_patient": True} if actor.is_patient else {}

    def _check_access(self, actor: Principal, obj: LabResult) -> None:
        if not actor.is_patient:
            return
        order = self.session.get(LabOrder, obj.order_id)
        if order is None or order.patient_id != actor.patient_id or not obj.released_to_patient:
            raise ForbiddenError("This result has not been released to you")

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        data["flag"] = classify(Decimal(data["value"]), data.get("ref_low"), data.get("ref_high"))
        # Critical values are never auto-released; a clinician must review them first.
        if data["flag"].startswith("CRITICAL"):
            data["released_to_patient"] = False
        return data
