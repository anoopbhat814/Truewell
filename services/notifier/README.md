# Truewell notifier

Small Go service that delivers reminders over e-mail, SMS and push channels.

- Per-patient sliding-window rate limit (`NOTIFIER_MAX_PER_MINUTE`)
- Quiet hours (`NOTIFIER_QUIET_START`, `NOTIFIER_QUIET_END`, `NOTIFIER_QUIET_TZ`); urgent messages bypass them
- Exponential-backoff retry for transient failures, immediate stop on permanent ones
- Message bodies are never written to logs

```bash
go run ./cmd/notifierd   # or: make notifier
go test ./...
```
