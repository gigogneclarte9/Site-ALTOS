#!/usr/bin/env bash
set -euo pipefail

API_SERVER_DIR="${API_SERVER_DIR:-/opt/altos-api/app/server}"

if [[ ! -d "$API_SERVER_DIR" ]]; then
  echo "Missing API server directory: $API_SERVER_DIR" >&2
  exit 1
fi

cd "$API_SERVER_DIR"

if [[ ! -f ".env" ]]; then
  echo "Missing .env in $API_SERVER_DIR" >&2
  exit 1
fi

npm run db:migrate:prod
