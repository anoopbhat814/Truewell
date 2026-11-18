# Deployment

## Local stack with Docker Compose

```bash
cp .env.example .env
make up          # builds and starts postgres, redis, api, tasks, notifier, web and worker
make migrate     # prisma migrate deploy
make seed        # fictional demo data
```

The web app is on http://localhost:3000, the API on http://localhost:8000 (`/docs` for OpenAPI), and the notifier on
http://localhost:8090. Stop everything with `make down`.

Seeded sign-ins (all fictional): `admin@truewell.example`, `dr.rivera@truewell.example` and
`sam.patel@patients.example`. Passwords are set in `prisma/seed.ts` and must never be reused outside development.

## Images

| Image | Dockerfile |
| --- | --- |
| `truewell-web` | `deploy/Dockerfile.web` |
| `truewell-worker` | `deploy/Dockerfile.worker` |
| `truewell-api` | `services/api/Dockerfile` (also runs the task runner with `python -m app.tasks`) |
| `truewell-notifier` | `services/notifier/Dockerfile` |

Tagging a release (`v*`) triggers `.github/workflows/docker.yml`, which pushes all four images to GHCR.

## Kubernetes

Manifests are in `deploy/k8s`. Apply the namespace first, create the secrets, then everything else:

```bash
kubectl apply -f deploy/k8s/namespace.yaml
kubectl -n truewell create secret generic truewell-api-secrets \
  --from-literal=TRUEWELL_DATABASE_URL=... --from-literal=TRUEWELL_JWT_SECRET=... \
  --from-literal=TRUEWELL_VIDEO_SIGNING_KEY=...
kubectl -n truewell create secret generic truewell-notifier-secrets --from-literal=token=...
kubectl apply -f deploy/k8s
```

Run `npx prisma migrate deploy` as a pre-release job against the production database before rolling the API.

## Configuration

See `.env.example` for every variable. Production requires `TRUEWELL_ENVIRONMENT=production`, non-default secrets
(enforced by `scripts/check-env.js`) and `Secure` cookies behind TLS.

## Operations checklist

- Run exactly one replica of the task runner (`truewell-tasks`) unless you move the scheduler to a distributed lock.
- Scale `truewell-api` and `truewell-web` horizontally; both are stateless.
- Back up PostgreSQL with `scripts/backup-db.sh` and rehearse restores.
- Alert on `/readyz` failures, a growing backlog of `PENDING` reminders and spikes in 403 responses.
- Rotate signing secrets by deploying the new value to the API; existing access tokens expire within 15 minutes.
