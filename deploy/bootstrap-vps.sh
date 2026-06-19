#!/usr/bin/env bash
set -euo pipefail

# First-run bootstrap helper for an Ubuntu LTS VPS.
# Review before running. Execute as root or with sudo.

APP_USER="${APP_USER:-altos}"
NODE_MAJOR="${NODE_MAJOR:-22}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root or with sudo." >&2
  exit 1
fi

apt-get update
apt-get install -y ca-certificates curl gnupg git nginx postgresql postgresql-contrib rsync ufw fail2ban

if ! command -v node >/dev/null 2>&1; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi

if ! id "$APP_USER" >/dev/null 2>&1; then
  useradd --system --create-home --shell /usr/sbin/nologin "$APP_USER"
fi

mkdir -p \
  /var/www/altos/current/public \
  /var/www/altos/releases \
  /var/www/altos/shared \
  /opt/altos-api/app \
  /var/lib/altos/documents/private \
  /var/lib/altos/documents/public \
  /var/lib/altos/backups-local/postgres \
  /var/log/altos/api \
  /var/log/altos/deploy

chown -R "$APP_USER:$APP_USER" /opt/altos-api /var/lib/altos /var/log/altos
chown -R www-data:www-data /var/www/altos

ufw allow OpenSSH
ufw allow 'Nginx Full'

echo "Bootstrap complete."
echo "Next steps:"
echo "1. Create PostgreSQL user/database with deploy/postgres-init.sql.example."
echo "2. Copy server env to /opt/altos-api/app/server/.env."
echo "3. Install systemd and Nginx configs from deploy/*.example."
echo "4. Run deploy/deploy.sh."
