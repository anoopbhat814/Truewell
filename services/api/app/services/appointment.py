from datetime import timedelta
from typing import Any

from sqlalchemy import select

from app.core.clock import utcnow
from app.core.rbac import Principal
from app.errors import ConflictError, ForbiddenError, ValidationFailed
from app.models.appointment import Appointment
from app.models.enums import AppointmentStatus
from app.services.crud import CrudService
from app.services.scheduling import Window, first_conflict

ALLOWED_TRANSITIONS: dict[str, set[str]] = {
    "REQUESTED": {"CONFIRMED", "CANCELLED"},
    "CONFIRMED": {"CHECKED_IN", "CANCELLED", "NO_SHOW"},
    "CHECKED_IN": {"IN_PROGRESS", "CANCELLED"},
    "IN_PROGRESS": {"COMPLETED"},
    "COMPLETED": set(),
    "CANCELLED": set(),
    "NO_SHOW": set(),
}

MIN_CANCEL_NOTICE = timedelta(hours=2)


def can_transition(current: str, target: str) -> bool:
    return target in ALLOWED_TRANSITIONS.get(current, set())


class AppointmentService(CrudService[Appointment]):
    entity = "appointment"

    def _clinician_windows(self, clinician_id: str, exclude_id: str | None = None) -> list[Window]:
        stmt = select(Appointment).where(
            Appointment.clinician_id == clinician_id,
            Appointment.status.notin_([AppointmentStatus.CANCELLED.value, AppointmentStatus.NO_SHOW.value]),
            Appointment.ends_at > utcnow(),
        )
        return [Window(a.starts_at, a.ends_at) for a in self.session.scalars(stmt) if a.id != exclude_id]

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        data = super().before_create(data, actor)
        if data["ends_at"] <= data["starts_at"]:
            raise ValidationFailed("Appointment must end after it starts")
        if data["starts_at"] < utcnow():
            raise ValidationFailed("Appointments cannot be booked in the past")
        conflict = first_conflict(Window(data["starts_at"], data["ends_at"]), self._clinician_windows(data["clinician_id"]))
        if conflict:
            raise ConflictError("The clinician is not available at that time", details={"conflicts_with": conflict.start.isoformat()})
        data["status"] = AppointmentStatus.REQUESTED.value if actor.is_patient else data.get("status", "REQUESTED")
        return data

    def before_update(self, obj: Appointment, changes: dict[str, Any], actor: Principal) -> dict[str, Any]:
        target = changes.get("status")
        if target is not None:
            target = getattr(target, "value", target)
            changes["status"] = target
            if not can_transition(obj.status, target):
                raise ValidationFailed(f"Cannot move appointment from {obj.status} to {target}")
            if actor.is_patient and target not in {"CANCELLED"}:
                raise ForbiddenError("Patients may only cancel their own appointments")
            if target == "CANCELLED" and obj.starts_at - utcnow() < MIN_CANCEL_NOTICE and actor.is_patient:
                raise ConflictError("Appointments inside the cancellation window must be cancelled by phone")
        if {"starts_at", "ends_at"} & changes.keys():
            start = changes.get("starts_at", obj.starts_at)
            end = changes.get("ends_at", obj.ends_at)
            if first_conflict(Window(start, end), self._clinician_windows(obj.clinician_id, exclude_id=obj.id)):
                raise ConflictError("The clinician is not available at that time")
        return changes
