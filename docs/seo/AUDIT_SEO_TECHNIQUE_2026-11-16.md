# Contrôle technique SEO ALTOS du 16 novembre 2026

## Complément après réception des URL exclues

Le 16 novembre, l’utilisateur a identifié trois pages de cas non indexées, deux pages légales en noindex et deux variantes d’accueil redirigées. Cette liste remplace l’attente d’une liste de « cinq URL » dans le diagnostic initial ci-dessous ; elle ne constitue pas un nouvel export exhaustif de Search Console. L’utilisateur a confirmé le motif **« Explorée, actuellement non indexée » pour les trois cas**. Google les a donc explorés, sans les retenir dans son index à la date du rapport communiqué. Ce statut n’établit pas à lui seul un défaut de contenu ou une pénalité.

Le [contrôle public horodaté](suivi/2026-11-16-indexation-cas/controle-public.json), effectué à 16:34 UTC après la release 0.4.15, donne :

| URL relative | Résultat public | Liens entrants depuis des pages distinctes du sitemap |
| --- | --- | ---: |
| `cas-usage/groupe-coiffure-multisite.html` | HTTP 200 direct, index autorisé, canonical vers elle-même, présente au sitemap | 4 |
| `cas-usage/cabinet-gestion-patrimoine.html` | HTTP 200 direct, index autorisé, canonical vers elle-même, présente au sitemap | 5 |
| `cas-usage/immobilier-3-poles.html` | HTTP 200 direct, index autorisé, canonical vers elle-même, présente au sitemap | 7 |

Sur ces trois URL, aucune directive noindex dans les meta robots/googlebot ou l’en-tête X-Robots-Tag ; robots.txt autorise Googlebot. Elles ne sont pas orphelines. Ce contrôle public ne mesure ni le dernier passage réel de Googlebot ni la canonical retenue par Google : aucun blocage technique n’est constaté, mais la cause de non-indexation n’est pas encore établie.

Les deux pages légales sont en HTTP 200 avec `noindex, follow`, hors sitemap, conformément au choix existant. Les accueils `https://altos-experts.fr/` et `http://altos-experts.fr/` répondent en 301 directement vers `https://www.altos-experts.fr/`. Ces quatre exclusions sont attendues et n’appellent aucune correction. [Interprétation des exclusions dans Search Console](https://support.google.com/webmasters/answer/7440203?hl=fr).

Prochaine étape : vérifier l’état actuel de chaque cas dans l’inspection d’URL, noter la dernière exploration et la canonical choisie par Google lorsqu’elle est disponible, puis lancer le test de l’URL active pour confirmer ce que Google peut récupérer aujourd’hui. Le rapport agrégé peut être en retard sur l’inspection individuelle. Si la page est toujours non indexée et le test valide, une demande ponctuelle d’indexation peut être faite ; elle n’est ni une correction ni une garantie, et ne doit pas être répétée sans changement utile. Consigner ensuite la date du contrôle et suivre le résultat à J+7/J+14. Aucune réécriture, modification de robots/sitemap ou demande d’indexation n’a été effectuée pour ces cas pendant ce contrôle. Si le statut persiste, examiner les différences utiles entre les cas et leurs preuves avant de décider d’une amélioration éditoriale ciblée.

## Diagnostic initial avant les publications du 16 novembre

Le contrôle du site publié ne révèle aucun obstacle technique majeur à l’indexation des 20 pages du sitemap. Les corrections d’août sont effectives : pages accessibles, adresses canoniques cohérentes, redirections permanentes et véritable réponse 404 pour une page inexistante. La suite prioritaire est le ciblage des recherches et le renforcement des pages offres, avec quelques améliorations ponctuelles à intégrer au prochain lot.

Le statut réel dans Google reste à compléter avec les cinq URL exclues et leurs motifs Search Console. Un accès HTTP 200 et une absence de blocage technique ne prouvent pas l’indexation ; un sitemap ne la garantit pas non plus. [Google sur les sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview).

## Périmètre et preuves

Contrôle par requêtes HTTP GET publiques, analyse du HTML reçu et comparaison avec le dépôt local au commit `5cc2c69`. Aucun formulaire soumis, aucune donnée commerciale créée, aucune modification applicative ou mise en production.

Périmètre : les 20 URL du sitemap, les pages HTML supplémentaires de la liste de déploiement, les destinations internes des liens HTML et ressources directement référencées, les fragments des liens, ainsi que les variantes de domaine et chemins détaillés ci-dessous. Les ressources chargées uniquement par exécution de JavaScript ou par CSS et les destinations externes ne font pas partie de cette vérification de liens.

Preuves conservées dans [le dossier du contrôle](../../../output/seo-technique-2026-11-16) : [résultats détaillés](../../../output/seo-technique-2026-11-16/resultats.json), [synthèse](../../../output/seo-technique-2026-11-16/synthese.json), HTML des 20 pages, robots.txt, sitemap.xml et script `controle.py`. Le script est un outil local d’audit, hors code applicatif et hors liste de déploiement.

Ce contrôle ne mesure pas les Core Web Vitals, le rendu JavaScript, les backlinks ou la pertinence face à la concurrence. Les 19 pages indexées et cinq exclues restent les chiffres communiqués par l’utilisateur le 13 novembre, sans nouvelle lecture du rapport d’indexation.

## Résultats

| Contrôle | Résultat au 16 novembre |
| --- | --- |
| Sitemap | XML lisible, 20 URL absolues uniques, toutes sur le domaine HTTPS avec www |
| Couverture | Les 20 pages correspondent aux pages HTML publiques de la liste de déploiement, hors pages légales et 404 |
| Accessibilité | 20 réponses HTTP 200 directes, aucune redirection sur ces URL |
| Robots | Exploration autorisée pour Googlebot sur les 20 URL ; sitemap déclaré dans robots.txt |
| Directives | Aucun noindex dans les meta robots/googlebot ni en-tête X-Robots-Tag sur les 20 URL |
| Canonical | Une balise par page, identique à son URL du sitemap |
| Titres et descriptions | Présents sur les 20 pages, sans doublon exact |
| Structure | Un H1 par page, langue française et viewport déclarés |
| Liens internes | Aucune destination cassée parmi les liens et ressources directement relevés ; aucun fragment manquant dans les pages contrôlées |
| Maillage | Chaque page reçoit des liens depuis au moins trois autres pages parmi les 22 pages HTML publiques examinées ; navigation et footer inclus |
| Données structurées | 19 blocs JSON-LD analysables sans erreur de syntaxe ; aucun bloc sur journal.html. Ce résultat ne valide pas l’éligibilité aux résultats enrichis |
| Image du sitemap | assets/og-default.png répond en 200, type image/png |
| Local et production | Contenus des 20 pages, sitemap et robots.txt identiques après normalisation des fins de ligne et du marqueur UTF-8 |

Les pages `mentions-legales.html` et `confidentialite.html` sont accessibles en 200, explorables et volontairement en `noindex, follow`, hors sitemap. `/404.html` répond en 404. Ces observations ne permettent pas d’identifier les cinq exclusions Search Console sans leurs URL.

## Redirections et erreurs HTTP

| URL ou variante testée | Résultat |
| --- | --- |
| Accueil HTTP, avec et sans www | 301 vers l’accueil HTTPS avec www, puis 200 |
| Accueil HTTPS sans www | 301 vers l’accueil HTTPS avec www, puis 200 |
| /index.html | 301 vers /, puis 200 |
| Page Audit IA sans www, en HTTP et HTTPS | 301 vers la même page HTTPS avec www, puis 200 |
| /index.html?utm_source=seo_check | 301 vers /, mais paramètre supprimé |
| /audit-ia-tpe-pme sans extension | 404 ; cette variante n’est pas liée depuis les pages contrôlées |
| /cas-usage/ et /journal/ | 403 ; les vraies pages /cas-usage.html et /journal.html répondent en 200 |
| /seo-verification-page-inexistante-20261116.html | 404, sans remplacement par l’accueil en 200 |

Les répertoires en 403 ne constituent pas un obstacle constaté aux pages utiles : ils ne sont ni dans le sitemap ni utilisés comme destinations des liens contrôlés. Des redirections de confort vers les index HTML ne deviennent prioritaires que si Search Console ou des liens entrants révèlent une utilisation de ces variantes. Même principe pour les URL sans extension.

## Priorités après contrôle

### 1 Compléter les exclusions Google dès réception

Pour chaque URL exclue : relever le motif, l’URL canonique choisie par Google si disponible et la présence dans le sitemap. Corriger les exclusions qui touchent une page utile et révèlent une anomalie. Les pages légales volontairement exclues et les variantes redirigées ne doivent pas être forcées dans le sitemap.

Cette information manque toujours, mais n’empêche pas le ciblage SEO. Ne pas attribuer les faibles positions à un blocage que le contrôle public n’a pas constaté.

### 2 Cibler les recherches et renforcer les pages offres

Exploiter l’export conservé pour choisir les intentions prioritaires et comparer les résultats concurrents. Commencer par Audit IA et Agents IA, puis Automatisation. L’export du 11 août au 10 novembre indiquait respectivement 720, 339 et 83 impressions pour ces pages, avec des positions moyennes faibles ; ces données ne sont pas actualisées au 16 novembre.

Clarifier au passage le format d’audit flash : la page Audit IA indique cinq jours, la note du micro-audit une journée. La contradiction reste présente dans le HTML publié. Confirmer les offres avant de modifier les durées ; ce point éditorial n’empêche pas l’exploration.

### 3 Intégrer les corrections ponctuelles au prochain lot

**Date du micro-audit dans le sitemap.** `micro-audit.html` porte encore `lastmod = 2026-06-19`, alors que de nouveaux liens vers les offres ont été ajoutés le 6 août, notamment dans les commits `cfcda3a`, `c693198` et `5c7c6ff`. Réaligner la date sur l’historique pertinent ou sur une nouvelle modification significative lors du prochain lot. Il s’agit d’un signal à fiabiliser, pas d’un blocage. Ne pas remplacer toutes les dates par la date du jour : Google attend la dernière modification significative et ignore `priority` et `changefreq`. [Documentation Google sur lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

**Métadonnées à resserrer.** Les longueurs suivantes servent à repérer les textes à relire, sans constituer des limites techniques. Google peut tronquer ou reformuler l’affichage selon la recherche et l’appareil. [Titres dans Google](https://developers.google.com/search/docs/appearance/title-link), [descriptions dans Google](https://developers.google.com/search/docs/appearance/snippet).

| Page | Caractères du titre | Caractères de la description | Action |
| --- | ---: | ---: | --- |
| cas-usage.html | 68 | 268 | Description plus concise, distinguant missions réalisées et audits projetés |
| journal/120-audits-ia-quick-wins-pme.html | 83 | 183 | Raccourcir le titre et recentrer la description sur l’intérêt du contenu |
| journal/6-audits-6-secteurs-meme-verdict.html | 58 | 179 | Resserrement de la description lors du travail éditorial |
| journal/pharmacie-officine-ia-audience-oubliee.html | 60 | 171 | Resserrement de la description lors du travail éditorial |

### 4 Conserver les observations pour les lots appropriés

- La redirection de `/index.html` supprime les paramètres de campagne : préserver les paramètres utiles lors du travail de mesure. La redirection canonique fonctionne ; aucun effet sur les positions n’est démontré.
- L’index du Journal n’a pas de JSON-LD. Un balisage adapté peut compléter le chantier éditorial, sans être un prérequis à l’indexation.
- Les travaux Occitanie, contenus métiers, références externes puis conversion du micro-audit restent dans l’ordre confirmé le 16 novembre.

## État de la première étape

**Contrôle technique public terminé. Diagnostic d’indexation Google partiel, en attente des cinq URL et de leurs motifs. Aucune correction du site appliquée.** La prochaine étape autonome est la sélection des recherches prioritaires et la comparaison des pages offres aux résultats concurrents. Aucune refonte du sitemap n’est justifiée par ce contrôle.
