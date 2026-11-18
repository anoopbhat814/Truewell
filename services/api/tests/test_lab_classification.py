from decimal import Decimal as D

import pytest

from app.services.lab_result import classify


@pytest.mark.parametrize(
    "value,expected",
    [
        (D("85"), "NORMAL"),
        (D("65"), "LOW"),
        (D("105"), "HIGH"),
        (D("20"), "CRITICAL_LOW"),
        (D("140"), "CRITICAL_HIGH"),
    ],
)
def test_glucose_ranges(value, expected):
    assert classify(value, D("70"), D("99")) == expected


def test_open_ended_ranges():
    assert classify(D("5"), None, D("4")) == "HIGH"
    assert classify(D("1"), D("2"), None) == "LOW"
    assert classify(D("3"), None, None) == "NORMAL"
