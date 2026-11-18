from datetime import datetime, timedelta

import pytest

from app.services.scheduling import Window, first_conflict, generate_slots

T0 = datetime(2025, 6, 2, 9, 0)


def test_overlap_detection():
    a = Window(T0, T0 + timedelta(minutes=30))
    assert a.overlaps(Window(T0 + timedelta(minutes=29), T0 + timedelta(minutes=60)))
    assert not a.overlaps(Window(T0 + timedelta(minutes=30), T0 + timedelta(minutes=60)))


def test_invalid_window_rejected():
    with pytest.raises(ValueError):
        Window(T0, T0)


def test_first_conflict_returns_clashing_window():
    busy = [Window(T0, T0 + timedelta(minutes=20)), Window(T0 + timedelta(hours=2), T0 + timedelta(hours=3))]
    hit = first_conflict(Window(T0 + timedelta(minutes=10), T0 + timedelta(minutes=40)), busy)
    assert hit is busy[0]


def test_generate_slots_skips_busy_blocks():
    busy = [Window(T0 + timedelta(minutes=30), T0 + timedelta(minutes=60))]
    slots = generate_slots(T0, T0 + timedelta(hours=2), 30, busy)
    starts = [s.start for s in slots]
    assert T0 in starts
    assert T0 + timedelta(minutes=30) not in starts
    assert T0 + timedelta(minutes=60) in starts
    assert all(not first_conflict(s, busy) for s in slots)


def test_generate_slots_rejects_nonpositive_length():
    with pytest.raises(ValueError):
        generate_slots(T0, T0 + timedelta(hours=1), 0, [])
