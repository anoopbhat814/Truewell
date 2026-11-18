from datetime import datetime, timezone


def utcnow() -> datetime:
    """Naive UTC timestamp matching the TIMESTAMP(3) columns created by Prisma."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
