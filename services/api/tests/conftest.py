import os
from datetime import datetime, timedelta

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

os.environ.setdefault("TRUEWELL_DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("TRUEWELL_JWT_SECRET", "test-secret-test-secret-123")

from app.core.rbac import Principal, Role  # noqa: E402
from app.models import Base  # noqa: E402


@pytest.fixture()
def session():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    maker = sessionmaker(bind=engine, expire_on_commit=False)
    with maker() as s:
        yield s


@pytest.fixture()
def clinician_actor() -> Principal:
    return Principal(user_id="u-clin", role=Role.CLINICIAN, clinician_id="c-1")


@pytest.fixture()
def patient_actor() -> Principal:
    return Principal(user_id="u-pat", role=Role.PATIENT, patient_id="p-1")


@pytest.fixture()
def admin_actor() -> Principal:
    return Principal(user_id="u-admin", role=Role.ADMIN)


@pytest.fixture()
def tomorrow() -> datetime:
    return (datetime.utcnow() + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0)
