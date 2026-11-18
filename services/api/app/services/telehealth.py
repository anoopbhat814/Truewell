import hashlib
import hmac
from datetime import timedelta
from typing import Any

from app.config import get_settings
from app.core.clock import utcnow
from app.core.rbac import Principal
from app.errors import ConflictError, ForbiddenError, NotFoundError
from app.models.appointment import Appointment
from app.models.telehealth_session import TelehealthSession
from app.services.crud import CrudService

JOIN_WINDOW_BEFORE = timedelta(minutes=10)
JOIN_WINDOW_AFTER = timedelta(minutes=30)


def sign_join_token(room_name: str, user_id: str, expires_epoch: int) -> str:
    key = get_settings().video_signing_key.encode()
    message = f"{room_name}:{user_id}:{expires_epoch}".encode()
    return hmac.new(key, message, hashlib.sha256).hexdigest()


class TelehealthService(CrudService[TelehealthSession]):
    entity = "telehealth_session"
    patient_field = None

    def _appointment(self, session_obj: TelehealthSession) -> Appointment:
        appt = self.session.get(Appointment, session_obj.appointment_id)
        if appt is None:
            raise NotFoundError("Appointment for this session no longer exists")
        return appt

    def _check_access(self, actor: Principal, obj: TelehealthSession) -> None:
        if actor.is_patient and self._appointment(obj).patient_id != actor.patient_id:
            raise ForbiddenError("You are not a participant in this session")

    def join(self, session_id: str, actor: Principal) -> dict[str, Any]:
        obj = self.get(session_id, actor)
        appt = self._appointment(obj)
        now = utcnow()
        if now < appt.starts_at - JOIN_WINDOW_BEFORE:
            raise ConflictError("The waiting room opens 10 minutes before the appointment")
        if now > appt.ends_at + JOIN_WINDOW_AFTER or obj.status in {"ENDED", "FAILED"}:
            raise ConflictError("This session has ended")
        if obj.status == "SCHEDULED":
            obj.status = "WAITING_ROOM" if actor.is_patient else "LIVE"
        if not actor.is_patient and obj.started_at is None:
            obj.status = "LIVE"
            obj.started_at = now
        expires = int((now + timedelta(minutes=30)).timestamp())
        settings = get_settings()
        return {
            "room": obj.room_name,
            "url": f"{settings.video_provider_url}/rooms/{obj.room_name}",
            "token": sign_join_token(obj.room_name, actor.user_id, expires),
            "expires_at": expires,
        }

    def end(self, session_id: str, actor: Principal) -> TelehealthSession:
        obj = self.get(session_id, actor)
        if obj.status != "LIVE":
            raise ConflictError("Only a live session can be ended")
        obj.status = "ENDED"
        obj.ended_at = utcnow()
        self.session.flush()
        return obj
