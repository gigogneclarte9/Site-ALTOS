# Deploiement VPS OVH

Document de reference pour le deploiement manuel sur VPS OVH.

## Principe retenu

Le VPS ne doit pas publier le depot complet.

Le repertoire public Nginx doit contenir uniquement les fichiers explicitement autorises dans :

```text
deploy/public-allowlist.txt
```

Les dossiers de travail, audits, imports, captures, fichiers prives et backups doivent rester hors webroot.

## Acces SSH de travail

Acces valide le 2026-06-19 :

```text
Utilisateur SSH : ubuntu
IP VPS          : 51.210.45.209
Hote detecte    : vps-a3f8ea05
Cle locale      : C:\Users\Admin\.ssh\altos_vps_ed25519
```

Commande de test depuis Windows PowerShell :

```powershell
ssh -i "C:\Users\Admin\.ssh\altos_vps_ed25519" -o BatchMode=yes ubuntu@51.210.45.209 "hostname && whoami && pwd"
```

Cette cle ne doit pas etre committee. Seul le chemin local est documente pour faciliter les interventions depuis la machine de developpement.

## Etat du VPS au 2026-06-19

Premier deploiement applicatif realise sur le VPS OVH.

URL publique actuelle :

```text
https://www.altos-experts.fr/
```

Etat valide :

- depot clone dans `/opt/altos-deploy/Site-ALTOS` ;
- commit deploye : `baf06ea` ;
- site public servi par Nginx depuis `/var/www/altos/current/public` ;
- API Fastify servie en local sur `127.0.0.1:3001` ;
- Nginx proxyfie `/api/`, `/admin` et `/documents/` vers l'API ;
- PostgreSQL installe localement et non expose publiquement ;
- base `altos` creee ;
- migrations `001_initial.sql` et `002_admin_notes.sql` appliquees ;
- `.env` production cree hors Git dans `/opt/altos-api/app/server/.env` ;
- PDF/documents prives stockes hors webroot dans `/var/lib/altos/documents/private` ;
- service systemd `altos-api` actif et active au demarrage ;
- services `nginx`, `postgresql` et `altos-api` actifs ;
- UFW actif avec uniquement `OpenSSH` et `Nginx Full` autorises ;
- domaines `altos-experts.fr` et `www.altos-experts.fr` pointes vers le VPS ;
- HTTPS Let's Encrypt actif pour `www.altos-experts.fr` et `altos-experts.fr` ;
- redirection HTTP -> HTTPS active ;
- redirection `altos-experts.fr` -> `www.altos-experts.fr` active ;
- certificat Let's Encrypt valide jusqu'au 2026-09-17 avec renouvellement automatique Certbot ;
- `/api/health` repond avec `database.ok = true` et version `0.4.1` apres deploiement du commit correspondant.

Points volontairement restants avant production complete :

- renseigner SMTP si notification email souhaitee ;
- tester le telechargement PDF admin apres creation du compte admin ;
- lancer et valider une premiere sauvegarde/restauration.

## Scripts manuels

Scripts disponibles dans `deploy/` :

- `deploy.sh` : deploiement manuel du statique public et de l'API ;
- `run-migrations.sh` : execution des migrations sur le serveur ;
- `backup-postgres.sh` : sauvegarde PostgreSQL en format custom ;
- `restore-postgres.sh` : restauration d'une sauvegarde PostgreSQL ;
- `public-allowlist.txt` : liste blanche des fichiers publics ;
- `nginx-altos.conf.example` : configuration Nginx cible ;
- `altos-api.service.example` : service systemd cible ;
- `server.env.production.example` : exemple de variables serveur.
- `postgres-init.sql.example` : creation utilisateur/base PostgreSQL.
- `bootstrap-vps.sh` : bootstrap Ubuntu LTS.

Le script `deploy.sh` :

- copie uniquement les fichiers presents dans la liste blanche ;
- synchronise le dossier `server/` vers `/opt/altos-api/app/server` ;
- installe les dependances ;
- compile l'API ;
- execute les migrations ;
- redemarre le service systemd.

Il doit etre execute depuis la racine du depot.

## Arborescence cible

```text
/var/www/altos/
  current/
    public/              # fichiers statiques publics uniquement
  releases/              # versions deployees
  shared/                # donnees partagees entre releases si besoin

/opt/altos-api/
  app/                   # backend Fastify
  .env                   # secrets serveur, jamais dans Git

/var/lib/altos/
  documents/
    private/             # PDF generes, documents clients, imports prives
    public/              # fichiers publics approuves
  backups-local/

/var/log/altos/
  api/
  deploy/
```

## Nginx

Un exemple de configuration est disponible ici :

```text
deploy/nginx-altos.conf.example
```

Regles importantes :

- redirection HTTP vers HTTPS ;
- domaine canonique : `https://www.altos-experts.fr/` ;
- redirection `altos-experts.fr` vers `www.altos-experts.fr` ;
- site statique servi depuis `/var/www/altos/current/public` ;
- proxy `/api/` vers Fastify sur `127.0.0.1:3001` ;
- refus direct des dossiers prives ;
- headers de securite de base ;
- cache long pour assets statiques.

Note multi-projets :

- la configuration Nginx ALTOS utilise des `server_name` explicites ;
- l'IP seule n'est pas l'URL de production et peut retourner une page neutre ;
- d'autres projets pourront etre ajoutes plus tard via leurs propres dossiers, services et blocs Nginx dedies ;
- chaque futur projet devra avoir son propre webroot, son propre nom de domaine et, si besoin, son propre service systemd.

## Fichiers publics autorises

Assets publics actuels :

- `assets/charte-ambassadeurs-ia.pdf` : PDF volontairement lie depuis l'accueil ;
- `assets/nicolas-darcos.jpg` : photo publique ;
- `assets/og-default.png` : image de partage social ;
- `assets/site.css` : CSS public si utilise ;
- `micro-audit.js` : script public du micro-audit actuel.

Fichiers explicitement exclus :

- `assets/audit-bot.js` : prototype Claude Artifact non production, non reference par les pages ;
- `uploads/` ;
- `work/` ;
- `audits-raw/` ;
- `audits-extracted/` ;
- `screenshots/` ;
- `private/` ;
- `backups/` ;
- `exports/` ;
- `generated/`.

## Variables d'environnement

Les variables doivent rester hors Git.

Backend :

```text
NODE_ENV=production
HOST=127.0.0.1
PORT=3001
CORS_ORIGIN=https://www.altos-experts.fr,https://altos-experts.fr
DATABASE_URL=postgres://...
DOCUMENTS_PRIVATE_DIR=/var/lib/altos/documents/private
SMTP_HOST=...
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=hello@altos-experts.fr
SMTP_PASS=...
NOTIFICATION_FROM=ALTOS <hello@altos-experts.fr>
NOTIFICATION_TO=hello@altos-experts.fr
ADMIN_SESSION_SECRET=...
```

Si les variables SMTP ne sont pas renseignees, l'API continue d'enregistrer les micro-audits et saute simplement la notification email.

Au 2026-06-19, l'adresse publique retenue est `hello@altos-experts.fr`. Le micro-audit est teste OK en production. Les notifications SMTP necessitent encore les parametres techniques de la boite mail : hote SMTP, port, securite TLS/SSL, identifiant et mot de passe/app password.

`ADMIN_SESSION_SECRET` doit etre une valeur longue et aleatoire en production. Elle sert a signer les sessions du back-office.

En developpement local Docker, l'URL utilisee est :

```text
DATABASE_URL=postgres://altos:altos_dev_password@127.0.0.1:15432/altos
```

En developpement local, les PDF generes par l'API sont stockes par defaut dans :

```text
server/storage/private
```

Un exemple de fichier production est disponible ici :

```text
deploy/server.env.production.example
```

## Service systemd

Un exemple de service API est disponible ici :

```text
deploy/altos-api.service.example
```

Principe :

- l'API ecoute uniquement sur `127.0.0.1:3001` ;
- Nginx expose `/api/` publiquement via proxy ;
- le service tourne avec un utilisateur dedie `altos` ;
- les fichiers prives restent dans `/var/lib/altos`.

## Back-office admin

Routes principales :

```text
GET /admin/login
GET /admin/leads
GET /admin/leads/:id
GET /admin/documents/:id/download
```

Creation d'un admin sur le VPS :

```bash
cd /opt/altos-api/app/server
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="mot-de-passe-fort" npm run admin:create
```

Le compte local `admin@altos.local` ne doit pas etre utilise en production.

Au 2026-06-19, le premier compte admin de production a ete cree pour `a.taurisano@eventorizon.studio`. Le mot de passe ne doit jamais etre documente ni commite.

## Sauvegardes

Strategie cible :

- dump PostgreSQL quotidien ;
- sauvegarde des fichiers prives hors webroot ;
- archive chiffree ;
- copie hors VPS ;
- test de restauration regulier.

Commande PostgreSQL cible :

```bash
DATABASE_URL="postgres://..." deploy/backup-postgres.sh
```

Restauration :

```bash
DATABASE_URL="postgres://..." deploy/restore-postgres.sh /var/lib/altos/backups-local/postgres/altos-YYYYMMDDTHHMMSSZ.dump
```

La restauration doit etre testee sur une base de preproduction ou de test avant toute utilisation sur production.

## Avant passage Phase 1

- Valider la liste blanche publique.
- Valider l'exemple Nginx.
- Confirmer que les fichiers prives ne seront jamais deployes dans le webroot.
- Confirmer la strategie de sauvegarde et de restauration.
