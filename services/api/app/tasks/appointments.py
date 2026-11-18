from datetime import timedelta

from sqlalchemy import select

from app.config import get_settings
from app.core.clock import utcnow
from app.database import session_scope
from app.models.appointment import Appointment
from app.models.reminder import Reminder


def mark_no_shows(grace_minutes: int = 30) -> int:
    cutoff = utcnow() - timedelta(minutes=grace_minutes)
    count = 0
    with session_scope() as session:
        stmt = select(Appointment).where(Appointment.status == "CONFIRMED", Appointment.ends_at < cutoff)
        for appt in session.scalars(stmt):
            appt.status = "NO_SHOW"
            count += 1
    return count


def schedule_reminders() -> int:
    """Create one reminder for every confirmed appointment inside the lead window that has none."""
    lead = timedelta(hours=get_settings().reminder_lead_hours)
    now = utcnow()
    created = 0
    with session_scope() as session:
        stmt = select(Appointment).where(
            Appointment.status == "CONFIRMED", Appointment.starts_at > now, Appointment.starts_at <= now + lead
        )
        for appt in session.scalars(stmt):
            exists = session.scalar(select(Reminder.id).where(Reminder.appointment_id == appt.id))
            if exists:
                continue
            session.add(
                Reminder(
                    patient_id=appt.patient_id,
                    appointment_id=appt.id,
                    channel="EMAIL",
                    status="PENDING",
                    message=f"Reminder: you have an appointment on {appt.starts_at:%b %d at %H:%M} UTC.",
                    send_at=max(now, appt.starts_at - lead),
                )
            )
            created += 1
    return created
