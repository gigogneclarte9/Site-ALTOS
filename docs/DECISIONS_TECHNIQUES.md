# Decisions techniques

Journal des decisions et arbitrages retenus pour le projet ALTOS.

## 2026-06-18 - Architecture autonome sur VPS OVH

### Decision retenue

Le projet doit etre heberge et exploite sur un VPS OVH, avec base de donnees et stockage fichiers maitrises par ALTOS.

### Stack cible

```text
Nginx
Site statique public
Backend API
PostgreSQL local
Stockage fichiers local hors webroot
Back-office interne
Sauvegardes externes chiffrees
```

### Raisons

- Garder la maitrise des donnees.
- Eviter de disperser les leads dans plusieurs services tiers.
- Pouvoir historiser proprement les micro-audits.
- Pouvoir stocker et proteger les PDF.
- Preparer un futur back-office.
- Rester coherent avec un deploiement VPS OVH.

### Consequences

- Il faut maintenir un backend.
- Il faut installer, sauvegarder et monitorer PostgreSQL.
- Il faut securiser les fichiers prives hors webroot.
- Il faut documenter une procedure de restauration.
- La complexite initiale est plus elevee qu'un site purement statique, mais la fondation est plus durable.

## 2026-06-18 - Ne pas utiliser n8n/Airtable/Supabase pour le coeur applicatif

### Decision retenue

Ne pas brancher le micro-audit sur n8n, Airtable, Google Sheets ou Supabase SaaS pour la collecte et le stockage principal.

### Raisons

- Le besoin exprime est de tout garder sur le VPS.
- Le micro-audit doit devenir une brique commerciale centrale.
- Les leads et PDF doivent rester sous controle direct.
- Les services externes ajoutent de la dispersion et de la dependance.

### Consequences

- La collecte micro-audit doit passer par une API interne.
- Le stockage doit passer par PostgreSQL local.
- Les PDF doivent etre stockes sur disque VPS hors webroot.
- Toute automatisation ulterieure devra partir de la base/API interne, pas d'un outil tiers comme source de verite.

## 2026-06-18 - Garder le site public statique au depart

### Decision retenue

Conserver le front public en HTML/CSS/JS statique pour le premier palier, tout en ajoutant une API pour les fonctionnalites dynamiques.

### Raisons

- Le site actuel est deja statique.
- Les pages existantes peuvent etre servies efficacement par Nginx.
- La priorite n'est pas une refonte visuelle ou framework.
- Le vrai manque est cote donnees : leads, PDF, suivi.

### Consequences

- Nginx servira le site public.
- L'API sera exposee sous `/api`.
- Le front existant devra etre modifie plus tard pour appeler l'API au lieu de `localStorage`.
- Une migration vers Eleventy/Astro reste possible plus tard.

## 2026-06-18 - Stocker les PDF hors base

### Decision retenue

Les PDF et documents doivent etre stockes comme fichiers sur disque, hors webroot. La base PostgreSQL stockera les metadonnees.

### Ce qui va en base

- Identifiant document.
- Lead rattache.
- Micro-audit rattache.
- Nom de fichier.
- Chemin de stockage.
- Type MIME.
- Taille.
- Hash SHA-256.
- Visibilite.
- Dates de creation/expiration.

### Ce qui va sur disque

- PDF generes.
- Documents prives.
- Exports.
- Documents publics explicitement valides.

### Raisons

- PostgreSQL reste dedie aux donnees structurees.
- Les sauvegardes sont plus lisibles.
- Les fichiers sont plus simples a servir via l'API.
- Les restaurations sont plus simples.
- On evite de transformer la base en stockage binaire lourd.

### Repertoire cible

```text
/var/lib/altos/documents/private
/var/lib/altos/documents/public
```

Nginx ne doit jamais exposer directement `private`.

## 2026-06-18 - Generer les PDF cote serveur

### Decision retenue

Les PDF du micro-audit seront generes cote serveur, pas seulement dans le navigateur.

### Raisons

- Rendu plus controlable.
- Archivage fiable.
- PDF systematiquement rattache au lead.
- Meilleure tracabilite.
- Moins de dependance au navigateur du visiteur.
- Possibilite de regenerer un PDF depuis les donnees en base.

### Consequences

- L'API devra inclure une brique de generation PDF.
- Les donnees du micro-audit devront etre validees et stockees avant generation.
- Le PDF genere sera stocke hors webroot.
- La table `documents` conservera les metadonnees.

### Bibliotheques possibles

- `jsPDF` pour conserver le rendu historique deja en place cote navigateur.
- `playwright` pour generer un PDF a partir d'un template HTML si le rendu doit etre tres proche du site.

Decision d'implementation Phase 2 :

- `jsPDF` est retenu pour la version serveur afin de conserver le design et le contenu de l'ancien PDF.
- `playwright` reste une option future si l'on veut plus tard passer a un PDF base sur HTML/CSS.

Implementation locale :

- service `server/src/services/micro-audit-pdf.ts` ;
- port serveur de l'ancien generateur `jsPDF` navigateur ;
- stockage dans `DOCUMENTS_PRIVATE_DIR` ;
- metadonnees en table `documents` ;
- telechargement via `GET /api/documents/:id/download`.

## 2026-06-18 - Backend API interne

### Decision retenue

Ajouter un backend API interne sur le VPS.

### Stack retenue

- TypeScript.
- Node.js LTS.
- Fastify.

### Decision explicite

- Ne pas partir sur PHP.
- Ne pas partir sur Laravel/Symfony.
- Ne pas partir sur un framework full-stack type Next.js pour le backend initial.

### Raisons

- Le projet actuel est deja en HTML/CSS/JavaScript.
- Le micro-audit est deja en JavaScript : le scoring peut etre porte cote serveur plus facilement.
- TypeScript limite les erreurs sur les schemas leads/audits/documents.
- API simple et performante.
- Validation de schema propre.
- Bonne structure sans framework lourd.
- Suffisant pour collecte, documents, back-office et auth admin.
- PHP serait viable, mais ajouterait un ecosysteme supplementaire sans benefice clair pour ce projet.

### Endpoints initiaux probables

```text
POST /api/micro-audits
GET  /api/admin/leads
GET  /api/admin/leads/:id
GET  /api/documents/:id/download
POST /api/admin/login
```

## 2026-06-18 - PostgreSQL local comme source de verite

### Decision retenue

PostgreSQL local sur le VPS devient la source de verite applicative.

### Donnees concernees

- Leads.
- Contacts.
- Reponses micro-audit.
- Scores.
- Recommandations.
- Documents/PDF.
- Statuts commerciaux.
- Evenements de suivi.
- Utilisateurs admin.

### Consequences

- Prevoir migrations de schema.
- Prevoir sauvegardes quotidiennes.
- Prevoir restauration testee.
- Proteger les credentials.

## 2026-06-18 - Back-office interne a terme

### Decision retenue

Preparer l'architecture pour un back-office interne, meme s'il n'est pas livre au premier commit applicatif.

### Fonctions attendues

- Interface admin HTML sobre, dynamique et rendue cote serveur.
- Connexion admin par email + mot de passe.
- Liste des leads.
- Detail d'un micro-audit.
- Score, axes, recommandations.
- Acces aux PDF.
- Statut commercial.
- Notes internes.
- Export CSV.
- 2FA possible dans un second temps.

### Raisons

- Si toutes les donnees sont sur le VPS, il faut un moyen simple de les exploiter.
- Le micro-audit n'a de valeur commerciale que si les resultats sont consultables et suivis.
- Une interface HTML/admin simple, dynamique et rendue cote serveur suffit pour demarrer et reduit le cout de maintenance.

### Decision explicite

- Le back-office n'est pas statique.
- Il lit et ecrit dans PostgreSQL via le backend.
- Il peut utiliser des templates HTML rendus cote serveur.
- Les formulaires admin declenchent des actions backend classiques.
- Pas de SPA admin complexe au depart.
- Pas de framework front lourd pour le back-office initial.
- Routes admin protegees cote API.
- Rendu HTML serveur ou templates simples acceptes.

## 2026-06-18 - Sauvegardes obligatoires

### Decision retenue

La mise en production avec base et fichiers sur VPS impose des sauvegardes externes chiffrees.

### Minimum attendu

- `pg_dump` quotidien.
- Archive quotidienne des documents prives.
- Copie hors VPS.
- Retention documentee.
- Test de restauration.

### Raison

Un VPS n'est pas une sauvegarde. Si la base et les PDF vivent sur le serveur, la restauration doit etre pensee des le debut.

## 2026-06-18 - Deploiement manuel au depart

### Decision retenue

Le premier deploiement utilisera un script manuel `deploy.sh`.

Le code applicatif et les contenus versionnes doivent toujours etre deployes depuis Git. Le VPS ne doit pas devenir une source parallele de modifications applicatives.

### Raisons

- Plus simple pour le demarrage.
- Moins de variables CI/CD a gerer tant que l'architecture bouge encore.
- Suffisant pour un premier VPS.
- Permet de documenter chaque etape de deploiement.

### Consequences

- Le script devra etre versionne.
- Le script devra faire au minimum :
  - recuperation du code ;
  - installation/build si necessaire ;
  - copie/sync vers le repertoire public ;
  - migrations si decide ;
  - redemarrage API ;
  - reload Nginx si necessaire ;
  - smoke test.
- GitHub Actions pourra arriver plus tard.

## 2026-06-19 - Git comme source de verite du deploiement

### Decision retenue

Toute modification de code, contenu public, documentation projet, assets versionnes, scripts de deploiement ou configuration exemple doit suivre le flux :

```text
local -> commit -> push GitHub -> git pull/reset sur VPS -> deploy.sh
```

Les modifications directes sur le VPS sont reservees a l'infrastructure serveur et aux secrets non versionnes.

### Autorise directement sur le VPS

- `.env` de production ;
- certificats Let's Encrypt ;
- configuration Nginx active ;
- services systemd ;
- configuration PostgreSQL ;
- sauvegardes/restaurations ;
- pare-feu et securite systeme ;
- comptes systeme et droits fichiers.

### Interdit directement sur le VPS

- pages HTML publiques ;
- JavaScript/CSS applicatifs ;
- backend `server/` ;
- partials ;
- assets versionnes ;
- documentation projet ;
- scripts `deploy/` versionnes ;
- changelog/versioning.

### Raison

- Eviter les divergences entre GitHub et le serveur.
- Garder un historique auditable.
- Permettre un redeploiement reproductible.
- Eviter de perdre des changements lors d'un `git reset --hard origin/main`.

### Consequence

Si une correction urgente est faite sur le VPS pour restaurer le service, elle doit etre immediatement reproduite localement, commitee, pushee, puis redeployee depuis Git.

## 2026-06-18 - Securite obligatoire avant production

### Decision retenue

La mise en production ne doit pas se limiter a copier le site sur le VPS. Elle est conditionnee par un socle de securite minimal.

### Exigences serveur

- SSH par cle uniquement.
- Mot de passe SSH desactive.
- Firewall actif.
- Seuls les ports necessaires exposes.
- Mises a jour systeme appliquees.
- Utilisateur applicatif dedie.
- PostgreSQL non expose publiquement.

### Exigences Nginx/HTTPS

- HTTPS via Let's Encrypt.
- Redirection HTTP vers HTTPS.
- Headers de securite.
- Blocage des dossiers non publics.
- Aucun document prive sous webroot.

### Exigences API

- Validation stricte des entrees.
- Limitation de taille des requetes.
- Rate limit sur endpoints publics.
- CORS limite au domaine ALTOS.
- Secrets dans `.env`, jamais dans Git.
- Erreurs sans fuite de details internes.

### Exigences back-office

- Authentification obligatoire.
- Mots de passe hashes avec Argon2 ou bcrypt.
- Authentification par mot de passe au depart.
- 2FA envisagee plus tard.
- Cookies/sessions securises.
- Limitation des tentatives de connexion.
- Journalisation des actions sensibles.

### Exigences documents/PDF

- PDF prives stockes hors webroot.
- Telechargement via API uniquement.
- Controle des droits avant acces.
- Chemins serveur jamais exposes au navigateur.
- Hash de fichier conserve en base.

### Exigences RGPD

- Consentement explicite et horodate.
- Duree de conservation definie.
- Possibilite de suppression/anonymisation.
- Minimisation des donnees.
- Logs sans donnees personnelles inutiles.

### Conclusion

L'architecture peut etre securisee, mais uniquement si ces exigences sont traitees comme des taches de production, pas comme des options.

## 2026-06-18 - Services externes acceptes mais non structurants

### Decision retenue

Certains services externes peuvent rester, mais ils ne doivent pas devenir la source de verite des donnees ALTOS.

### Acceptes

- Cal.com pour la prise de rendez-vous.
- SMTP pour l'envoi d'emails.
- Eventuellement Google Fonts ou polices auto-hebergees.
- Eventuellement CDN temporaire pour `jsPDF`, puis version locale si besoin.

### Refuses comme coeur applicatif

- n8n pour collecter les leads.
- Airtable comme base principale.
- Google Sheets comme stockage principal.
- Supabase SaaS comme base principale.

## 2026-06-18 - Migration contenu plus tard

### Decision retenue

Ne pas introduire immediatement un generateur statique. Le contenu peut etre industrialise plus tard.

### Options futures

- Eleventy pour un site editorial simple.
- Astro pour des composants plus riches.

### Raison

La priorite actuelle est l'infrastructure applicative : API, base, PDF, sauvegardes, securite.

## 2026-06-18 - Back-office editorial en second temps

### Decision retenue

Le back-office editorial sera realise dans un second temps, apres le socle applicatif, le back-office commercial et le premier deploiement VPS valide.

Les articles et cas d'usage seront geres en base PostgreSQL avec une interface WYSIWYG.

### Impact sur la stack

Cette decision ne change pas la stack retenue :

```text
TypeScript
Node.js LTS
Fastify
PostgreSQL local
Nginx
VPS OVH
Fichiers hors webroot si prives
```

### Impact sur la securite

Cette decision ne compromet pas le plan de securite.

Le back-office editorial reutilisera les memes principes :

- authentification admin ;
- roles ;
- routes API protegees ;
- validation stricte ;
- journalisation des actions sensibles ;
- controle des medias publics/prives ;
- sauvegardes PostgreSQL + fichiers.

### Roles a prevoir

- `admin` : acces complet.
- `commercial` : leads, micro-audits, PDF commerciaux.
- `editor` : articles, cas d'usage, medias publics, SEO editorial.

### Consequences

- Le schema initial doit rester extensible.
- Les tables editoriales peuvent attendre.
- Les contenus publics peuvent rester statiques tant que le back-office editorial n'est pas necessaire.
- Quand le back-office editorial arrivera, les articles et cas d'usage migreront en base.
- Un editeur WYSIWYG sera prevu pour les contenus editoriaux.
- Les routes editoriales devront etre separees des routes commerciales.

### Conclusion

Le back-office editorial est une evolution naturelle de la meme architecture, pas une refonte.

## 2026-06-19 - Phase 5 apres premier deploiement VPS

### Decision retenue

Ne pas demarrer la Phase 5 editoriale avant d'avoir realise et valide le premier deploiement VPS complet.

### Raison

- Valider d'abord le socle reel OVH : site public, API, admin, PostgreSQL, PDF prives, HTTPS et sauvegardes.
- Eviter d'ajouter une brique editoriale avant d'avoir prouve que l'infrastructure cible fonctionne.
- Reduire le risque de melanger les problemes de deploiement avec les futurs sujets WYSIWYG, publication et medias.

### Consequences

- La Phase 4 est terminee localement.
- La prochaine phase operationnelle est le deploiement VPS.
- La Phase 5 sera ouverte seulement apres validation du VPS.
