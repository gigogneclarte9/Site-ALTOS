#!/usr/bin/env bash
set -euo pipefail

# Manual VPS deployment script.
# Run from the repository root on the VPS or from a release checkout.

APP_NAME="${APP_NAME:-altos}"
PUBLIC_ROOT="${PUBLIC_ROOT:-/var/www/altos/current/public}"
API_ROOT="${API_ROOT:-/opt/altos-api/app}"
SERVICE_NAME="${SERVICE_NAME:-altos-api}"
ALLOWLIST="${ALLOWLIST:-deploy/public-allowlist.txt}"

if [[ ! -f "$ALLOWLIST" ]]; then
  echo "Missing allowlist: $ALLOWLIST" >&2
  exit 1
fi

if [[ ! -d "server" ]]; then
  echo "This script must be run from the repository root." >&2
  exit 1
fi

echo "Deploying $APP_NAME"
echo "Public root: $PUBLIC_ROOT"
echo "API root: $API_ROOT"

mkdir -p "$PUBLIC_ROOT"
mkdir -p "$API_ROOT"

echo "Syncing public allowlist..."
while IFS= read -r entry; do
  [[ -z "$entry" || "$entry" =~ ^# ]] && continue

  if compgen -G "$entry" > /dev/null; then
    for file in $entry; do
      target_dir="$PUBLIC_ROOT/$(dirname "$file")"
      mkdir -p "$target_dir"
      cp -p "$file" "$target_dir/"
    done
  else
    echo "Allowlist entry has no match: $entry" >&2
    exit 1
  fi
done < "$ALLOWLIST"

echo "Syncing API source..."
rsync -a --delete \
  --exclude node_modules \
  --exclude dist \
  --exclude .env \
  server/ "$API_ROOT/server/"

cd "$API_ROOT/server"

if [[ ! -f ".env" ]]; then
  echo "Missing $API_ROOT/server/.env. Create it from deploy/server.env.production.example." >&2
  exit 1
fi

echo "Installing API dependencies..."
npm ci

echo "Building API..."
npm run build
npm prune --omit=dev

echo "Running migrations..."
npm run db:migrate:prod

echo "Restarting service..."
systemctl restart "$SERVICE_NAME"
systemctl --no-pager --full status "$SERVICE_NAME"

echo "Deployment complete."
