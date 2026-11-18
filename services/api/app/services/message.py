from typing import Any

from app.core.clock import utcnow
from app.core.rbac import Principal
from app.errors import ForbiddenError, NotFoundError, ValidationFailed
from app.models.message import Message
from app.models.message_thread import MessageThread
from app.services.crud import CrudService

MAX_BODY = 10_000


class MessageService(CrudService[Message]):
    entity = "message"
    patient_field = None

    def _thread(self, thread_id: str) -> MessageThread:
        thread = self.session.get(MessageThread, thread_id)
        if thread is None:
            raise NotFoundError("Thread not found")
        return thread

    def _check_access(self, actor: Principal, obj: Message) -> None:
        self._check_thread(actor, self._thread(obj.thread_id))

    @staticmethod
    def _check_thread(actor: Principal, thread: MessageThread) -> None:
        if actor.is_patient and thread.patient_id != actor.patient_id:
            raise ForbiddenError("You are not a member of this thread")
        if actor.clinician_id and thread.clinician_id not in (None, actor.clinician_id) and actor.role.value == "CLINICIAN":
            raise ForbiddenError("This thread belongs to another clinician")

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        body = (data["body"] or "").strip()
        if not body or len(body) > MAX_BODY:
            raise ValidationFailed(f"Message body must be 1-{MAX_BODY} characters")
        thread = self._thread(data["thread_id"])
        self._check_thread(actor, thread)
        thread.last_message_at = utcnow()
        data.update(body=body, sender_id=actor.user_id)
        return data

    def mark_read(self, message_id: str, actor: Principal) -> Message:
        msg = self.get(message_id, actor)
        if msg.sender_id != actor.user_id and msg.read_at is None:
            msg.read_at = utcnow()
            self.session.flush()
        return msg
