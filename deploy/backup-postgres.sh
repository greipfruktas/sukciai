#!/bin/sh
set -eu
: "${POSTGRES_DB:?POSTGRES_DB required}"
: "${POSTGRES_USER:?POSTGRES_USER required}"
: "${BACKUP_AGE_RECIPIENT:?BACKUP_AGE_RECIPIENT required}"
backup_dir=${BACKUP_DIR:-/backups}
timestamp=$(date -u +%Y%m%dT%H%M%SZ)
umask 077
mkdir -p "$backup_dir"
pg_dump --format=custom --no-owner --username="$POSTGRES_USER" "$POSTGRES_DB" | age --recipient "$BACKUP_AGE_RECIPIENT" --output "$backup_dir/sukciai-$timestamp.dump.age"
find "$backup_dir" -type f -name 'sukciai-*.dump.age' -mtime +30 -delete
