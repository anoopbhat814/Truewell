# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project follows
[Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Security headers (`Permissions-Policy`, HSTS) on all web responses.
- Network policies restricting access to the API and notifier pods.

### Changed
- Telehealth join tokens are passed in the URL fragment instead of the query string.

## [0.6.0] - 2025-06-09

### Added
- Notifier service (Go) with per-patient rate limiting, quiet hours and retry with backoff.
- Claims worklist for billing staff, including submit and adjudicate actions.
- Care plan progress endpoint and task checklist in the patient portal.

### Changed
- Lab results flagged as critical are never released automatically.
- Refresh tokens are rotated on every use.

## [0.5.0] - 2025-04-22

### Added
- E-prescribing with drug interaction and allergy checks.
- Secure messaging threads with read receipts.
- Insurance policies and claim line items.

### Fixed
- Appointment conflict detection ignored cancelled visits in the wrong direction.

## [0.4.0] - 2025-03-04

### Added
- Telehealth sessions with a waiting room that opens ten minutes before the visit.
- Reminder scheduling for confirmed appointments.

## [0.3.0] - 2025-01-20

### Added
- Clinician dashboard with schedule, patient search and lab review queue.
- Role-based middleware for the Next.js app.

## [0.2.0] - 2024-11-12

### Added
- Appointment booking with open-slot search.
- Prisma schema and initial migrations.

## [0.1.0] - 2024-09-30

### Added
- Project scaffold: web app, API and authentication.
