# Changelog

Toutes les evolutions notables du site ALTOS sont suivies ici.

Format inspire de Keep a Changelog, avec version SemVer tant que le projet reste en pre-production.

## [0.4.1] - 2026-06-19

### Ajoute

- Documentation de l'etat reel du premier deploiement VPS OVH.
- Domaine canonique `https://www.altos-experts.fr/` documente et applique aux URLs SEO.
- Adresse email publique remplacee par `hello@altos-experts.fr`.
- Exemple SMTP prepare avec `hello@altos-experts.fr`, sans secret.
- Version site/release montee en `0.4.1`.

### Verifie

- Site public accessible sur `https://www.altos-experts.fr/`.
- Redirections `http://altos-experts.fr`, `http://www.altos-experts.fr` et `https://altos-experts.fr` vers `https://www.altos-experts.fr`.
- `/api/health` retourne une base PostgreSQL operationnelle et la version `0.4.1`.
- Page `/admin/login` accessible via Nginx.
- Premier compte admin de production cree et connexion validee.
- Micro-audit teste OK en production.
- Services `nginx`, `postgresql` et `altos-api` actifs.
- Pare-feu UFW actif avec `OpenSSH` et `Nginx Full`.
- Certificat Let's Encrypt valide jusqu'au 2026-09-17 avec renouvellement automatique.

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
