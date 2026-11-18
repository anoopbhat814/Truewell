# API reference

All endpoints are served by `services/api` under `/api/v1` and require `Authorization: Bearer <access token>` unless
noted. The web app exposes the same paths under `/api/*` (without the `/v1`) after validating input.
Interactive documentation is available at `/docs` outside production.

## Conventions

- JSON in and out, `snake_case` on the Python API, `camelCase` on the web routes.
- Lists return `{ "items": [...], "total": n, "offset": 0, "limit": 25 }`. Use `offset` and `limit` (max 100).
- Errors use one envelope: `{ "error": { "code": "conflict", "message": "...", "details": {} } }`.
- Patients are scoped to their own records. Staff access depends on role (see the table below).

| Status | Code | Meaning |
| --- | --- | --- |
| 401 | `unauthenticated` | Missing, expired or invalid token |
| 403 | `forbidden` | Role or record-level access denied |
| 404 | `not_found` | Unknown identifier |
| 409 | `conflict` | State or scheduling conflict, for example a double booking |
| 422 | `validation_failed` | Business or schema validation failed |
| 429 | `rate_limited` | Too many failed sign-in attempts |

## Authentication

| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create a patient account and chart |
| POST | `/auth/login` | Exchange credentials for an access and refresh token |
| POST | `/auth/refresh` | Rotate a refresh token (single use) |
| POST | `/auth/logout` | Revoke a refresh token |
| GET | `/auth/me` | Current principal |

Access tokens last 15 minutes. Five failed sign-ins for one address lock it for 15 minutes.

## Resources

Every resource below supports `GET /{path}`, `POST /{path}`, `GET /{path}/{id}`, `PATCH /{path}/{id}` and
`DELETE /{path}/{id}` (delete is admin only).

| Path | Notes |
| --- | --- |
| `/patients` | Staff only; patients read their own chart |
| `/clinicians` | Readable by all roles; writes are admin only |
| `/organizations`, `/locations` | Clinic directory |
| `/appointment-types` | Visit catalogue with duration and price |
| `/availability` | Published slots; filter by `clinician_id`, `is_booked` |
| `/appointments` | Filter by `clinician_id`, `status`; conflict detection and cancellation notice rules |
| `/telehealth/sessions`, `/telehealth/participants` | Video visit state |
| `/medications`, `/pharmacies` | Reference data |
| `/prescriptions` | Clinician-created; interaction and allergy checks on create |
| `/allergies` | Patient-scoped |
| `/lab-orders`, `/lab-results` | Results are auto-flagged; patients see released rows only |
| `/care-plans`, `/care-plan-goals`, `/care-plan-tasks` | Care plan lifecycle |
| `/message-threads`, `/messages`, `/message-attachments` | Secure messaging |
| `/documents` | Patient documents |
| `/insurance/policies`, `/insurance/claims`, `/insurance/claim-lines` | Billing staff |
| `/reminders`, `/notifications` | Scheduled and in-app messages |
| `/users` | Admin listing |

## Actions

| Method | Path | Roles | Description |
| --- | --- | --- | --- |
| GET | `/scheduling/open-slots?clinician_id&day&minutes` | any | Open times for a clinician on a day |
| POST | `/telehealth/sessions/{id}/join` | participants | Returns a signed, 30 minute join ticket; the waiting room opens 10 minutes early |
| POST | `/telehealth/sessions/{id}/end` | clinician, admin | End a live session |
| POST | `/prescriptions/{id}/send` | clinician | Sign and transmit a draft; sets expiry |
| POST | `/prescriptions/{id}/cancel` | clinician, admin | Cancel an unfilled prescription |
| GET | `/care-plans/{id}/progress` | any with access | Task completion summary |
| POST | `/messages/{id}/read` | thread members | Mark a message as read |
| POST | `/insurance/claims/{id}/submit` | billing, admin | Submit a draft claim |
| POST | `/insurance/claims/{id}/adjudicate` | billing, admin | Record the payer decision |

## Health

`GET /healthz` returns liveness and version. `GET /readyz` verifies the database connection.

## Notifier

The notifier is internal. `POST /v1/dispatch` accepts `{ id, channel, patient_id, message, urgent }` with a bearer
token and answers `200` (sent or deferred), `422` (permanent failure), `429` (throttled) or `502` (transient failure).
