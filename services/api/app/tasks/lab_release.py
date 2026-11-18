from datetime import timedelta

from sqlalchemy import select

from app.config import get_settings
from app.core.clock import utcnow
from app.database import session_scope
from app.models.lab_result import LabResult


def release_reviewed_results() -> int:
    """Release non-critical results to the patient portal after the configured review delay."""
    cutoff = utcnow() - timedelta(hours=get_settings().lab_release_delay_hours)
    released = 0
    with session_scope() as session:
        stmt = select(LabResult).where(
            LabResult.released_to_patient.is_(False),
            LabResult.resulted_at <= cutoff,
            LabResult.flag.notin_(["CRITICAL_LOW", "CRITICAL_HIGH"]),
        )
        for result in session.scalars(stmt):
            result.released_to_patient = True
            released += 1
    return released
