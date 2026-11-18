import logging

import httpx

from app.config import get_settings
from app.database import session_scope
from app.models.reminder import Reminder
from app.repositories.reminder import ReminderRepository
from app.services.reminder import ReminderService

log = logging.getLogger("truewell.tasks.reminders")


def dispatch(reminder: Reminder, client: httpx.Client) -> None:
    settings = get_settings()
    response = client.post(
        f"{settings.notifier_url}/v1/dispatch",
        json={
            "id": reminder.id,
            "channel": reminder.channel,
            "patient_id": reminder.patient_id,
            "message": reminder.message,
        },
        timeout=5.0,
    )
    response.raise_for_status()


def send_due_reminders() -> int:
    """Hand due reminders to the notifier service; returns the number delivered."""
    delivered = 0
    with session_scope() as session, httpx.Client() as client:
        service = ReminderService(ReminderRepository(session))
        for reminder in service.due():
            try:
                dispatch(reminder, client)
                service.mark_sent(reminder)
                delivered += 1
            except httpx.HTTPError as exc:
                service.mark_failed(reminder, str(exc))
                log.warning("reminder dispatch failed", extra={"ctx": {"reminder_id": reminder.id}})
    return delivered
