# Backlog ALTOS

Analyse initiale realisee sans modification du code applicatif.

## Documents associes

- [Stack technique](docs/STACK_TECHNIQUE.md)
- [Decisions techniques](docs/DECISIONS_TECHNIQUES.md)
- [Versioning](docs/VERSIONING.md)
- [Changelog](CHANGELOG.md)
- [Modele de donnees](docs/MODELE_DONNEES.md)
- [Structure cible du contenu public](docs/STRUCTURE_CONTENU_PUBLIC.md)
- [Roadmap produit](docs/ROADMAP_PRODUIT.md)
- [Audit securite du depot](docs/AUDIT_SECURITE_DEPOT.md)
- [Phase 0 - Cadrage et securisation](docs/PHASE_0_SECURISATION.md)
- [Phase 1 - Socle applicatif VPS](docs/PHASE_1_SOCLE_APPLICATIF.md)
- [Phase 2 - Micro-audit commercial](docs/PHASE_2_MICRO_AUDIT.md)
- [Phase 3 - Back-office commercial](docs/PHASE_3_BACK_OFFICE_COMMERCIAL.md)
- [Phase 4 - Industrialisation du site public](docs/PHASE_4_SITE_PUBLIC.md)
- [Recette Phase 1](docs/RECETTE_PHASE_1.md)
- [Deploiement VPS](docs/DEPLOIEMENT_VPS.md)

## Decision d'architecture retenue

- Le projet cible une architecture autonome sur VPS OVH.
- Le backend cible sera en TypeScript sur Node.js LTS, avec Fastify.
- PHP n'est pas retenu pour le socle applicatif.
- Les donnees applicatives seront stockees dans PostgreSQL sur le VPS.
- Les PDF et documents seront stockes comme fichiers hors webroot, avec metadonnees en base.
- Les PDF du micro-audit seront generes cote serveur.
- Le micro-audit devra envoyer ses donnees a une API interne, pas a un outil tiers.
- n8n, Airtable, Google Sheets et Supabase SaaS ne sont pas retenus comme socle applicatif.
- Le back-office commercial initial sera une interface HTML/admin sobre, dynamique et rendue cote serveur.
- L'authentification admin se fera par mot de passe, avec 2FA possible plus tard.
- Le premier deploiement utilisera un script manuel `deploy.sh`.
- Le back-office editorial sera realise apres le premier deploiement VPS valide, avec articles/cas d'usage en base et editeur WYSIWYG, sans changement de stack ni de plan de securite.

## Etat du projet

- Projet principal : `Site-ALTOS`
- Type : site statique HTML/CSS/JavaScript
- Backend : aucun backend identifie
- Base de donnees : aucune base de donnees identifiee
- Build tooling : aucun `package.json`, pas de bundler detecte
- Backend initialise ensuite dans `server/` : Fastify + TypeScript + migration PostgreSQL initiale.
- Phase 1 terminee cote code/preparation locale : API, PostgreSQL Docker, migrations, smoke test, scripts VPS et recette documentee.
- Phase 2 en cours : micro-audit branche a l'API, stockage PostgreSQL et PDF serveur localement fonctionnels.
- Premier deploiement VPS realise le 2026-06-19 : site public, API, PostgreSQL, Nginx, systemd, UFW et HTTPS actifs sur `https://www.altos-experts.fr/`.
- Versionnement : depot Git present dans `Site-ALTOS`
- Phase 3 avancee : back-office commercial HTML/admin local fonctionnel avec auth, liste leads, recherche, filtres, pagination, export CSV, fiche lead, reponses detaillees, notes, statut et PDF admin.
- Phase 4 terminee localement : site public statique industrialise, composants communs factorises, scripts publics extraits, page journal creee, structure cible des contenus documentee.
- Versioning ajoute : `CHANGELOG.md`, `docs/VERSIONING.md` et affichage des versions site/admin dans la zone admin.
- Branche : `main`, synchronisee avec `origin/main`
- Remote : `https://github.com/gigogneclarte9/Site-ALTOS.git`
- Historique visible : 2 commits (`initial commit`, `test write`)
- Etat au moment de l'analyse : propre avant creation de ce fichier

## Fonctionnalites principales existantes

### Site vitrine ALTOS

- Page d'accueil orientee acquisition B2B.
- Positionnement : groupement d'experts metiers, automatisation, IA, vibe coding, sites internet, SEO local.
- Sections principales :
  - hero avec CTA diagnostic 30 minutes et micro-audit 3 minutes ;
  - argumentaire "Pourquoi" ;
  - section Ambassadeur IA ;
  - presentation du fondateur ;
  - services ;
  - methode de travail ;
  - realisations ;
  - temoignages anonymises ;
  - journal ;
  - CTA final.

### Prise de rendez-vous

- Integration Cal.com en popup.
- Lien principal : `https://cal.com/nicolas-darcos-uldxct/30min`.
- Presente sur l'accueil, les pages de cas d'usage, les pages legales et le micro-audit.

### Contact simple

- Contact par email via `mailto:hello@altos-experts.fr`.
- Pas de formulaire serveur.
- Pas de stockage centralise des demandes.

### Micro-audit IA 3 minutes

- Page dediee `micro-audit.html`.
- Questionnaire de 10 questions avec progression.
- Collecte locale des coordonnees : prenom, nom, email, telephone.
- Calcul local d'un score d'opportunite sur 30.
- Cartographie des frictions par axes : admin, donnees, commercial, documents, maturite IA, pression dirigeant.
- Generation de 3 quick wins recommandes.
- Estimation locale de gain hebdomadaire et de ROI indicatif.
- Soumission branchee sur `POST /api/micro-audits` en local.
- Stockage local PostgreSQL des leads, reponses, scores et recommandations.
- Generation d'un PDF cote serveur et telechargement via API quand la soumission est enregistree.
- L'ancien PDF navigateur via `jsPDF` reste seulement en secours technique.

### Cas d'usage et references

- Page `cas-usage.html` listant 20 cas :
  - 10 missions livrees ;
  - 10 audits flash 2025/2026.
- Filtrage front par secteur :
  - services ;
  - distribution ;
  - conseil et technique ;
  - immobilier.
- Filtrage front par type :
  - missions livrees ;
  - audits flash.
- Fiches detaillees HTML pour les 10 audits flash.
- Cas anciens ou sources en Markdown dans `cas-usage/*.md`.

### Journal editorial

- 3 articles HTML publies dans `journal/`.
- Articles relies depuis l'accueil et le sitemap :
  - `120-audits-ia-quick-wins-pme.html`
  - `6-audits-6-secteurs-meme-verdict.html`
  - `pharmacie-officine-ia-audience-oubliee.html`

### SEO et partage social

- Balises title, meta description, Open Graph et Twitter Cards sur les pages principales.
- Canonicals vers `https://www.altos-experts.fr/`.
- Sitemap XML present.
- Robots.txt present.
- Schema JSON-LD sur au moins l'accueil et la page cas d'usage.

### Pages legales

- `mentions-legales.html`
- `confidentialite.html`
- Meta `noindex` cote page et exclusion via `robots.txt`.
- Mentions RGPD et sous-traitants.

### Assets et documents

- Images et PDF publics dans `assets/`.
- Nombreux documents sources dans `uploads/`, `work/`, `audits-raw/`, `audits-extracted/`.
- Ces dossiers sont actuellement suivis par Git pour une partie significative des fichiers.

## Points d'attention identifies

- Le site est statique : facile a heberger sur VPS, mais les leads du micro-audit ne remontent nulle part.
- `assets/audit-bot.js` semble etre un prototype Claude Artifact utilisant `window.claude.complete`; il ne fonctionnera pas tel quel sur un site public classique.
- Pas de `.gitignore` detecte.
- Les dossiers `uploads/`, `work/`, `audits-raw/` contiennent des documents potentiellement sensibles et plusieurs sont suivis dans Git.
- Un `.gitignore` a ete ajoute apres l'analyse.
- Les dossiers prives `uploads/`, `work/`, `audits-raw/`, `audits-extracted/` et `screenshots/` ont ete desindexes avec `git rm --cached`.
- Les fichiers restent presents localement, mais ne sont plus suivis par Git.
- Voir le detail dans [l'audit securite du depot](docs/AUDIT_SECURITE_DEPOT.md).
- Une liste blanche de deploiement public a ete creee dans `deploy/public-allowlist.txt`.
- Un exemple de configuration Nginx cible a ete cree dans `deploy/nginx-altos.conf.example`.
- `robots.txt` bloque `uploads/`, mais cela n'empeche pas l'acces direct aux fichiers si l'URL est connue.
- Pas de pipeline de deploiement identifie.
- Pas de verification automatique des liens, du SEO ou de l'accessibilite.
- Beaucoup de CSS et JS inline : rapide pour un prototype, moins confortable pour maintenir le site.

## Backlog priorise

### P0 - Securiser avant mise en ligne VPS

- Auditer les fichiers suivis par Git et supprimer du depot les documents non publics ou sensibles.
- Desindexer les dossiers prives deja suivis par Git : `uploads/`, `work/`, `audits-raw/`, `audits-extracted/`. Fait.
- Sortir aussi `screenshots/` du suivi Git comme artefact de conception non necessaire a la production. Fait.
- Creer une politique claire pour `uploads/`, `work/`, `audits-raw/`, `audits-extracted/`.
- Maintenir le `.gitignore` pour les fichiers sources non destines a la production.
- Decider si les documents publics doivent rester dans `assets/` uniquement.
- Verifier les pages exposees par le serveur et interdire l'indexation/acces des dossiers de travail cote Nginx, pas seulement via `robots.txt`.
- Utiliser la liste blanche `deploy/public-allowlist.txt` comme base du futur deploiement.
- Utiliser `deploy/nginx-altos.conf.example` comme base de configuration VPS.
- Activer SSH par cle uniquement et desactiver l'authentification par mot de passe.
- Activer un firewall VPS avec uniquement les ports necessaires.
- Prevoir un utilisateur applicatif dedie.
- Verifier que PostgreSQL n'est pas expose publiquement.
- Prevoir les secrets dans `.env` hors Git.

### P0 - Rendre le micro-audit exploitable commercialement

- Remplacer le stockage `localStorage` par une collecte via API interne. Fait cote front/API locale.
- Stocker les leads, reponses, scores et recommandations dans PostgreSQL sur le VPS. Fait et teste localement via PostgreSQL Docker.
- Stocker les PDF generes hors webroot et enregistrer leurs metadonnees en base. Fait localement.
- Ajouter consentement explicite et preuve de consentement horodatee.
- Rendre email et telephone obligatoires avant acces au resultat. Fait cote formulaire et API.
- Envoyer le payload complet du micro-audit depuis le formulaire public vers `POST /api/micro-audits`. Fait.
- Ajouter notification interne quand un micro-audit est complete. Code pret, activation SMTP a faire sur VPS.
- Generer les PDF cote serveur. Fait localement avec `jsPDF`.
- Rendre le PDF serveur identique au PDF navigateur initial sur le design et le contenu. Fait via port serveur de l'ancien generateur `jsPDF`.

### P0 - Mettre en place le socle applicatif VPS

- Installer PostgreSQL sur le VPS. En local, une base de developpement Docker est en place dans `server/docker-compose.yml`.
- Ajouter un template d'initialisation PostgreSQL VPS. Fait dans `deploy/postgres-init.sql.example`.
- Creer le schema initial : leads, micro_audits, documents, lead_events. Premiere migration creee dans `server/migrations/001_initial.sql` et testee sur PostgreSQL Docker local.
- S'appuyer sur le [modele de donnees](docs/MODELE_DONNEES.md) pour definir les migrations initiales.
- Creer une API backend interne sous `/api` en TypeScript + Node.js LTS + Fastify. Socle initialise dans `server/`.
- Ajouter un endpoint `POST /api/micro-audits`. Premiere route creee, avec validation et persistance PostgreSQL quand `DATABASE_URL` est configure.
- Ajouter un smoke test API/PostgreSQL reproductible. Fait via `server/src/test/smoke.ts` et `npm run test:smoke`.
- Ajouter validation stricte des payloads API. Premier schema JSON ajoute sur `POST /api/micro-audits`.
- Ajouter rate limit sur les endpoints publics. Plugin ajoute au socle Fastify.
- Limiter CORS au domaine ALTOS. Configuration par variable `CORS_ORIGIN`.
- Configurer un repertoire prive pour les PDF : hors webroot.
- Servir les PDF prives uniquement via API apres controle d'acces.
- Ajouter variables d'environnement serveur hors Git.
- Prevoir systemd ou PM2 pour faire tourner l'API.
- Ajouter un bootstrap VPS et un service systemd modele. Fait dans `deploy/bootstrap-vps.sh` et `deploy/altos-api.service.example`.
- Ajouter une brique de generation PDF serveur. Fait localement.

### P1 - Preparer le deploiement OVH/VPS

- Documenter l'arborescence de production.
- Definir une configuration Nginx servant le statique et proxyfiant `/api`.
- Ajouter HTTPS via Let's Encrypt.
- Ajouter redirections HTTP vers HTTPS et domaine canonique.
- Ajouter headers de securite Nginx.
- Ajouter cache headers pour assets, images, PDF et HTML.
- Mettre en place un script manuel `deploy.sh` pour le premier deploiement.
- Ajouter scripts manuels de migration, sauvegarde et restauration PostgreSQL. Fait dans `deploy/`.
- Ajouter une page 404 propre.
- Ajouter une procedure de sauvegarde PostgreSQL + fichiers.
- Tester une restauration de sauvegarde.

### P1 - Fiabiliser le parcours acquisition

- Harmoniser tous les CTA Cal.com.
- Verifier les liens internes et externes.
- Remplacer les liens `href="#"` restants par de vraies destinations. Fait sur les pages publiques prioritaires ; seuls des placeholders d'archives/prototypes restent hors allowlist.
- Clarifier le parcours : accueil -> micro-audit -> RDV -> contact.
- Ajouter un suivi d'evenements respectueux RGPD pour CTA, micro-audit et telechargement PDF.

### P1 - Gouvernance contenu et SEO

- Mettre a jour le sitemap pour inclure les 10 fiches audit detaillees si elles doivent etre indexees.
- Verifier les canonical URLs apres choix final du domaine.
- Ajouter donnees structurees Article sur les articles et fiches cas.
- Normaliser les dates de publication et modification.
- Prevoir une methode simple pour ajouter un cas ou un article sans dupliquer trop de HTML.

### P2 - Maintenabilite frontend

- Harmoniser la navigation principale sur les pages publiques prioritaires. Fait pour la premiere passe Phase 4.
- Uniformiser le footer public en conservant les notes methodologiques ou d'anonymisation juste au-dessus. Fait pour la premiere passe Phase 4.
- Factoriser le menu et le footer via partials + script de synchronisation statique. Fait dans `partials/` et `tools/sync-shared-components.mjs`.
- Documenter la commande `node tools/sync-shared-components.mjs --check` pour verifier que les pages restent synchronisees. Fait dans `docs/PHASE_4_SITE_PUBLIC.md`.
- Extraire le script Cal.com commun dans `assets/calcom.js` et supprimer les embeds inline dupliques. Fait.
- Nettoyer les anciennes regles CSS de footer devenues inutiles apres factorisation. Fait sur les pages publiques prioritaires.
- Creer une page `journal.html` et faire pointer le menu/footer `Journal` vers cette page. Fait.
- Extraire les styles communs de navigation dans `assets/site-components.css` et supprimer les copies locales. Fait sur les pages publiques prioritaires.
- Extraire les styles communs de boutons et les animations `reveal` dans `assets/site-components.css`. Fait sur les pages publiques prioritaires.
- Extraire le script commun `IntersectionObserver` des animations `reveal` dans `assets/reveal.js`. Fait pour `index.html` et `cas-usage.html`.
- Extraire le script de filtres de `cas-usage.html` dans `assets/case-filters.js`. Fait.
- Documenter la structure cible des articles et cas d'usage pour le futur back-office editorial. Fait dans `docs/STRUCTURE_CONTENU_PUBLIC.md`.
- Valider la recette visuelle locale sur `http://127.0.0.1:8080/`. Fait par test utilisateur.
- Extraire le CSS commun dans `assets/site.css` ou une structure equivalente.
- Extraire les scripts communs restants si de nouvelles duplications apparaissent.
- Supprimer ou archiver les fichiers Claude/prototypes non utilises (`design-canvas.jsx`, `tweaks-panel.jsx`, archives HTML) si non necessaires en production.
- Factoriser la navigation et le footer via generation statique, includes serveur, ou petit build step.

### P2 - Qualite et accessibilite

- Tester responsive mobile/tablette/desktop.
- Verifier contraste, navigation clavier et focus visibles.
- Ajouter labels et roles ARIA la ou necessaire, notamment filtres et quiz.
- Tester le PDF genere sur plusieurs navigateurs.
- Ajouter tests de liens et audit Lighthouse en routine.

### P3 - Evolutions produit possibles

- Back-office interne pour consulter les micro-audits recus. Premiere version locale faite.
- Interface HTML/admin sobre, dynamique et rendue cote serveur, pour le back-office initial. Fait localement.
- Authentification admin securisee avec mots de passe hashes. Fait localement avec `scrypt`.
- 2FA admin possible dans un second temps.
- Journalisation des actions sensibles : consultation PDF, export, suppression/anonymisation. Consultation PDF admin, notes et statuts traces.
- Tableau de bord commercial : leads, scores, quick wins, statut de relance. Liste, fiche lead, recherche, filtres, pagination et export CSV faits localement.
- Detail d'un micro-audit dans l'admin : coordonnees, score, axes, quick wins, reponses detaillees, documents, notes et historique. Fait localement.
- Nettoyage des donnees locales de test via `npm run db:cleanup-test-data`. Script ajoute.
- Envoi automatique d'un email personnalise avec PDF.
- Back-office editorial apres premier deploiement VPS valide : articles et cas d'usage en base, WYSIWYG, brouillons, SEO, medias publics.
- Generation dynamique/publication des pages cas d'usage depuis les contenus en base.
- Recherche ou filtres avances sur les cas d'usage.

## Prochaine etape recommandee

Avant d'ouvrir la Phase 5 editoriale, realiser le premier deploiement VPS OVH et valider le socle en production : site public, API, PostgreSQL, admin, stockage PDF prive, HTTPS, sauvegardes et variables d'environnement.

La Phase 5 ne demarre qu'apres cette validation VPS.

Etat actuel : le premier deploiement applicatif est en place sur `https://www.altos-experts.fr/`. Le micro-audit production et l'acces admin sont valides. Les prochaines validations prioritaires sont le SMTP si souhaite, puis sauvegarde/restauration.
