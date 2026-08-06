# Changelog

Toutes les evolutions notables du site ALTOS sont suivies ici.

Format inspire de Keep a Changelog, avec version SemVer tant que le projet reste en pre-production.

## [Unreleased]

## [0.4.4] - 2026-08-06

### Change

- Page d'accueil recentree sur le champ semantique consultant IA, audit IA, automatisation, agents IA et applications metier pour TPE/PME.
- Title, description, Open Graph, Twitter Cards, H1, hero, services, methode et CTA alignes sur l'intention de recherche principale.
- Mention `TPE` du H1 harmonisee visuellement avec `PME`, sans texte barre.
- Entites `Organization`, `Person`, `WebPage` et `ProfessionalService` clarifiees dans les donnees structurees.
- Cartes du journal transformees en liens HTML explorables.
- Libelles de diagnostic harmonises en `Diagnostic IA` dans les composants partages.

### Ajoute

- Section de six questions-reponses factuelles pour le SEO, le GEO et les visiteurs.
- Autorisations explicites de `OAI-SearchBot` et `PerplexityBot` dans `robots.txt`.

### Verifie

- Title de 51 caracteres et meta description de 145 caracteres.
- Donnees JSON-LD valides et coherentes avec le contenu visible.
- Lighthouse local : SEO 100, performance 99, accessibilite 98.

## [0.4.3] - 2026-08-06

### Ajoute

- Audit SEO complet date du 2026-08-06 avec priorites, plan 90 jours et indicateurs de suivi.
- Page 404 publique, navigable et non indexable.
- Dix etudes de cas detaillees dans le sitemap XML.

### Change

- Liens partages vers l'accueil normalises sur l'URL canonique `/`.
- Pages legales laissees explorables dans `robots.txt` afin que leur balise `noindex` puisse etre lue.
- Configuration Nginx de reference preparee pour rediriger `/index.html` vers `/` et renvoyer de vraies erreurs 404.
- Dates `lastmod` du sitemap alignees sur les dernieres modifications versionnees.

### Verifie

- Les 17 URL du sitemap sont uniques et repondent localement en `200`.
- Une URL inexistante repond localement en `404`.
- Aucun lien vers `index.html` ne subsiste sur les pages publiques prioritaires.
- Les composants partages sont synchronises.

## [0.4.2] - 2026-06-19

### Ajoute

- Regle de deploiement documentee : code et contenus versionnes depuis Git uniquement.
- Specification du futur moteur de scoring/recommandations micro-audit, avec contrainte de ne pas changer le rendu visuel du site ni du PDF.
- README racine ajoute pour documenter le projet, la stack, les `.env`, le lancement local et le deploiement.
- Moteur serveur de scoring/recommandations micro-audit avec version dediee, seuils d'opportunite, cas faible friction et recommandations conditionnelles.
- Test de differenciation du scoring micro-audit couvrant faible friction, admin, data, commercial et maturite IA faible.

### Change

- L'API recalcule maintenant le score, les axes, le profil, le ROI et les recommandations a partir des reponses, au lieu de faire confiance au score envoye par le navigateur.
- Le resultat public conserve le meme rendu visuel, mais utilise le bilan recalcule par l'API apres soumission.
- Le navigateur n'envoie plus que les coordonnees, le consentement et les reponses ; `score`, `recommendations` et `roi` ne sont plus acceptes en entree API.

### Supprime

- Ancien moteur de scoring/recommandations cote navigateur.
- Ancien generateur PDF navigateur de secours et chargement CDN `jsPDF` sur `micro-audit.html`.

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
