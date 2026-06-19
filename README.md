# Site ALTOS

Site public et socle applicatif ALTOS pour un deploiement autonome sur VPS OVH.

## Objectif

Le projet combine :

- un site public editorial rapide, majoritairement statique ;
- un micro-audit IA commercial en 10 questions ;
- une API interne pour stocker les leads, reponses, scores et PDF ;
- un back-office commercial simple sous `/admin` ;
- une base PostgreSQL locale au VPS ;
- des documents PDF stockes hors webroot.

Le projet n'utilise pas n8n, Airtable, Google Sheets ou autre outil tiers comme source de verite. Les donnees applicatives vivent sur le VPS.

## Stack retenue

```text
Frontend public : HTML / CSS / JavaScript statique
Backend         : TypeScript + Node.js LTS + Fastify
Base            : PostgreSQL
PDF             : generation serveur avec jsPDF
Serveur web     : Nginx
Hebergement     : VPS OVH
Deploiement     : Git + script manuel deploy/deploy.sh
```

Documentation detaillee :

- [docs/STACK_TECHNIQUE.md](docs/STACK_TECHNIQUE.md)
- [docs/DECISIONS_TECHNIQUES.md](docs/DECISIONS_TECHNIQUES.md)
- [docs/ROADMAP_PRODUIT.md](docs/ROADMAP_PRODUIT.md)

## Structure principale

```text
.
├── assets/                      # assets publics
├── cas-usage/                   # fiches de cas d'usage
├── deploy/                      # scripts et templates de deploiement
├── docs/                        # documentation projet
├── journal/                     # articles editoriaux
├── partials/                    # fragments publics partages
├── server/                      # API Fastify, migrations, admin
├── BACKLOG.md                   # backlog fonctionnel et technique
├── CHANGELOG.md                 # versions et changements
├── index.html                   # accueil public
├── micro-audit.html             # page micro-audit
└── micro-audit.js               # logique navigateur du micro-audit
```

## Variables d'environnement

Les secrets ne doivent jamais etre commits.

Fichiers locaux :

```text
server/.env                  # environnement local, ignore par Git
server/.env.example          # exemple local versionne
```

Fichiers production :

```text
deploy/server.env.production.example      # exemple prod versionne
/opt/altos-api/app/server/.env            # vrai .env prod sur le VPS, hors Git
```

Le SMTP de production sera renseigne plus tard dans le `.env` du VPS. Tant que les variables SMTP ne sont pas configurees, les micro-audits sont bien enregistres, mais la notification email interne est ignoree.

Variables principales :

```text
NODE_ENV
HOST
PORT
CORS_ORIGIN
DATABASE_URL
DOCUMENTS_PRIVATE_DIR
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASS
NOTIFICATION_FROM
NOTIFICATION_TO
ADMIN_SESSION_SECRET
```

## Lancement local

Site statique :

```powershell
python -m http.server 8080
```

Puis ouvrir :

```text
http://127.0.0.1:8080/
```

API et base locale :

```powershell
cd server
npm install
Copy-Item .env.example .env
docker compose up -d postgres
npm run db:migrate
npm run dev
```

API locale :

```text
http://127.0.0.1:3001/api/health
```

Smoke test backend :

```powershell
cd server
npm run test:smoke
```

## Micro-audit

Le micro-audit public collecte :

- prenom ;
- nom ;
- email ;
- telephone ;
- consentement ;
- reponses detaillees ;
- score ;
- axes ;
- recommandations ;
- PDF serveur.

Le resultat et le PDF ne sont affiches qu'apres enregistrement API reussi.

Specification du futur moteur de scoring/recommandations :

- [docs/SPEC_MICRO_AUDIT_SCORING.md](docs/SPEC_MICRO_AUDIT_SCORING.md)

Contrainte importante : ameliorer le moteur automatique sans changer le rendu visuel du site ni le design du PDF.

## Back-office

URL locale ou production :

```text
/admin/login
```

Fonctions principales :

- connexion admin ;
- liste des leads ;
- filtres et recherche ;
- export CSV ;
- fiche lead ;
- reponses detaillees ;
- score et axes ;
- quick wins ;
- notes internes ;
- telechargement PDF protege.

Documentation :

- [docs/PHASE_3_BACK_OFFICE_COMMERCIAL.md](docs/PHASE_3_BACK_OFFICE_COMMERCIAL.md)
- [server/README.md](server/README.md)

## Deploiement VPS

Regle obligatoire : le code et les contenus versionnes sont deployes depuis Git uniquement.

Flux :

```text
local -> commit -> push GitHub -> git pull/reset sur VPS -> deploy.sh
```

Ne pas modifier directement sur le VPS :

- pages HTML publiques ;
- JS/CSS applicatifs ;
- backend `server/` ;
- partials ;
- assets versionnes ;
- documentation projet ;
- scripts `deploy/` versionnes ;
- changelog/versioning.

Les modifications directes sur le VPS sont reservees a l'infrastructure :

- `.env` production ;
- Nginx ;
- certificats Let's Encrypt ;
- systemd ;
- PostgreSQL ;
- sauvegardes/restaurations ;
- firewall et securite systeme.

Documentation :

- [docs/DEPLOIEMENT_VPS.md](docs/DEPLOIEMENT_VPS.md)
- [deploy/README.md](deploy/README.md)

## Versioning

Le suivi se fait dans :

- [CHANGELOG.md](CHANGELOG.md)
- [docs/VERSIONING.md](docs/VERSIONING.md)
- `server/src/version.ts`

La zone admin affiche les versions site/admin afin de savoir ce qui est deploye.

Les changements non encore publies doivent rester dans la section `Non publie` du changelog jusqu'a creation d'une nouvelle version.

## Documentation utile

- [BACKLOG.md](BACKLOG.md)
- [docs/ROADMAP_PRODUIT.md](docs/ROADMAP_PRODUIT.md)
- [docs/DEPLOIEMENT_VPS.md](docs/DEPLOIEMENT_VPS.md)
- [docs/STRUCTURE_CONTENU_PUBLIC.md](docs/STRUCTURE_CONTENU_PUBLIC.md)
- [docs/MODELE_DONNEES.md](docs/MODELE_DONNEES.md)
- [docs/AUDIT_SECURITE_DEPOT.md](docs/AUDIT_SECURITE_DEPOT.md)

