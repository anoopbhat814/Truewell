# @truewell/worker

Node worker that runs Truewell's recurring maintenance jobs against the shared PostgreSQL database
and hands outbound messages to the Go `notifier` service.

| Job | Schedule | Purpose |
| --- | --- | --- |
| `reminder-scan` | every 5 min | Create reminders for confirmed visits starting within 24 hours |
| `reminder-dispatch` | every 30 s | Deliver due reminders through the notifier |
| `lab-release` | every 10 min | Release reviewed, non-critical results to the portal |
| `claims-sweep` | hourly | Flag claims stuck in `SUBMITTED` for more than 14 days |
| `session-cleanup` | daily 03:15 | Delete expired refresh sessions |

Run locally with `npm run dev --workspace apps/worker` (requires `DATABASE_URL` and `REDIS_URL`).
