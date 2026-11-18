from datetime import datetime, timedelta

from app.services.reminder import MAX_ATTEMPTS, RETRY_BACKOFF, next_retry

NOW = datetime(2025, 3, 1, 12, 0)


def test_backoff_doubles_each_attempt():
    assert next_retry(1, NOW) == NOW + RETRY_BACKOFF
    assert next_retry(2, NOW) == NOW + RETRY_BACKOFF * 2
    assert next_retry(3, NOW) == NOW + RETRY_BACKOFF * 4


def test_backoff_never_negative_for_zero_attempts():
    assert next_retry(0, NOW) - NOW == timedelta(minutes=10)


def test_max_attempts_is_bounded():
    assert 1 <= MAX_ATTEMPTS <= 5
