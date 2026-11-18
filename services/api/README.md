# Truewell API

FastAPI backend for the patient portal and clinician dashboard.

```bash
cd services/api
pip install -r requirements-dev.txt
uvicorn app.main:app --reload --port 8000    # or: make api
python -m app.tasks                           # reminder, lab-release and no-show scheduler
python -m pytest
```

Layout: `routers/` (HTTP), `services/` (business rules), `repositories/` (SQLAlchemy), `models/`, `schemas/`, `tasks/`.
Configuration is read from `TRUEWELL_*` environment variables, see `app/config.py`.
