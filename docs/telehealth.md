# Telehealth sessions

A video appointment gets a `TelehealthSession` row with a unique room name. Media flows through an external video
provider; Truewell only issues access tickets and tracks state.

## Join flow

1. The patient opens `/portal/telehealth/{sessionId}`. The page shows a waiting room with a countdown.
2. `POST /api/telehealth/sessions/{id}/join` calls the API, which checks that the caller is a participant, that the current time
   is between 10 minutes before the start and 30 minutes after the end, and that the session has not ended.
3. The API returns `{ room, url, token, expires_at }`. The token is `HMAC-SHA256(room:user:expiry)` using
   `TRUEWELL_VIDEO_SIGNING_KEY`, valid for 30 minutes.
4. The browser embeds `url#token=...` in an iframe permitted to use camera and microphone. The fragment is not sent to servers.
5. When a clinician joins, the session becomes `LIVE` and `started_at` is stamped. Ending the call sets `ENDED`.

## Rules

- Patients entering first move the session to `WAITING_ROOM`.
- Recording requires `recording_consent`; the flag defaults to false.
- A session that has ended cannot be rejoined.
- Only appointment types with `telehealth_ok` offer video or phone formats in the booking form.
