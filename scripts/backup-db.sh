#!/usr/bin/env bash
# Encrypted logical backup of the Truewell database. Requires pg_dump and gpg.
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"
: "${BACKUP_GPG_RECIPIENT:?BACKUP_GPG_RECIPIENT must be set}"

out_dir="${BACKUP_DIR:-./backups}"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p "$out_dir"

pg_dump --format=custom --no-owner "$DATABASE_URL" \
  | gpg --batch --yes --encrypt --recipient "$BACKUP_GPG_RECIPIENT" \
  > "$out_dir/truewell-$stamp.dump.gpg"

# Retain 14 days of local backups.
find "$out_dir" -name 'truewell-*.dump.gpg' -mtime +14 -delete
echo "Backup written to $out_dir/truewell-$stamp.dump.gpg"
