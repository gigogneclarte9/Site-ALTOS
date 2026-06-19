# Recette Phase 1 - Socle applicatif VPS

Date : 2026-06-18

Objectif : verifier que le socle applicatif est pret pour la suite du projet.

## Perimetre Phase 1

Inclus :

- API Fastify TypeScript ;
- PostgreSQL ;
- migrations ;
- healthcheck ;
- stockage futur des micro-audits en base ;
- scripts d'exploitation VPS ;
- documentation de deploiement ;
- sauvegarde/restauration PostgreSQL.

Exclus :

- branchement du formulaire micro-audit public ;
- generation PDF serveur ;
- back-office admin ;
- factorisation dynamique du menu/footer ;
- back-office editorial.

## Recette locale

Statut : valide.

Elements verifies localement :

- PostgreSQL Docker demarre via `server/docker-compose.yml`.
- Conteneur `altos-postgres-dev` healthy.
- Migration `001_initial.sql` appliquee.
- `npm run typecheck` OK.
- `npm run build` OK.
- `npm run test:smoke` OK.
- API lancee sur `127.0.0.1:3001`.
- `GET /api/health` renvoie `database.ok: true`.
- `POST /api/micro-audits` renvoie `201`.
- Verification PostgreSQL : les tables `leads`, `micro_audits`, `lead_events` recoivent bien des lignes de test.

## Recette VPS a realiser

Statut : prete, non executee sur OVH.

Checklist VPS :

- VPS Ubuntu LTS disponible.
- Acces SSH par cle uniquement.
- Utilisateur applicatif `altos` cree.
- Dossiers cibles crees :
  - `/var/www/altos/current/public` ;
  - `/opt/altos-api/app` ;
  - `/var/lib/altos/documents/private` ;
  - `/var/lib/altos/backups-local/postgres` ;
  - `/var/log/altos/api`.
- Firewall actif :
  - SSH ;
  - HTTP ;
  - HTTPS.
- PostgreSQL installe localement sur le VPS.
- Utilisateur/base PostgreSQL crees avec `deploy/postgres-init.sql.example`.
- `.env` production cree a partir de `deploy/server.env.production.example`.
- Service systemd installe a partir de `deploy/altos-api.service.example`.
- Nginx configure a partir de `deploy/nginx-altos.conf.example`.
- HTTPS Let's Encrypt active.
- `deploy/deploy.sh` execute avec succes.
- `GET https://www.altos-experts.fr/api/health` renvoie `database.ok: true`.
- `deploy/backup-postgres.sh` produit une sauvegarde.
- `deploy/restore-postgres.sh` teste sur une base de test ou preproduction.

## Commandes locales de reference

Depuis `server/` :

```powershell
docker compose up -d postgres
$env:DATABASE_URL='postgres://altos:altos_dev_password@127.0.0.1:15432/altos'
npm.cmd run db:migrate
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:smoke
npm.cmd start
```

Healthcheck local :

```text
http://127.0.0.1:3001/api/health
```

## Decision de cloture Phase 1

La Phase 1 est consideree comme terminee cote code et preparation.

Elle sera consideree comme terminee cote infrastructure apres execution et validation de la checklist VPS.

On peut passer a la Phase 2 en developpement local, car le socle API/PostgreSQL est fonctionnel et teste avec Docker.
