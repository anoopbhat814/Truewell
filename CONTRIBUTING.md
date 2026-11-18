# Contributing to Truewell

Thanks for taking the time to improve Truewell. This guide explains how to set up the project, the
conventions we follow, and how changes get reviewed.

## Getting set up

Requirements: Node 20, Go 1.22, Python 3.11, Docker and PostgreSQL 16 (or use `make up`).

```bash
cp .env.example .env
npm ci
pip install -r services/api/requirements-dev.txt
make up          # postgres, redis, api, notifier, worker
make migrate
make seed
make dev         # web on http://localhost:3000
```

Run `make check-env` if a service fails to start; it reports missing variables.

## Repository layout

| Path                | Language   | Notes                                                   |
|---------------------|------------|---------------------------------------------------------|
| `apps/web`          | TypeScript | Next.js 14 patient portal and clinician dashboard       |
| `apps/worker`       | JavaScript | Queue consumer for reminders, lab release and cleanup   |
| `packages/*`        | TypeScript | Shared types, utilities, UI primitives and API client   |
| `services/api`      | Python     | FastAPI backend: routers, services, repositories        |
| `services/notifier` | Go         | Reminder dispatcher with throttling and quiet hours     |
| `prisma`            | Prisma     | Schema, migrations, seed data                           |

## Working on data model changes

1. Edit `prisma/schema.prisma` and create a timestamped migration folder under `prisma/migrations`.
2. Mirror the change in the SQLAlchemy model under `services/api/app/models`.
3. Update `packages/types` and, if a new enum value is added, `services/api/app/models/enums.py`.
4. Run `npx prisma validate` and `make test`.

## Conventions

- TypeScript: strict mode, no `any`, Prettier and ESLint via `npm run lint`.
- Python: type hints everywhere, `ruff check` clean, business rules live in `services/`, not routers.
- Go: `gofmt`, `go vet`, table-driven tests.
- Every endpoint that reads or writes PHI must be role-restricted and produce an audit entry.
- Test data must be fictional. Use `*.example` email domains and invented names.

## Commit messages and pull requests

Use short imperative subjects (`Add lab release delay setting`). Reference the issue in the body. Fill in the
pull request template and keep changes focused; large refactors should be discussed in an issue first.

## Code review

At least one maintainer review is required. Changes under `prisma/` and `docs/security.md` need an owner
from `CODEOWNERS`. CI must be green before merge.
