# Phase 1 - Socle applicatif VPS

Date : 2026-06-18

Objectif : disposer d'une API backend minimale, connectable a PostgreSQL et exploitable sur le VPS OVH.

## Statut

Phase 1 terminee cote code et preparation locale.

Le backend Fastify existe dans `server/` et compile.

L'execution sur le VPS OVH reel reste a faire lors de la mise en production. Voir `docs/RECETTE_PHASE_1.md`.

## Livrables realises

- Backend TypeScript + Fastify dans `server/`.
- PostgreSQL local de developpement via Docker Compose :
  - `server/docker-compose.yml` ;
  - port hote `15432` pour eviter le conflit avec PostgreSQL Windows sur `5432`.
- Route `GET /api/health`.
- Route `POST /api/micro-audits`.
- Validation JSON schema sur `POST /api/micro-audits`.
- Rate limit Fastify.
- CORS configurable par `CORS_ORIGIN`.
- Pool PostgreSQL via `DATABASE_URL`.
- Migration SQL initiale :
  - `leads` ;
  - `micro_audits` ;
  - `documents` ;
  - `lead_events` ;
  - `admin_users`.
- Commande de migration :
  - `npm run db:migrate` en local/dev ;
  - `npm run db:migrate:prod` apres build.
- Healthcheck enrichi :
  - indique si la base est configuree ;
  - tente un `select 1` si `DATABASE_URL` est present ;
  - renvoie un statut `degraded` si la base configuree ne repond pas.
- Exemple systemd :
  - `deploy/altos-api.service.example`.
- Exemple `.env` production :
  - `deploy/server.env.production.example`.
- Scripts d'exploitation VPS :
  - `deploy/bootstrap-vps.sh` ;
  - `deploy/deploy.sh` ;
  - `deploy/run-migrations.sh` ;
  - `deploy/backup-postgres.sh` ;
  - `deploy/restore-postgres.sh`.
- Template PostgreSQL VPS :
  - `deploy/postgres-init.sql.example`.
- Checklist de recette :
  - `docs/RECETTE_PHASE_1.md`.

## Verification realisee

- `npm run typecheck` : OK.
- `npm run build` : OK.
- Test `GET /api/health` via Fastify inject : OK.
- Test `npm run db:migrate` sans `DATABASE_URL` : echec propre avec message explicite.
- `docker compose up -d postgres` : OK.
- Healthcheck Docker PostgreSQL : `healthy`.
- Migration appliquee sur PostgreSQL Docker : `001_initial.sql`.
- Test `GET /api/health` avec `DATABASE_URL` Docker : OK, base joignable.
- Test `POST /api/micro-audits` avec `DATABASE_URL` Docker : OK, reponse `201`.
- Smoke test reproductible ajoute :
  - `npm run test:smoke`.
- Test HTTP reel avec l'API lancee sur `127.0.0.1:3001` :
  - `GET /api/health` : OK ;
  - `POST /api/micro-audits` : OK, reponse `201`.
- Verification directe PostgreSQL :
  - `leads` : ecritures de test confirmees ;
  - `micro_audits` : ecritures de test confirmees ;
  - `lead_events` : ecritures de test confirmees ;
  - `schema_migrations` : 1 ligne.

## Commandes utiles

Depuis `server/` :

```bash
npm install
docker compose up -d postgres
npm run typecheck
npm run build
npm run db:migrate
npm run test:smoke
npm start
```

Healthcheck :

```bash
curl http://127.0.0.1:3001/api/health
```

Sous PowerShell, pour lancer l'API locale avec la base Docker :

```powershell
cd C:\Users\Admin\Claude\ProjetAltos\Site-ALTOS\server
docker compose up -d postgres
$env:DATABASE_URL='postgres://altos:altos_dev_password@127.0.0.1:15432/altos'
npm.cmd run db:migrate
npm.cmd run test:smoke
npm.cmd run build
npm.cmd start
```

Base Docker :

```bash
docker compose ps
docker exec altos-postgres-dev psql -U altos -d altos
```

## Reste a faire en Phase 1

Ces actions concernent le VPS reel, pas le developpement local.

- Installer PostgreSQL sur le VPS.
- Creer l'utilisateur et la base `altos`.
- Renseigner le vrai `DATABASE_URL` dans `.env` sur le serveur.
- Executer les migrations sur la base reelle.
- Installer le service systemd.
- Brancher Nginx sur `/api/`.
- Configurer les logs API.
- Tester un endpoint ecriture sur PostgreSQL sur le VPS.
- Tester sauvegarde/restauration PostgreSQL sur une base de test.
- Valider `deploy/deploy.sh` sur le VPS.

## Hors Phase 1

- Brancher le formulaire micro-audit public sur l'API : Phase 2.
- Generer le PDF serveur : Phase 2.
- Back-office commercial : Phase 3.
- Factorisation navigation/footer : Phase 4.
