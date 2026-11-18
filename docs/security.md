# Security and privacy considerations

Truewell handles information that is health-related and therefore sensitive. The project implements technical
safeguards in the spirit of HIPAA-style security expectations. It has not been audited or certified against HIPAA, HITRUST,
SOC 2 or any other framework, and running it does not make an organisation compliant. Operators remain responsible for
policies, training, business associate agreements, risk analysis and the safeguards listed under
"Operator responsibilities".

## Safeguards in the code

| Area | Implementation |
| --- | --- |
| Authentication | scrypt password hashing, 12 character minimum with character-class check, 15 minute access tokens, rotating single-use refresh tokens, lockout after five failures |
| Session storage | Tokens live in `httpOnly`, `SameSite=Lax`, `Secure` (production) cookies; the refresh cookie is path-scoped to `/api/auth` |
| Authorisation | Role dependencies on every router (`require_roles`) plus record-level scoping in `CrudService`; patients can only reach their own rows |
| Minimum necessary | Lab results reach patients only after release; critical values are never auto-released; member identifiers are masked in the UI |
| Audit trail | Every read, create, update and delete of a chart entity writes an `audit_logs` row with actor, entity and timestamp; failed sign-ins are recorded |
| Transport | HSTS, `nosniff`, frame denial and a restrictive `Permissions-Policy` are set by Next.js; TLS terminates at the ingress |
| Caching | Responses carry `Cache-Control: no-store` so PHI is not stored by shared caches |
| Logging | JSON logs redact `password`, `token`, `member_id` and message bodies; the notifier logs message length, never content |
| Input handling | Zod validation at the edge, Pydantic validation in the API, parameterised queries through SQLAlchemy and Prisma |
| Telehealth | Join tickets are HMAC-signed, expire after 30 minutes and are passed in the URL fragment; waiting rooms open only near the appointment time |
| Containers | Non-root users, minimal base images, network policies that restrict API and notifier ingress |

## Data handling rules for contributors

- Use fictional data only. Email addresses must use a `.example` domain.
- Never log request bodies for clinical endpoints.
- Never place PHI in URLs, query strings, local storage or analytics events. `useLocalStorage` is for UI preferences only.
- New endpoints must declare allowed roles and produce an audit entry.

## Operator responsibilities

The following are outside what a code repository can provide and must be handled when deploying:

- Encryption at rest for PostgreSQL volumes, backups (see `scripts/backup-db.sh`) and object storage.
- Key management and rotation for `TRUEWELL_JWT_SECRET` and `TRUEWELL_VIDEO_SIGNING_KEY`; `make check-env` refuses default secrets in production.
- Business associate agreements with hosting, email, SMS and video vendors.
- Multi-factor authentication for staff (the `mfa_enabled` flag is stored; enforcement depends on your identity provider).
- Retention and disposal policies, breach response procedures, workforce training and periodic risk assessment.
- Monitoring and alerting on the audit log, for example access to unrelated charts.

## Known limitations

- The login throttle is in-process; multi-replica deployments should back it with Redis.
- The drug interaction table in `services/api/app/services/interactions.py` is intentionally small. Integrate a licensed
  clinical knowledge base before any real prescribing use.
- Attachments store metadata only; the object storage integration and malware scanning are deployment specific.

Report vulnerabilities as described in [SECURITY.md](../SECURITY.md).
