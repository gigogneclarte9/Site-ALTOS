#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="${BACKUP_DIR:-/var/lib/altos/backups-local/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
DATABASE_URL="${DATABASE_URL:?DATABASE_URL is required}"

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
backup_file="$BACKUP_DIR/altos-$timestamp.dump"

mkdir -p "$BACKUP_DIR"

pg_dump "$DATABASE_URL" --format=custom --file="$backup_file"

sha256sum "$backup_file" > "$backup_file.sha256"

find "$BACKUP_DIR" -type f -name "altos-*.dump" -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -type f -name "altos-*.dump.sha256" -mtime +"$RETENTION_DAYS" -delete

echo "Backup created: $backup_file"
