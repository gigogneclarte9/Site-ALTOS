# Deploy helpers

This folder contains deployment templates and scripts for the OVH VPS.

## Files

- `public-allowlist.txt` : public static files allowed in the Nginx webroot.
- `nginx-altos.conf.example` : Nginx virtual host example.
- `altos-api.service.example` : systemd service example for the Fastify API.
- `server.env.production.example` : production environment template.
- `postgres-init.sql.example` : PostgreSQL user/database creation template.
- `bootstrap-vps.sh` : Ubuntu bootstrap helper.
- `deploy.sh` : manual deployment helper.
- `run-migrations.sh` : migration helper.
- `backup-postgres.sh` : PostgreSQL backup helper.
- `restore-postgres.sh` : PostgreSQL restore helper.

## Local development

Use `server/docker-compose.yml` for local PostgreSQL development.

## Production

Do not copy private folders to the public webroot. Deploy static files only through `public-allowlist.txt`.
