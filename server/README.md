# ALTOS server

Backend applicatif cible pour le VPS OVH.

## Stack

- TypeScript
- Node.js LTS
- Fastify
- PostgreSQL local
- PDF serveur avec `jsPDF`, pour conserver le rendu historique du PDF navigateur

## Installation locale

```bash
npm install
cp .env.example .env
npm run dev
```

Base PostgreSQL locale avec Docker :

```bash
docker compose up -d postgres
npm run db:migrate
npm run test:smoke
npm run dev
```

URL PostgreSQL locale Docker :

```text
postgres://altos:altos_dev_password@127.0.0.1:15432/altos
```

Migrations :

```bash
npm run db:migrate
```

Healthcheck :

```text
GET /api/health
```

Le healthcheck expose aussi les informations de version definies dans `src/version.ts`.

Micro-audit :

```text
POST /api/micro-audits
```

L'endpoint `POST /api/micro-audits` valide le payload, ecrit dans PostgreSQL, genere un PDF serveur, cree une ligne `documents`, puis renvoie `documentId` et `pdfUrl`.

Si le SMTP est configure, une notification interne est envoyee apres l'enregistrement. Sans SMTP, la notification est ignoree et la soumission reste valide.

Telechargement PDF :

```text
GET /api/documents/:id/download
```

Si `DATABASE_URL` n'est pas configure, les endpoints applicatifs repondent avec `503` au lieu de simuler une persistance.

Le healthcheck indique aussi l'etat de la base si `DATABASE_URL` est present.

## Base de donnees

Appliquer la migration initiale :

```bash
psql "$DATABASE_URL" -f migrations/001_initial.sql
```

Les PDF et documents ne doivent pas etre stockes en base. La base garde uniquement les metadonnees et le chemin prive hors webroot.

Repertoire local par defaut :

```text
./storage/private
```

## Back-office commercial

Routes locales :

```text
GET /admin/login
GET /admin/leads
GET /admin/leads?q=...&status=...&source=...&page=...
GET /admin/leads/export.csv
GET /admin/leads/:id
GET /admin/documents/:id/download
```

La liste admin propose recherche, filtres par statut/source, pagination et export CSV. La fiche lead affiche les coordonnees, le score, les axes, les quick wins, les reponses detaillees, les notes internes, l'historique et les documents.

La barre admin affiche les versions du site public et de l'admin. Ces valeurs viennent de `src/version.ts` et doivent etre mises a jour avec `CHANGELOG.md`.

Compte local cree pour tester :

```text
admin@altos.local
AltosLocal!2026
```

Creer ou mettre a jour un admin :

```bash
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="..." npm run admin:create
```

Nettoyer les faux leads locaux crees par les tests :

```bash
npm run db:cleanup-test-data
```

Variables associees :

```text
ADMIN_SESSION_SECRET=...
```
