import pytest

from app.services.claim import CLAIM_TRANSITIONS, patient_responsibility


def test_copay_only_when_deductible_met():
    assert patient_responsibility(10_000, 3_000, 0, coinsurance=0.0) == 3_000


def test_deductible_applies_after_copay():
    assert patient_responsibility(10_000, 2_000, 5_000, coinsurance=0.2) == 2_000 + 5_000 + round(3_000 * 0.2)


def test_copay_capped_at_allowed_amount():
    assert patient_responsibility(1_500, 3_000, 0) == 1_500


@pytest.mark.parametrize("state", ["PAID"])
def test_terminal_states_have_no_exits(state):
    assert CLAIM_TRANSITIONS[state] == set()


def test_denied_claims_can_only_be_appealed():
    assert CLAIM_TRANSITIONS["DENIED"] == {"APPEALED"}
