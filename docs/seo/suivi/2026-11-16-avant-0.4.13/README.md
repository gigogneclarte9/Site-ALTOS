# Référence avant les modifications SEO — release 0.4.13

Référence constituée le 16 novembre 2026 **avant le déploiement**, sur le site public encore en `0.4.12`, commit `5cc2c6912863e359a0fff905c528bbf16d92d011`. Les instants exacts UTC et empreintes figurent dans [le manifeste](manifest.json). Fuseau de restitution : Europe/Paris.

La mise en production et son résultat seront datés séparément dans [DEPLOIEMENT.md](DEPLOIEMENT.md). Les instantanés ci-dessous restent immuables.

## Sources conservées

- [Export Search Console fourni le 13 novembre](search-console-export-2026-11-13.zip), période réelle du 11 août au 10 novembre 2026, soit 92 jours.
- [Tableaux extraits](search-console-donnees.json) et [fenêtres de 7, 28 et 92 jours](search-console-fenetres.json). Le ZIP original et son empreinte SHA-256 sont conservés.
- `production-avant/` : HTML des trois offres, cas d’usage et micro-audit ; styles partagés, image sociale, robots, sitemap et health avant déploiement.
- `recherche-1.json` à `recherche-6.json` : requêtes et URL retournées par l’outil de recherche web, horodatées avant publication. Ces fichiers ne donnent pas de rang Google.

## Référence Search Console disponible

| Périmètre | Période | Impressions | Clics | CTR |
| --- | --- | ---: | ---: | ---: |
| Propriété entière, 92 jours | 11 août–10 novembre | 1 455 | 18 | 1,24 % |
| Propriété entière, 28 jours | 14 octobre–10 novembre | 388 | 3 | 0,77 % |
| Propriété entière, 7 jours | 4–10 novembre | 95 | 0 | 0 % |

| Page, sur les 92 jours de l’export | Impressions | Clics | CTR exporté | Position moyenne exportée |
| --- | ---: | ---: | ---: | ---: |
| Audit IA | 720 | 2 | 0,28 % | 77,08 |
| Agents IA | 339 | 1 | 0,29 % | 45,14 |
| Automatisation | 83 | 0 | 0 % | 61,89 |

Les fenêtres courtes proviennent du tableau quotidien de la propriété entière. **Nous n’avons pas de tableaux par page ou par recherche filtrés sur ces fenêtres** : ne pas comparer les 92 jours par page avec 7 ou 28 jours après publication. Les positions recomposées dans le JSON sont des approximations pondérées à partir des moyennes quotidiennes arrondies, pas des positions SERP ; le tableau ci-dessus utilise seulement les valeurs par page directement exportées.

L’export contient 79 recherches visibles, représentant 2 des 18 clics. Les tableaux « pages » et « requêtes » sont séparés : ils ne prouvent pas l’association entre une requête et une page. Aucun filtre France/appareil n’est supposé si le fichier ne l’indique pas.

## Recherches à suivre

| Page cible proposée | Recherches |
| --- | --- |
| Audit IA | audit ia pme ; diagnostic ia tpe ; diagnostic ia pme |
| Agents IA | agent ia pme ; agent ia pour pme ; pilotage des agents ia |
| Automatisation | automatisation processus pme ; automatisation tâches pme |

La comparaison web avant déploiement est un repérage, avec fournisseur, lieu et appareil non certifiés. Elle ne permet pas d’affirmer « rang 10 », « absent du top 100 » ou « non indexé ». Aucun classement Google France instantané vérifiable n’est disponible dans cette session. Le champ de rang est donc laissé à `null`, pas rempli avec un ordre de résultats non comparable.

## Mesure à refaire après publication

1. **J+7, le 23 novembre :** contrôle technique et première lecture indicative. Si les données complètes ne couvrent pas encore sept jours après publication, attendre leur disponibilité ; ne pas utiliser une journée partielle.
2. **J+14, le 30 novembre :** comparer les 14 jours complets avant publication (2–15 novembre) aux 14 jours après (17–30 novembre), une fois le rapport complet. Exclure le 16 novembre, journée de changement. Un nouvel export peut récupérer rétrospectivement la période avant publication.
3. **J+28, le 14 décembre :** comparaison principale des 28 jours avant (19 octobre–15 novembre) et après (17 novembre–14 décembre), à périmètre identique et après consolidation des données.

Dans Search Console : type **Web**, même propriété, mêmes pays/appareils et mêmes exclusions de marque ; filtrer séparément chaque URL exacte, puis les recherches prioritaires. Exporter impressions, clics, CTR, position moyenne et les séries quotidiennes. Conserver les paramètres et les fichiers bruts avec la date de collecte. Distinguer les recherches de marque des recherches génériques ; conserver aussi un total sans filtre comme contrôle.

Pour un relevé SERP dédié : fixer moteur Google, pays France, langue française, même localisation et même appareil, requête exacte et profondeur d’observation ; conserver l’URL classée, le rang organique, la date/heure et les éventuels blocs IA/annonces séparément. Le premier relevé certifié ainsi obtenu deviendra sa propre référence ; il ne devra pas être présenté rétrospectivement comme le rang du 16 novembre.

## Limites et interprétation

L’accès navigateur et une connexion Search Console actualisée n’étaient pas disponibles ; le dernier jour connu dans l’export reste le 10 novembre. Les 11–15 novembre manquent donc dans la référence actuelle et devront être complétés avec un nouvel export. Ce manque ne sera pas masqué par une extrapolation.

Quelques jours permettent surtout de contrôler l’exploration et de détecter une anomalie ; le faible nombre de clics rend les variations de CTR instables. Il n’y a pas de garantie de progression ni de délai de résultat. Les évolutions de demande, de concurrence, de saisonnalité et les futurs changements du site doivent être notés avant toute interprétation causale.

Les contacts qualifiés restent l’objectif commercial ; aucune nouvelle mesure d’audience ni du quiz n’est installée dans cette release. Les chiffres historiques des cas clients restent un sujet documentaire séparé.
