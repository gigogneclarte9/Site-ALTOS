# Roadmap produit ALTOS

Roadmap de reference pour transformer le site statique actuel en plateforme commerciale autonome sur VPS OVH.

## Vision

ALTOS doit rester un site public rapide et editorial, tout en ajoutant progressivement une couche applicative maitrisee :

- collecte des leads ;
- micro-audit exploitable commercialement ;
- PDF historises et proteges ;
- back-office commercial simple en HTML/admin dynamique rendu cote serveur ;
- puis back-office editorial en base avec editeur WYSIWYG dans un second temps.

La stack retenue ne change pas :

```text
Frontend public statique
API TypeScript + Node.js LTS + Fastify
PostgreSQL local
PDF/fichiers hors webroot
Nginx
VPS OVH
```

## Phase 0 - Cadrage et securisation

Objectif : rendre le depot et le futur deploiement propres avant toute mise en ligne.

Statut : en cours. Les premiers blocages depot sont traites dans `docs/PHASE_0_SECURISATION.md`.

Livrables :

- audit des fichiers suivis par Git ;
- audit securite du depot documente dans `docs/AUDIT_SECURITE_DEPOT.md` ;
- decision sur les dossiers `uploads/`, `work/`, `audits-raw/`, `audits-extracted/` ;
- `.gitignore` ;
- desindexation des dossiers prives deja suivis par Git, realisee aussi pour `screenshots/` ;
- separation public/prive ;
- configuration cible Nginx ;
- liste blanche de deploiement public ;
- checklist securite VPS ;
- strategie de sauvegarde.

Critere de sortie :

- aucun document prive ou sensible n'est expose publiquement ;
- la strategie VPS/API/PostgreSQL/PDF est documentee ;
- les risques de publication accidentelle sont reduits.

## Phase 1 - Socle applicatif VPS

Objectif : ajouter la couche serveur minimale.

Statut : termine cote code/preparation locale, detaille dans `docs/PHASE_1_SOCLE_APPLICATIF.md` et `docs/RECETTE_PHASE_1.md`.

Precision : le premier deploiement applicatif sur le VPS OVH a ete realise le 2026-06-19. Le site public, l'API, PostgreSQL, Nginx, systemd, UFW, le domaine canonique, HTTPS, l'acces admin et le test micro-audit production sont en place. Restent a finaliser avant production complete : SMTP si besoin et sauvegarde/restauration.

Livrables :

- API Fastify en TypeScript, socle cree ;
- PostgreSQL local ;
- migration initiale creee dans `server/migrations/001_initial.sql` ;
- commande de migration ajoutee dans `server/package.json` ;
- tables :
  - `leads` ;
  - `micro_audits` ;
  - `documents` ;
  - `lead_events`.
- variables d'environnement hors Git ;
- fichier `server/.env.example` cree ;
- service systemd ou PM2 ;
- exemple systemd cree dans `deploy/altos-api.service.example` ;
- bootstrap VPS cree dans `deploy/bootstrap-vps.sh` ;
- initialisation PostgreSQL VPS documentee dans `deploy/postgres-init.sql.example` ;
- Nginx proxy `/api` ;
- script manuel `deploy.sh` pour le premier deploiement ;
- sauvegardes PostgreSQL + fichiers.

Critere de sortie :

- l'API repond sur le VPS ;
- PostgreSQL est non expose publiquement ;
- un endpoint de test peut ecrire en base ;
- les sauvegardes sont configurees et testees.

Critere local deja valide :

- l'API repond localement ;
- PostgreSQL Docker est non expose hors machine ;
- un endpoint de test ecrit en base ;
- les scripts de sauvegarde/restauration sont prets et documentes.

## Phase 2 - Micro-audit commercial

Objectif : transformer le micro-audit actuel en vraie source de leads.

Statut : termine cote code et teste en production sur le VPS, hors configuration SMTP. Detail dans `docs/PHASE_2_MICRO_AUDIT.md`.

Livrables :

- remplacement du `localStorage` par `POST /api/micro-audits`, realise cote local ;
- validation serveur des donnees ;
- stockage lead + reponses + score en PostgreSQL, teste via Docker ;
- consentement explicite et horodate cote serveur ;
- generation PDF cote serveur, realisee localement avec `jsPDF` pour conserver le rendu historique ;
- metadonnees PDF en base, realise localement ;
- PDF stocke hors webroot, realise localement via `DOCUMENTS_PRIVATE_DIR` ;
- notification email interne, code pret et activation SMTP a faire sur VPS ;
- page de confirmation propre.

Critere de sortie :

- chaque micro-audit soumis est visible en base ;
- le PDF est rattache au lead ;
- ALTOS est notifie ;
- aucune donnee sensible n'est stockee uniquement dans le navigateur.

## Phase 3 - Back-office commercial

Objectif : permettre a ALTOS d'exploiter les leads sans outil tiers.

Statut : avancee. Version locale fonctionnelle pour l'exploitation commerciale de base, detaillee dans `docs/PHASE_3_BACK_OFFICE_COMMERCIAL.md`.

Livrables :

- interface admin HTML sobre, dynamique, rendue cote serveur, sans framework front lourd, premiere version faite ;
- authentification admin par email + mot de passe, premiere version faite ;
- mots de passe hashes, fait avec `scrypt` ;
- 2FA possible dans une phase ulterieure ;
- liste des leads, fait ;
- recherche par nom, email ou telephone, fait ;
- filtres par statut et source, fait ;
- pagination de la liste, fait ;
- detail d'un micro-audit, fait ;
- reponses detaillees du questionnaire, fait ;
- score, axes, quick wins, fait ;
- telechargement securise du PDF cote admin, fait ;
- statut commercial :
  - nouveau ;
  - a contacter ;
  - contacte ;
  - RDV pris ;
  - gagne ;
  - perdu.
- notes internes, fait ;
- journalisation des actions sensibles, commencee ;
- export CSV, fait.

Critere de sortie :

- un admin peut consulter et suivre un lead de bout en bout ;
- un admin peut retrouver un lead via recherche/filtres et exporter une selection CSV ;
- les PDF ne sont accessibles qu'apres authentification ;
- les actions sensibles sont tracees.

Precision :

- le back-office commercial n'est pas statique ;
- il lit/ecrit dans PostgreSQL via le backend ;
- il privilegie des pages serveur et formulaires classiques ;
- une SPA admin pourra etre envisagee plus tard seulement si le besoin utilisateur le justifie.

## Phase 4 - Industrialisation du contenu public

Objectif : rendre le site public plus maintenable avant le CMS editorial complet.

Statut : terminee localement. Navigation, footer public commun, boutons, animations `reveal` et Cal.com sont factorises sur le perimetre prioritaire. Les styles partages sont centralises dans `assets/site-components.css`, le script commun d'apparition progressive est dans `assets/reveal.js`, et les filtres de cas d'usage sont dans `assets/case-filters.js`. Une page `journal.html` liste maintenant les articles existants et supprime le placeholder du bouton `Tous les articles`. La structure cible des contenus publics est documentee dans `docs/STRUCTURE_CONTENU_PUBLIC.md`.

Livrables possibles :

- factorisation navigation/footer via partials, fait pour le perimetre public prioritaire ;
- extraction JS commun Cal.com, fait ;
- nettoyage des anciennes regles CSS de footer devenues inutiles, fait sur le perimetre public prioritaire ;
- page `journal.html` et lien `Journal` uniformise dans menu/footer, fait ;
- extraction CSS commune du menu, fait sur le perimetre public prioritaire ;
- extraction CSS commune des boutons et animations `reveal`, fait sur le perimetre public prioritaire ;
- extraction JS commune des animations `reveal`, fait pour `index.html` et `cas-usage.html` ;
- extraction JS des filtres de cas d'usage, fait dans `assets/case-filters.js` ;
- structure cible articles/cas d'usage documentee, fait ;
- recette visuelle locale utilisateur, faite sur `127.0.0.1:8080` ;
- extraction CSS/JS communs restants, reportee selon besoin ;
- nettoyage des archives et prototypes ;
- preparation des modeles articles/cas d'usage pour une future gestion en base, fait dans `docs/STRUCTURE_CONTENU_PUBLIC.md` ;
- sitemap genere automatiquement ;
- donnees structurees harmonisees.

Point d'attention :

- les footers contiennent parfois des notes methodologiques ou d'anonymisation specifiques ;
- ces informations doivent etre conservees juste au-dessus du footer commun.

Outils possibles :

- Eleventy si le besoin reste editorial simple ;
- Astro si besoin de composants plus riches.

Critere de sortie :

- ajouter un article ou un cas d'usage ne demande plus de dupliquer une page HTML complete ;
- le site public reste statique, rapide et facile a deployer.

## Phase 5 - Back-office editorial

Objectif : permettre la gestion du contenu depuis une interface admin.

Cette phase arrive apres le back-office commercial et apres le premier deploiement VPS valide. Elle ne remet pas en cause la stack technique ni le plan de securite.

Precondition de demarrage :

- site public servi depuis le VPS ;
- API Fastify operationnelle sur le VPS ;
- PostgreSQL en production et non expose publiquement ;
- back-office commercial accessible et protege ;
- PDF generes et stockes hors webroot ;
- HTTPS, Nginx, variables `.env` et sauvegardes valides.

Fonctionnalites cible :

- gestion des articles ;
- gestion des cas d'usage ;
- stockage des articles/cas en base PostgreSQL ;
- edition via WYSIWYG ;
- gestion des brouillons ;
- publication/depublication ;
- edition des metadonnees SEO ;
- gestion des images et documents publics ;
- workflow brouillon -> publie ;
- roles :
  - `admin` ;
  - `editor` ;
  - `commercial`.

Donnees qui pourront aller en base :

- articles ;
- cas d'usage ;
- contenu HTML/JSON issu du WYSIWYG ;
- categories ;
- tags ;
- auteurs ;
- revisions ;
- statut de publication ;
- medias publics ;
- metadonnees SEO.

Contraintes securite :

- memes exigences que le back-office commercial ;
- routes editoriales protegees ;
- journalisation des publications/modifications ;
- controle des medias publics ;
- distinction stricte entre documents publics et documents prives.

Critere de sortie :

- ALTOS peut publier/modifier un article ou un cas d'usage sans modifier le code ;
- le contenu publie reste controle, versionne et securise.

## Phase 6 - Optimisation et pilotage

Objectif : ameliorer le pilotage commercial et la qualite du site.

Livrables possibles :

- tableau de bord leads ;
- statistiques micro-audit ;
- taux de conversion ;
- suivi des CTA ;
- recherche dans les leads ;
- recherche dans les contenus ;
- monitoring applicatif ;
- tests de liens ;
- audits accessibilite/performance ;
- alertes en cas d'erreur API.

## Ordre recommande

1. Securiser le depot et le VPS.
2. Mettre en place API + PostgreSQL + stockage PDF.
3. Brancher le micro-audit a l'API.
4. Creer le back-office commercial.
5. Industrialiser le contenu public.
6. Finaliser le premier deploiement VPS : SMTP si besoin, sauvegardes et recette complete.
7. Creer le back-office editorial avec contenu en base et WYSIWYG.

## Ce que le back-office editorial ne change pas

Le back-office editorial en second temps ne change pas :

- le choix TypeScript + Node.js + Fastify ;
- le choix PostgreSQL ;
- le stockage fichiers hors webroot ;
- la strategie Nginx/HTTPS ;
- le plan de sauvegarde ;
- le modele de securite.

Il ajoute simplement :

- de nouvelles tables ;
- de nouvelles routes API ;
- de nouveaux roles ;
- une interface admin plus complete avec editeur WYSIWYG ;
- un workflow de publication.
