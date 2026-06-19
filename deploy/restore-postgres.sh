#!/usr/bin/env bash
set -euo pipefail

DATABASE_URL="${DATABASE_URL:?DATABASE_URL is required}"
BACKUP_FILE="${1:-}"

if [[ -z "$BACKUP_FILE" ]]; then
  echo "Usage: DATABASE_URL=postgres://... $0 /path/to/backup.dump" >&2
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found: $BACKUP_FILE" >&2
  exit 1
fi

if [[ -f "$BACKUP_FILE.sha256" ]]; then
  sha256sum --check "$BACKUP_FILE.sha256"
fi

echo "Restoring $BACKUP_FILE"
echo "This will overwrite objects in the target database if restore options allow it."

pg_restore --dbname="$DATABASE_URL" --clean --if-exists --no-owner "$BACKUP_FILE"

echo "Restore complete."
