# Testing

| Layer | Tooling | Command |
| --- | --- | --- |
| API (Python) | pytest, in-memory SQLite for service tests | `cd services/api && python -m pytest` |
| Web and packages (TypeScript) | Vitest, jsdom | `npm test --workspaces --if-present` |
| Worker and scripts (JavaScript) | Jest | `npm test --workspace apps/worker` |
| Notifier (Go) | `go test` | `cd services/notifier && go test ./...` |
| Schema | Prisma | `npx prisma validate` |

`make test` runs all of them. `make lint` runs ESLint, ruff and `go vet`.

## What is covered

- Python: scheduling and conflict detection, appointment and claim state machines, lab flag classification, drug
  interaction checks, authentication flows (registration, lockout, token rotation), row-level scoping in `CrudService`,
  and a registry test that checks every model, read schema and router stay aligned.
- TypeScript: Zod schemas for every resource route, session and RBAC helpers, case conversion, the pure services that
  drive dashboards (appointments, labs, billing, messaging) and the shared utilities.
- JavaScript: cron matching, reminder retry and backoff, lab release rules and cleanup jobs with injected fakes.
- Go: dispatcher retry and throttling, quiet-hour windows and rate limiting.

## Conventions

Tests use fictional identities only. Prefer injecting clocks and clients over patching globals, as the worker jobs and
Go dispatcher do.
