from datetime import date, datetime, time, timedelta

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.rbac import Principal
from app.database import get_session
from app.deps import get_principal
from app.models.appointment import Appointment
from app.services.scheduling import Window, generate_slots

router = APIRouter(prefix="/scheduling", tags=["scheduling"])

DAY_START = time(8, 0)
DAY_END = time(17, 0)


class SlotOut(BaseModel):
    starts_at: datetime
    ends_at: datetime


@router.get("/open-slots", response_model=list[SlotOut])
def open_slots(
    clinician_id: str,
    day: date,
    minutes: int = Query(20, ge=5, le=120),
    _: Principal = Depends(get_principal),
    session: Session = Depends(get_session),
) -> list[SlotOut]:
    start = datetime.combine(day, DAY_START)
    end = datetime.combine(day, DAY_END)
    stmt = select(Appointment).where(
        Appointment.clinician_id == clinician_id,
        Appointment.starts_at >= start - timedelta(hours=1),
        Appointment.ends_at <= end + timedelta(hours=1),
        Appointment.status.notin_(["CANCELLED", "NO_SHOW"]),
    )
    busy = [Window(a.starts_at, a.ends_at) for a in session.scalars(stmt)]
    return [SlotOut(starts_at=w.start, ends_at=w.end) for w in generate_slots(start, end, minutes, busy)]
