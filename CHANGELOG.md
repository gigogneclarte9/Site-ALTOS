# Changelog

Toutes les evolutions notables du site ALTOS sont suivies ici.

Format inspire de Keep a Changelog, avec version SemVer tant que le projet reste en pre-production.

## [0.4.0] - 2026-06-19

### Ajoute

- Page `journal.html` listant les articles existants.
- Composants publics partages : menu, footer, notes de page.
- Scripts publics partages : Cal.com, reveal, filtres de cas d'usage.
- Document `docs/STRUCTURE_CONTENU_PUBLIC.md` pour preparer le futur back-office editorial.
- Affichage des versions site/admin dans la zone admin.
- Endpoint `/api/health` enrichi avec les informations de version.

### Change

- Phase 4 marquee terminee localement.
- Decision documentee : Phase 5 editoriale apres premier deploiement VPS valide.
- Navigation, footer, styles de boutons et animations factorises pour le perimetre public prioritaire.

### Verifie

- Recette visuelle locale utilisateur sur `http://127.0.0.1:8080/`.
- Controle HTTP local des ressources publiques.
- Synchronisation des partials menu/footer.

## [0.3.0] - 2026-06-18

### Ajoute

- Back-office commercial HTML/admin local.
- Authentification admin par email et mot de passe.
- Liste des leads, recherche, filtres, pagination, export CSV.
- Fiche lead avec reponses, score, axes, quick wins, notes et documents.
- Telechargement PDF protege cote admin.

## [0.2.0] - 2026-06-18

### Ajoute

- Micro-audit branche a l'API.
- Stockage PostgreSQL local des leads, reponses, scores et recommandations.
- Generation PDF cote serveur avec rendu aligne sur l'ancien PDF navigateur.
- Stockage des PDF hors webroot avec metadonnees en base.

## [0.1.0] - 2026-06-18

### Ajoute

- Socle backend TypeScript, Node.js LTS, Fastify.
- Migration PostgreSQL initiale.
- Healthcheck API.
- Scripts locaux Docker PostgreSQL, migrations et smoke test.
- Documentation initiale du socle VPS.
