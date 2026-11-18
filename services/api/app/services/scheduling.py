"""Pure scheduling helpers: overlap detection and slot generation."""

from dataclasses import dataclass
from datetime import datetime, timedelta


@dataclass(frozen=True)
class Window:
    start: datetime
    end: datetime

    def __post_init__(self) -> None:
        if self.end <= self.start:
            raise ValueError("window end must be after start")

    def overlaps(self, other: "Window") -> bool:
        return self.start < other.end and other.start < self.end

    @property
    def minutes(self) -> int:
        return int((self.end - self.start).total_seconds() // 60)


def first_conflict(candidate: Window, existing: list[Window]) -> Window | None:
    return next((w for w in existing if candidate.overlaps(w)), None)


def generate_slots(day_start: datetime, day_end: datetime, minutes: int, busy: list[Window]) -> list[Window]:
    """Return open slots of ``minutes`` length between day_start and day_end that avoid ``busy``."""
    if minutes <= 0:
        raise ValueError("slot length must be positive")
    slots: list[Window] = []
    cursor = day_start
    step = timedelta(minutes=minutes)
    while cursor + step <= day_end:
        candidate = Window(cursor, cursor + step)
        clash = first_conflict(candidate, busy)
        if clash is None:
            slots.append(candidate)
            cursor += step
        else:
            cursor = max(clash.end, cursor + timedelta(minutes=5))
    return slots
