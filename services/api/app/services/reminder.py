from datetime import datetime, timedelta
from typing import Any

from sqlalchemy import select

from app.core.clock import utcnow
from app.core.rbac import Principal
from app.errors import ValidationFailed
from app.models.reminder import Reminder
from app.services.crud import CrudService

MAX_ATTEMPTS = 3
RETRY_BACKOFF = timedelta(minutes=10)


def next_retry(attempts: int, now: datetime) -> datetime:
    return now + RETRY_BACKOFF * (2 ** max(attempts - 1, 0))


class ReminderService(CrudService[Reminder]):
    entity = "reminder"

    def before_create(self, data: dict[str, Any], actor: Principal) -> dict[str, Any]:
        if data["send_at"] < utcnow() - timedelta(minutes=1):
            raise ValidationFailed("Reminders cannot be scheduled in the past")
        return super().before_create(data, actor)

    def due(self, now: datetime | None = None, limit: int = 200) -> list[Reminder]:
        now = now or utcnow()
        stmt = (
            select(Reminder)
            .where(Reminder.status == "PENDING", Reminder.send_at <= now)
            .order_by(Reminder.send_at)
            .limit(limit)
        )
        return list(self.session.scalars(stmt))

    def mark_sent(self, reminder: Reminder) -> None:
        reminder.status = "SENT"
        reminder.sent_at = utcnow()
        reminder.attempts += 1
        self.session.flush()

    def mark_failed(self, reminder: Reminder, error: str) -> None:
        reminder.attempts += 1
        reminder.last_error = error[:500]
        if reminder.attempts >= MAX_ATTEMPTS:
            reminder.status = "FAILED"
        else:
            reminder.send_at = next_retry(reminder.attempts, utcnow())
        self.session.flush()
