import pytest

from app.services.appointment import ALLOWED_TRANSITIONS, can_transition


def test_happy_path_sequence():
    for current, target in [("REQUESTED", "CONFIRMED"), ("CONFIRMED", "CHECKED_IN"), ("CHECKED_IN", "IN_PROGRESS"), ("IN_PROGRESS", "COMPLETED")]:
        assert can_transition(current, target)


@pytest.mark.parametrize("terminal", ["COMPLETED", "CANCELLED", "NO_SHOW"])
def test_terminal_states(terminal):
    assert ALLOWED_TRANSITIONS[terminal] == set()
    assert not can_transition(terminal, "CONFIRMED")


def test_cannot_skip_states():
    assert not can_transition("REQUESTED", "COMPLETED")
    assert not can_transition("unknown", "CONFIRMED")
