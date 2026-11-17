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

## Release 0.4.16 du 2026-11-17

- Publiée à 10 h 09 min 50 s (Paris), commit applicatif `e2f7b02` : dix intitulés de cartes corrigés, bouton du quiz clarifié et quatre liens régionaux ajoutés. Site/release 0.4.16, admin 0.3.0.
- Sauvegarde root uniquement : `/var/lib/altos/backups-local/releases/20261117-before-0.4.16/`, archives API/public 0.4.15, dump ALTOS et états avant/après des services et de Radar.
- Déploiement habituel après push/pull fast-forward, chemins et service explicitement fixés à ALTOS. Build réussi, aucune migration en attente, seul `altos-api` redémarré. Dépendances conservées, audit production : zéro critique et quatre élevées déjà consignées dans la roadmap.
- Vérification : 39 fichiers publics conformes au commit, health/base et version admin corrects, chemins privés inaccessibles. Fichiers et processus Radar inchangés, Nginx/PostgreSQL non redémarrés. Rendu navigateur et parcours connectés non vérifiés.
- [État avant publication, mesures et rapport](seo/suivi/2026-11-17-avant-0.4.16/README.md). Ce lot est consigné dans la fenêtre de suivi des modifications du 16 novembre.

## Release 0.4.15 du 2026-11-16

- Page Occitanie et liens internes publiés à 17 h 15 min 09 s (Paris), soit 16:15:09 UTC. Commit applicatif `4bf07730a69518d526cd2f952ef8ad44f41fb4c9` ; release/site 0.4.15, admin 0.3.0.
- Sauvegarde root uniquement : `/var/lib/altos/backups-local/releases/20261116-before-0.4.15/`, contenant `api-0.4.14.tar.gz`, `public-0.4.13.tar.gz`, `altos.dump` et `before.json`.
- Déploiement habituel après push et pull fast-forward, destinations explicitement fixées à ALTOS. Installation et build réussis, aucune migration en attente, seul `altos-api` redémarré. Audit production : zéro alerte critique ; quatre élevées déjà qualifiées et consignées dans la roadmap.
- Contrôles : 39 fichiers publics conformes au commit, 21 URL du sitemap en HTTP 200, health/base et versions correctes, chemins privés inaccessibles. Vérifications HTTP/source ; rendu navigateur et calendrier externe non contrôlés automatiquement.
- Radar : 74 fichiers de release hors `node_modules` identiques, même PID et date de démarrage ; accueil et `/api/auth/me` HTTP 200. Services Nginx/PostgreSQL non redémarrés.
- [État avant publication, rapport et calendrier SEO](seo/suivi/2026-11-16-avant-0.4.15/README.md). Comparaisons à J+14 et J+28 après consolidation ; demande d’indexation Search Console effectuée le 16 novembre 2026, confirmée par l’utilisateur. Indexation effective encore à vérifier.

## Release 0.4.14 du 2026-11-16

- Publiée à 16 h 59 min 23 s (Paris), commit applicatif `95ab960ab6d196aadff515193fbc613ceb65b174`. Release 0.4.14 ; site public 0.4.13 et admin 0.3.0 conservés.
- Seule dépendance mise à jour : DOMPurify 3.4.11 → 3.4.17, compatible avec la plage de jsPDF 4.2.1. Aucun changement du HTML, CSS, des migrations ou du comportement applicatif.
- Installation propre, build TypeScript, cinq scénarios de scoring et six scénarios PDF réussis localement ; six scénarios PDF compilés également exécutés sur le VPS dans un répertoire temporaire, sans lead ni email de test.
- Sauvegarde protégée : `/var/lib/altos/backups-local/releases/20261116-before-0.4.14/`, contenant `api-0.4.13.tar.gz` (code, dist et dépendances installées), `public-0.4.13.tar.gz`, `altos.dump` et `before.json` (commit et empreintes). Accès root uniquement ; ne pas publier ces archives.
- Procédure Git habituelle, avec destinations explicitement fixées à `/var/www/altos/current/public`, `/opt/altos-api/app` et service `altos-api`. Base cible `altos` sur loopback vérifiée ; aucune migration en attente. Seul `altos-api` redémarré.
- Après publication : DOMPurify 3.4.17 installé, audit production zéro critique (quatre élevées restantes), health/base valides, page de connexion admin HTTP 200. Les 38 fichiers publics sont identiques à l’état avant ce correctif : la référence SEO reste celle de la release 0.4.13.
- Radar : 74 fichiers de release contrôlés hors `node_modules` identiques, lockfile et configurations service/Nginx inchangés, même PID `1685255` et même date de démarrage. Accueil et `/api/auth/me` HTTP 200 avec corps identiques avant/après. Services Nginx/PostgreSQL non redémarrés. Pas de modification du projet Radar ni de mise à jour globale de Node.js.
- Retour arrière préparé : arrêter uniquement `altos-api`, extraire l’archive API dans un dossier de restauration dédié, vérifier le contenu puis synchroniser son sous-dossier `server/` vers `/opt/altos-api/app/server/` (en préservant `.env`), et redémarrer uniquement `altos-api`. Vérifier ensuite health/base et Radar. Aucune restauration de base nécessaire pour ce correctif sans migration ; ne pas restaurer le dump sur des données plus récentes sans analyse séparée.

## Release 0.4.13 du 2026-11-16

- Lot : trois pages offres SEO, formats d’audit, cas documentés, métadonnées de partage et correctifs de contraste des boutons.
- Versions publiées le 16 novembre à 16 h 41 min 58 s (Paris) : site/release `0.4.13`, admin `0.3.0`. Commit applicatif `279a082`. Package technique backend inchangé.
- Référence avant publication conservée dans [le dossier SEO](seo/suivi/2026-11-16-avant-0.4.13/README.md), hors liste de déploiement public.
- Procédure autorisée : commit/push `main`, `git pull --ff-only` dans `/opt/altos-deploy/Site-ALTOS`, puis `sudo bash deploy/deploy.sh` ; sauvegarde du webroot avant copie.
- Vérifications réussies : health/base, version admin, empreintes des fichiers publics par rapport au commit, CSS ajouté à la liste publique, robots/sitemap et chemins privés testés en 404. Les trois services sont actifs. Rendu navigateur et calendrier externe non vérifiés.
- Le constat final horodaté est conservé dans [le suivi de mise en ligne](seo/suivi/2026-11-16-avant-0.4.13/DEPLOIEMENT.md).

## Release 0.4.12 du 2026-10-09

- Publication depuis `/opt/altos-deploy/Site-ALTOS`, branche `main`, via `git pull --ff-only` puis `sudo bash deploy/deploy.sh`.
- Correctifs : TVA `FR 25 352 258 479`, telephone `06 61 57 00 19` et suppression du surlignage jaune dans `/mentions-legales.html`.
- Versions attendues apres deploiement : site/release `0.4.12`, admin `0.3.0`.
- Controles : `/api/health`, version dans `/admin/login` et valeurs publiees des mentions legales sans placeholder.

## Release 0.4.11 du 2026-10-08

- Cible confirmee par SSH : `ubuntu@51.210.45.209`, hote `vps-a3f8ea05`.
- Depot : `/opt/altos-deploy/Site-ALTOS`, branche `main`.
- Publication : commit/push GitHub, `git pull --ff-only`, puis `sudo bash deploy/deploy.sh`.
- Correctifs : contact `hello@altos-experts.fr`, marges et hauteur des cadres du PDF, liens de contact cliquables.
- Versions attendues apres deploiement : site/release `0.4.11`, admin `0.3.0`.
- Controles : `/api/health`, affichage `/admin/login`, pages publiques et generation PDF avec le module compile du VPS, sans creation de prospect ni envoi d'email.
- Les documents historiques stockes restent inchanges ; le correctif s'applique aux nouvelles generations.

## Etat historique du VPS au 2026-08-06

Premier deploiement applicatif realise sur le VPS OVH.

URL publique actuelle :

```text
https://www.altos-experts.fr/
```

Etat valide :

- depot clone dans `/opt/altos-deploy/Site-ALTOS` ;
- commit deploye : `0c52d55` (release `0.4.10`) ;
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
- `/api/health` repond avec `database.ok = true` et version `0.4.10` ;
- `/index.html` redirige en `301` vers `/` ;
- les URL inexistantes renvoient la page personnalisee avec un statut `404` ;
- l'accueil public expose le H1, les six reponses FAQ et les metadonnees SEO/GEO de la release `0.4.10` ;
- la page `/audit-ia-tpe-pme.html` repond en `200` avec un H1, six FAQ et des donnees structurees `Service` coherentes ;
- la page `/automatisation-processus-pme.html` repond en `200` avec un H1, six FAQ et des donnees structurees `Service` coherentes ;
- la page `/agents-ia-pme.html` repond en `200` avec un H1, six FAQ et des donnees structurees `Service` coherentes ;
- les dix etudes de cas repondent en `200` avec un H1 metier, un resume factuel et des donnees structurees `Article` enrichies ;
- le Journal et les trois pages piliers exposent le maillage contextuel de la release `0.4.10` ;
- la navigation mobile partagee est chargee sur les 23 pages publiques avec son script accessible ;
- `robots.txt` autorise explicitement `OAI-SearchBot` et `PerplexityBot` ;
- le sitemap public contient les 20 URL canoniques attendues, toutes verifiees en `200` ;
- la configuration Nginx precedente est sauvegardee dans `/etc/nginx/sites-available/altos.bak-20260806-seo`.

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

## Regle de deploiement Git

Le code et les contenus versionnes sont deployes depuis Git uniquement.

Flux obligatoire :

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
- scripts de deploiement versionnes ;
- changelog/versioning.

Modifications directes VPS autorisees uniquement pour l'infrastructure :

- `/opt/altos-api/app/server/.env` ;
- `/etc/nginx/sites-available/altos` ;
- certificats Let's Encrypt ;
- services systemd ;
- PostgreSQL ;
- sauvegardes/restaurations ;
- firewall et securite systeme.

Si une correction urgente est faite directement sur le VPS, elle doit etre reprise localement, commitee, pushee, puis redeployee depuis Git.

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
