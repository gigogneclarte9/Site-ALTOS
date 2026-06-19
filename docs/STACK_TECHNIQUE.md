# Stack technique ALTOS

Document de reference pour garder en memoire l'etat technique actuel du projet et la cible retenue : tout heberger et exploiter sur le VPS OVH.

## 1. Stack actuelle constatee

### Frontend

- HTML statique.
- CSS principalement inline dans chaque page HTML.
- JavaScript vanilla, sans framework.
- Quelques scripts separes :
  - `micro-audit.js` pour le questionnaire et la generation du bilan PDF ;
  - `assets/audit-bot.js`, probablement prototype/ancien composant ;
  - `design-canvas.jsx` et `tweaks-panel.jsx`, probablement lies a Claude Design / prototypage.
- Pas de React/Vue/Svelte deploye dans le site public.
- Pas de bundler detecte : aucun `package.json`, aucun Vite, Next, Astro, Eleventy, etc.

### Pages et contenu

- Pages statiques principales :
  - `index.html`
  - `cas-usage.html`
  - `micro-audit.html`
  - `mentions-legales.html`
  - `confidentialite.html`
- Articles statiques dans `journal/`.
- Fiches cas d'usage statiques dans `cas-usage/`.
- Anciennes directions/designs dans `directions/` et fichiers archives.

### Interactions cote navigateur

- Animations reveal via `IntersectionObserver`.
- Filtrage des cas d'usage en JavaScript cote client.
- Micro-audit avec :
  - questionnaire local ;
  - scoring local ;
  - generation de recommandations locales ;
  - stockage local dans `localStorage` ;
  - generation PDF via `jsPDF` charge depuis CDN.
- Integration Cal.com via script externe `https://app.cal.com/embed/embed.js`.

### Donnees

- Aucune base de donnees applicative actuellement.
- Aucune API serveur interne actuellement.
- Les leads du micro-audit sont stockes uniquement dans le navigateur visiteur :
  - cle : `altos_audit_leads`
  - support : `localStorage`
  - consequence : ALTOS ne recupere pas les leads en production.

### Services externes actuels

- Cal.com pour la prise de rendez-vous.
- Google Fonts.
- CDN cdnjs pour `jsPDF`.
- Liens publics vers France Num, DGE, LinkedIn, Cal.com.

Ces dependances ne sont pas le coeur applicatif. La cible retenue est de garder les donnees, les PDF et le suivi commercial sur le VPS.

### SEO

- Balises meta principales presentes.
- Open Graph et Twitter Cards presents.
- Canonicals presents.
- Sitemap XML.
- Robots.txt.
- JSON-LD sur plusieurs pages.

### Versionnement

- Depot Git present dans `Site-ALTOS`.
- Remote GitHub : `https://github.com/gigogneclarte9/Site-ALTOS.git`.
- Branche : `main`, synchronisee avec `origin/main`.
- Pas de `.gitignore` detecte au moment de l'analyse initiale.
- Un `.gitignore` a ete ajoute ensuite pour bloquer les futurs ajouts de fichiers locaux, prives, generes ou sensibles.
- Les fichiers deja suivis dans `uploads/`, `work/`, `audits-raw/`, `audits-extracted/` et `screenshots/` restent a traiter par une desindexation Git explicite si on veut les retirer du depot.
- Des documents de travail et uploads sont suivis par Git.
- Voir `docs/AUDIT_SECURITE_DEPOT.md`.

### Deploiement

- Aucun script de deploiement detecte.
- Aucun fichier Docker, Compose, Nginx ou CI/CD detecte.
- Le site peut etre servi directement par Nginx comme repertoire statique, mais la cible retenue ajoute une API, PostgreSQL et un stockage prive des PDF.

## 2. Socle backend initialise

Un premier backend a ete ajoute dans `server/`.

Contenu actuel :

- `server/package.json` : scripts Node/TypeScript ;
- `server/src/app.ts` : application Fastify ;
- `server/src/server.ts` : demarrage HTTP ;
- `server/src/routes/health.ts` : `GET /api/health` ;
- `server/src/routes/micro-audits.ts` : `POST /api/micro-audits` avec validation JSON schema ;
- `server/src/routes/documents.ts` : `GET /api/documents/:id/download` pour streamer les PDF prives ;
- `server/src/routes/admin.ts` : back-office commercial HTML/admin rendu cote serveur ;
- `server/src/services/micro-audit-pdf.ts` : generation PDF serveur avec `jsPDF`, portee depuis l'ancien generateur navigateur ;
- `server/src/services/notifications.ts` : notification email interne optionnelle via SMTP ;
- `server/src/services/passwords.ts` : hash/verif mot de passe admin avec `scrypt` ;
- `server/src/services/admin-session.ts` : sessions admin signees et CSRF ;
- `server/src/db/pool.ts` : pool PostgreSQL a partir de `DATABASE_URL` ;
- `server/migrations/001_initial.sql` : tables `leads`, `micro_audits`, `documents`, `lead_events`, `admin_users` ;
- `server/.env.example` : variables attendues.
- `DOCUMENTS_PRIVATE_DIR` : repertoire prive des PDF generes.

Verification realisee :

- `npm install` via `npm.cmd install` sous Windows ;
- `npm run typecheck` ;
- `npm run build` ;
- test Fastify inject :
  - `GET /api/health` repond `200` ;
  - `POST /api/micro-audits` repond `503` si `DATABASE_URL` n'est pas configure, afin de ne pas simuler une fausse persistance.
- smoke test local :
  - creation lead ;
  - creation micro-audit ;
  - creation evenement ;
  - creation PDF et ligne `documents` ;
  - telechargement PDF via API.

Back-office local :

- `GET /admin/login` ;
- `POST /admin/login` ;
- `GET /admin/leads` ;
- `GET /admin/leads/:id` ;
- `POST /admin/leads/:id/status` ;
- `POST /admin/leads/:id/notes` ;
- `GET /admin/documents/:id/download`.

## 3. Decision d'architecture retenue

Le projet doit evoluer vers une architecture autonome sur VPS OVH.

Objectif :

- site public servi par Nginx ;
- API backend sur le meme VPS ;
- base PostgreSQL sur le VPS ;
- PDF et documents stockes sur disque hors webroot ;
- back-office interne a terme ;
- sauvegardes externes chiffrees ;
- aucune dependance structurante a n8n, Airtable, Google Sheets ou Supabase SaaS.

Cal.com peut rester une dependance fonctionnelle pour la prise de rendez-vous, mais les donnees produites par le site ALTOS doivent rester sur l'infrastructure ALTOS.

## 4. Architecture cible

```text
Internet
  -> Nginx
      -> site statique public
      -> backend API /api
      -> fichiers publics explicitement autorises

Backend API
  -> collecte micro-audit
  -> calcul/validation serveur
  -> generation PDF cote serveur
  -> gestion des leads
  -> authentification admin
  -> back-office HTML/admin sobre, dynamique et rendu cote serveur

PostgreSQL
  -> leads
  -> reponses micro-audit
  -> scores
  -> recommandations
  -> statuts commerciaux
  -> metadonnees documents/PDF
  -> journal d'evenements

Stockage fichiers local
  -> PDF generes
  -> documents prives
  -> documents publics approuves
  -> exports

Sauvegardes
  -> dump PostgreSQL
  -> archive fichiers
  -> copie chiffree hors VPS
```

## 5. Stack cible court terme

```text
OS : Ubuntu LTS
Serveur web : Nginx
HTTPS : Let's Encrypt / Certbot
Langage backend : TypeScript
Runtime backend : Node.js LTS
Framework API : Fastify
Base : PostgreSQL local
Process manager : systemd ou PM2
Stockage PDF : disque VPS hors webroot
Generation PDF : cote serveur
Back-office initial : HTML/admin sobre, dynamique et rendu cote serveur
Authentification admin : email + mot de passe, 2FA plus tard
Deploiement : Git + script manuel deploy.sh
Backups : pg_dump + sauvegarde fichiers + copie externe chiffree
Monitoring : logs Nginx/API + Uptime Kuma ou equivalent
Rendez-vous : Cal.com conserve
```

Decision backend :

- TypeScript + Node.js LTS + Fastify.
- Pas de PHP pour le socle applicatif.
- Pas de framework full-stack lourd au demarrage.

Raisons :

- Le projet actuel utilise deja JavaScript cote navigateur.
- Le micro-audit est deja code en JavaScript : logique plus facile a partager ou porter cote serveur.
- TypeScript securise les structures de donnees : leads, reponses, documents, statuts.
- Fastify fournit une API simple, performante, avec validation de schema propre.
- Node.js gere bien les besoins attendus : API, PDF, emails, fichiers, PostgreSQL.
- PHP serait possible techniquement, mais il n'apporte pas d'avantage net ici et introduirait un second ecosysteme.

Librairies probables :

```text
fastify                 # serveur API
@fastify/cors           # CORS limite au domaine public
@fastify/rate-limit     # protection endpoints publics
pg ou postgres.js       # connexion PostgreSQL
zod ou TypeBox          # validation schema
jspdf                   # generation PDF serveur actuelle, alignement avec l'ancien PDF navigateur
nodemailer              # notifications email via SMTP
bcrypt ou argon2        # hash mots de passe admin
```

## 6. Arborescence serveur cible

Arborescence possible :

```text
/var/www/altos/
  current/                 # version active du site
  releases/                # versions deployees
  shared/                  # fichiers partages entre releases

/opt/altos-api/
  app/                     # backend API
  .env                     # variables serveur, non versionnees

/var/lib/altos/
  documents/
    private/               # PDF et documents non accessibles publiquement
    public/                # fichiers publics valides
  exports/
  backups-local/

/var/log/altos/
  api/
  deploy/
```

Nginx ne doit jamais exposer directement `/var/lib/altos/documents/private`.

## 7. Base de donnees

Base recommandee : PostgreSQL.

Pourquoi :

- robuste ;
- standard ;
- excellent pour donnees structurees ;
- tres bon pour recherches et historiques ;
- facile a sauvegarder avec `pg_dump` ;
- evolutif si back-office et reporting arrivent plus tard.

Schema minimal propose :

```text
leads
  id
  first_name
  last_name
  email
  phone
  company
  source
  consent_at
  created_at
  updated_at

micro_audits
  id
  lead_id
  score_total
  top_axis
  answers_json
  axes_json
  recommendations_json
  pdf_document_id
  created_at

documents
  id
  lead_id
  micro_audit_id
  type
  filename
  storage_path
  mime_type
  size_bytes
  sha256
  visibility
  created_at
  expires_at

lead_events
  id
  lead_id
  type
  payload_json
  created_at

admin_users
  id
  email
  password_hash
  role
  created_at
  last_login_at
```

Au debut, `admin_users` peut attendre si le back-office n'est pas livre tout de suite. Mais le schema doit etre pense pour y venir.

## 8. Gestion des PDF et fichiers

Decision :

- Les metadonnees des PDF vont en base.
- Les fichiers PDF vont sur disque, hors webroot.

Ne pas mettre les PDF eux-memes en base par defaut.

Raisons :

- La base reste legere.
- Les sauvegardes sont plus simples a segmenter.
- Les restaurations sont plus rapides.
- Les PDF sont naturellement des fichiers.
- Le controle d'acces peut etre gere par l'API.

Exemple :

```text
/var/lib/altos/documents/private/micro-audits/2026/06/{document_id}.pdf
```

La table `documents` stocke :

```text
document_id
lead_id
micro_audit_id
storage_path
filename
sha256
mime_type
size_bytes
visibility
created_at
expires_at
```

Telechargement prive :

```text
GET /api/documents/:id/download
```

L'API verifie les droits, puis stream le fichier.

## 9. Micro-audit cible

Etat actuel :

- le navigateur calcule tout ;
- le navigateur garde le lead en `localStorage` ;
- le PDF est genere cote navigateur.

Cible :

- le navigateur affiche le questionnaire ;
- a la soumission, il envoie les reponses a l'API ;
- l'API valide les donnees ;
- l'API stocke le lead et les reponses en PostgreSQL ;
- l'API calcule ou verifie le score ;
- l'API genere le PDF cote serveur ;
- l'API stocke le PDF hors webroot ;
- l'API cree une ligne `documents` avec taille et hash SHA-256 ;
- l'API retourne `documentId` et `pdfUrl` au front ;
- l'API retourne un resultat affichable par le front ;
- une notification email interne peut etre envoyee depuis le backend.

Endpoint minimal :

```text
POST /api/micro-audits
```

Payload type :

```json
{
  "contact": {
    "firstName": "Nicolas",
    "lastName": "Darcos",
    "email": "hello@altos-experts.fr",
    "phone": "0600000000",
    "company": "ALTOS"
  },
  "consent": true,
  "answers": [
    {"questionId": "admin_hours", "optionIndex": 2, "score": 2}
  ]
}
```

## 10. Back-office cible

Objectif : consulter et suivre les leads sans outil tiers.

Fonctions minimales :

- interface HTML/admin sobre, dynamique et rendue cote serveur ;
- connexion admin par email + mot de passe ;
- mots de passe hashes avec `scrypt` dans la premiere version ;
- 2FA possible dans un second temps ;
- liste des leads ;
- detail d'un micro-audit ;
- score total et axes ;
- recommandations generees ;
- lien vers PDF ;
- statut commercial :
  - nouveau ;
  - a contacter ;
  - contacte ;
  - RDV pris ;
  - gagne ;
  - perdu ;
- notes internes ;
- export CSV.

Premiere version locale livree :

- liste des leads ;
- fiche lead ;
- notes internes ;
- changement de statut ;
- telechargement PDF via route admin protegee ;
- journalisation des actions sensibles de base.

Le back-office peut etre livre apres l'API de collecte, mais la base doit etre structuree pour le permettre.

Precision :

- "HTML/admin sobre" ne signifie pas statique.
- Les pages admin seront dynamiques et connectees a PostgreSQL.
- Le rendu peut etre fait cote serveur via Fastify et des templates.
- Les formulaires admin declencheront des actions backend classiques.
- Un peu de JavaScript pourra etre ajoute si utile, mais sans SPA lourde au demarrage.

Exemples de routes admin :

```text
GET  /admin/leads
GET  /admin/leads/:id
GET  /admin/micro-audits/:id
POST /admin/leads/:id/status
POST /admin/leads/:id/notes
GET  /admin/documents/:id/download
```

Decision :

- commencer par une interface admin simple ;
- eviter une SPA admin lourde au demarrage ;
- proteger toutes les routes admin ;
- enrichir l'interface ensuite si les usages le justifient.

## 11. Deploiement

Premier palier :

- clone Git sur VPS ;
- script manuel `deploy.sh` ;
- sync vers `/var/www/altos/current` ;
- installation API dans `/opt/altos-api` ;
- service systemd pour l'API ;
- reload Nginx.

Plus tard :

- GitHub Actions vers VPS ;
- releases atomiques ;
- rollback simple ;
- tests de liens et smoke tests avant bascule.

## 12. Securite

La securite de cette architecture repose sur plusieurs couches. Fastify ne rend pas le projet securise a lui seul ; c'est l'ensemble VPS + Nginx + API + PostgreSQL + stockage fichiers + sauvegardes qui doit etre concu proprement.

### VPS et systeme

- Ubuntu LTS maintenu a jour.
- Firewall actif.
- Ports publics limites :
  - `80` HTTP, redirige vers HTTPS ;
  - `443` HTTPS ;
  - `22` SSH, idealement restreint.
- SSH par cle uniquement.
- Authentification SSH par mot de passe desactivee.
- Acces root direct desactive si possible.
- Utilisateur applicatif dedie, sans privileges inutiles.
- Fail2ban ou protection equivalente contre brute force SSH.
- Mises a jour de securite appliquees regulierement.

### Nginx et HTTPS

- HTTPS obligatoire via Let's Encrypt.
- Redirection HTTP -> HTTPS.
- Domaine canonique unique.
- Headers de securite :
  - `Strict-Transport-Security` ;
  - `X-Content-Type-Options` ;
  - `X-Frame-Options` ou CSP `frame-ancestors` ;
  - `Referrer-Policy` ;
  - `Content-Security-Policy` a definir progressivement.
- Nginx sert uniquement les dossiers publics.
- Les dossiers prives ne sont jamais sous le webroot.
- Blocage explicite des chemins de travail :
  - `/uploads/` si non public ;
  - `/work/` ;
  - `/audits-raw/` ;
  - `/audits-extracted/` ;
  - fichiers archives non destines au public.

### API

- API exposee sous `/api`.
- Validation stricte de tous les payloads.
- Rejet des champs inattendus.
- Limitation de taille des requetes.
- Rate limit sur endpoints publics, notamment `POST /api/micro-audits`.
- CORS limite au domaine public ALTOS.
- Gestion centralisee des erreurs sans fuite de stack traces.
- Logs techniques sans enregistrer inutilement les donnees personnelles.
- Secrets dans `.env`, jamais dans Git.
- Rotation possible des secrets.

### Back-office admin

- Acces admin separe du site public.
- Authentification obligatoire.
- Mots de passe hashes avec Argon2 ou bcrypt.
- Sessions/cookies securises :
  - `HttpOnly` ;
  - `Secure` ;
  - `SameSite`.
- Protection CSRF si cookies de session.
- Tentatives de connexion limitees.
- Roles prevus meme si un seul admin au depart.
- Journalisation des actions sensibles :
  - consultation PDF ;
  - export ;
  - changement de statut ;
  - suppression/anonymisation.

### PostgreSQL

- PostgreSQL non expose sur Internet.
- Ecoute locale uniquement, sauf besoin contraire explicite.
- Utilisateur applicatif dedie.
- Droits limites au strict necessaire.
- Mot de passe fort dans `.env`.
- Migrations versionnees.
- Sauvegardes testees.

### PDF et documents

- PDF prives stockes hors webroot :

```text
/var/lib/altos/documents/private
```

- Aucun lien direct public vers les PDF prives.
- Telechargement via API uniquement :

```text
GET /api/documents/:id/download
```

- L'API verifie les droits avant de streamer le fichier.
- Les chemins fichiers ne sont jamais fournis directement au client.
- Hash SHA-256 stocke en base pour verifier l'integrite.
- Politique de conservation definie :
  - combien de temps garder un lead ;
  - combien de temps garder un PDF ;
  - comment supprimer/anonymiser sur demande RGPD.

### Donnees personnelles et RGPD

- Consentement explicite sur le micro-audit.
- Horodatage du consentement en base.
- Finalite claire : recontact, generation de bilan, suivi commercial.
- Donnees minimales.
- Droit a suppression/anonymisation.
- Export possible d'un dossier lead si demande.
- Duree de conservation documentee.

### Sauvegardes et restauration

- Sauvegardes chiffrees.
- Copie hors VPS.
- Sauvegarde de PostgreSQL et des documents.
- Test de restauration regulier.
- Les sauvegardes doivent etre protegees au meme niveau que la production.

### Checklist securite avant mise en ligne

- [ ] SSH par cle uniquement.
- [ ] Firewall actif.
- [ ] HTTPS actif.
- [ ] PostgreSQL non expose publiquement.
- [ ] `.env` absent de Git.
- [ ] Dossiers prives hors webroot.
- [ ] Nginx bloque les dossiers de travail.
- [ ] API valide les payloads.
- [ ] Rate limit actif.
- [ ] CORS limite.
- [ ] Back-office protege.
- [ ] Sauvegardes chiffrees configurees.
- [ ] Restauration testee.
- [ ] Politique de conservation des leads/PDF documentee.

## 13. Sauvegardes

Indispensable si tout vit sur le VPS.

Minimum :

- dump PostgreSQL quotidien ;
- archive quotidienne des documents prives ;
- copie chiffree hors VPS ;
- retention 7 jours quotidienne, 4 semaines hebdomadaire, 6 mois mensuelle ;
- test de restauration documente.

Exemple d'objets a sauvegarder :

```text
PostgreSQL database altos
/var/lib/altos/documents/private
/opt/altos-api/.env
configuration Nginx
services systemd
```

## 14. Evolution frontend

Ne pas migrer immediatement vers un framework applicatif.

Le site peut rester statique au depart.

Le back-office editorial arrivera en second temps avec :

- articles en base PostgreSQL ;
- cas d'usage en base PostgreSQL ;
- editeur WYSIWYG ;
- brouillons/revisions/publication ;
- medias publics geres depuis l'admin.

Un generateur statique peut rester utile pour le rendu public, mais la source editoriale cible sera PostgreSQL, pas des fichiers Markdown.

Cette evolution reste compatible avec l'architecture VPS autonome et ne remet pas en cause le plan de securite.

## 15. Stack cible retenue

```text
Frontend public : HTML/CSS/JS statique, puis generateur statique si besoin
Serveur public : Nginx sur VPS OVH
Backend : TypeScript + Node.js LTS + Fastify
Base : PostgreSQL local
PDF : fichiers sur disque hors webroot + metadonnees en base
Generation PDF : cote serveur
Admin : back-office HTML sobre connecte a PostgreSQL
Auth admin : mot de passe, 2FA plus tard
Rendez-vous : Cal.com
Emails : SMTP configure sur le backend
Deploiement : script manuel deploy.sh, puis CI/CD
Monitoring : logs + uptime + alertes
Backups : PostgreSQL + fichiers + copie externe chiffree
```

Decision ferme :

- pas de n8n pour la collecte ;
- pas d'Airtable comme base ;
- pas de Google Sheets comme stockage ;
- pas de Supabase SaaS comme socle applicatif ;
- le coeur metier reste sur le VPS ALTOS.
