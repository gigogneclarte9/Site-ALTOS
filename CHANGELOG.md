# Changelog

Toutes les evolutions notables du site ALTOS sont suivies ici.

Format inspire de Keep a Changelog, avec version SemVer tant que le projet reste en pre-production.

## [Unreleased]

## [0.4.9] - 2026-08-06

### Ajoute

- Resume factuel sur les sept etudes de cas restantes, avec constat observe, solution proposee, gains projetes et liens vers les trois pages piliers.

### Change

- Titles, descriptions, H1 et apercus sociaux des dix etudes de cas desormais harmonises autour de leur secteur, du probleme metier et de la solution.
- Donnees structurees `Article` enrichies sur les sept cas avec dates, auteur, sujets, services cites et mots-cles.
- Gains estimatifs reformules comme projections a confirmer, notamment pour la qualite, le SAV, l'immobilier et les contrats d'entretien.
- Index des cas aligne sur les nouvelles intentions SEO et le statut projete des indicateurs.
- Dates `lastmod` des sept URL modifiees mises a jour, sans changement du nombre d'URL du sitemap.

### Verifie

- Sept pages avec un H1 unique, un resume factuel, trois liens vers les pages piliers et un schema `Article` valide.
- Titles de 51 a 59 caracteres et descriptions de 144 a 148 caracteres.
- Sitemap XML valide avec 20 URL uniques, toutes controlees en `200` local.
- Liens internes des huit pages modifiees controles sans cible absente.
- Deploiement production valide : version API `0.4.9`, sept nouveaux cas optimises et 20 URL du sitemap en `200`.

## [0.4.8] - 2026-08-06

### Ajoute

- Resume factuel en tete des cas froid commercial, agence evenementielle et quincaillerie rurale, avec constat observe, solution proposee et statut explicite des gains.
- Maillage direct de chaque resume vers les pages piliers Audit IA, Automatisation et Agents IA.

### Change

- Titles, descriptions, H1 et apercus sociaux des trois etudes de cas alignes sur le secteur, le probleme metier et la solution recherchee.
- Donnees structurees `Article` enrichies avec description, dates, auteur identifie, sujets, services cites et mots-cles.
- Cartes de l'index des cas reformulees et statuts des gains projetes rendus visibles.
- Dates `lastmod` des trois URL mises a jour dans le sitemap, sans ajout ni suppression d'URL.

### Verifie

- Trois pages en `200` local avec un H1 chacune, titles de 54 a 56 caracteres et descriptions de 148 a 156 caracteres.
- Schemas `Article` valides avec dates, trois services cites et cinq mots-cles par cas.
- Resumes factuels responsives, trois liens vers les pages piliers par cas et sitemap maintenu a 20 URL uniques.
- Deploiement production valide : trois cas optimises, index des cas, version API `0.4.8` et 20 URL du sitemap operationnels.

## [0.4.7] - 2026-08-06

### Ajoute

- Page pilier `agents-ia-pme.html` consacree aux usages, differences, donnees, controles et limites des agents IA pour TPE et PME.
- Six questions-reponses visibles et donnees structurees `Service`, `WebPage`, `BreadcrumbList`, `Organization`, `Person` et `FAQPage`.
- References institutionnelles CNIL, ANSSI et Commission europeenne pour renforcer la qualite documentaire et le GEO.

### Change

- Service `Agents IA` de l'accueil transforme en lien HTML vers la nouvelle page pilier.
- Liens contextuels ajoutes depuis les pages Audit IA, Automatisation et trois etudes de cas directement pertinentes.
- Navigation mobile, footer, sitemap et liste blanche de deploiement etendus a la nouvelle page.

### Verifie

- Page Agents IA en `200` local avec un H1, title de 55 caracteres, description de 155 caracteres et plus de 1 500 mots dans le contenu principal.
- Six FAQ visibles identiques aux donnees structurees, sans identifiant duplique.
- Navigation partagee coherente sur 23 pages et sitemap local de 20 URL uniques, toutes en `200`.
- Deploiement production valide : page Agents IA, maillage depuis l'accueil, version API `0.4.7` et 20 URL du sitemap operationnels.

## [0.4.6] - 2026-08-06

### Ajoute

- Page pilier `automatisation-processus-pme.html` consacree aux processus automatisables, a la difference entre workflow et agent IA, a la methode de deploiement et aux controles de fiabilite.
- Exemples relies aux audits SAV, commandes B2B et recherche documentaire, avec statut de projection explicite.
- Donnees structurees `Service`, `WebPage`, `BreadcrumbList`, `Organization`, `Person` et `FAQPage` alignees sur le contenu visible.

### Change

- Service `Automatisation` de l'accueil transforme en lien HTML vers la nouvelle page pilier.
- Liens contextuels ajoutes depuis la page Audit IA et trois etudes de cas directement pertinentes.
- Navigation mobile, footer, sitemap et liste blanche de deploiement etendus a la nouvelle page.

### Verifie

- Page Automatisation en `200` local avec un H1, title de 57 caracteres et description de 143 caracteres.
- Six FAQ visibles identiques aux donnees structurees, sans identifiant duplique ni ancre manquante.
- Navigation partagee coherente sur 22 pages et sitemap local de 19 URL uniques, toutes en `200`.
- Deploiement production valide : page Automatisation, maillage depuis l'accueil, version API `0.4.6` et 19 URL du sitemap operationnels.

## [0.4.5] - 2026-08-06

### Ajoute

- Page pilier `audit-ia-tpe-pme.html` consacree a la methode, aux livrables, a la priorisation et aux questions frequentes d'un audit IA.
- Exemples terrain relies aux etudes de cas, avec distinction explicite entre observations, resultats mesures et projections.
- Donnees structurees `Service`, `WebPage`, `BreadcrumbList`, `Organization`, `Person` et `FAQPage` coherentes avec le contenu visible.
- Menu mobile partage avec bouton hamburger, liens principaux, CTA et navigation clavier accessible.

### Change

- Service `Audit IA` de l'accueil transforme en lien HTML vers la page pilier.
- Maillage interne enrichi depuis l'index des cas d'usage et le footer partage.
- Sitemap et liste blanche de deploiement etendus a la nouvelle page et a sa feuille de style.

### Verifie

- Navigation mobile synchronisee sur les 21 pages publiques, script valide et ressources locales en `200`.
- Page Audit IA : un H1, title de 49 caracteres, description de 145 caracteres et six FAQ visibles identiques aux donnees structurees.
- Sitemap local : 18 URL uniques, toutes en `200`.
- TypeScript, build serveur et cinq cas de test du scoring valides.
- Deploiement production valide : page Audit IA, navigation mobile, version API et 18 URL du sitemap operationnelles.

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
- Deploiement production valide : accueil, H1, FAQ, version API, `robots.txt` et 17 URL du sitemap operationnels.

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
