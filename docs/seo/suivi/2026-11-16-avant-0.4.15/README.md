# Suivi SEO de la page Occitanie et de son maillage

Première version validée par l’utilisateur le 16 novembre 2026. Ce lot ajoute `consultant-ia-occitanie.html` et ses liens depuis l’accueil, Audit IA, Agents IA, Automatisation et le cas du Tarn. Le sitemap passe de 20 à 21 URL. Les méthodes nationales et les trois formats commerciaux sont conservés.

## Référence avant publication

Les neuf réponses HTTP enregistrées dans `production-avant/` précèdent la publication de la release 0.4.15. Le [manifeste](manifest.json) conserve leurs horaires UTC, statuts et empreintes SHA-256. Ancienne release : 0.4.14, site 0.4.13. La nouvelle URL répondait en **404**, ce qui décrit son état HTTP, pas une position Google ni une mesure d’impressions.

L’[export Search Console archivé](../2026-11-16-avant-0.4.13/README.md) couvre le 11 août au 10 novembre, soit 92 jours. Aucun nouvel export authentifié ni rang Google France précis n’est disponible à cette publication. Les données manquantes des 11–15 novembre seront récupérables rétrospectivement. Ne pas les remplacer par des zéros.

## Périmètre à comparer

- Nouvelle page : URL exacte `https://www.altos-experts.fr/consultant-ia-occitanie.html`, exploration et indexation, impressions, clics, CTR et position moyenne après apparition dans Search Console.
- Recherches régionales proposées : « consultant IA Occitanie », « consultant IA Aude », « accompagnement IA TPE PME Occitanie ». Leur volume et leur classement ne sont pas présumés.
- Ensemble du site sur ces recherches : comparer la visibilité avant/après, et identifier les URL affichées. Cela permet de distinguer un gain global d’un déplacement entre l’accueil, les offres et la nouvelle page.
- Pages déjà suivies : conserver le suivi individuel des trois offres et noter les nouveaux liens internes. Même propriété, type Web, pays et appareils identiques ; conserver les totaux et distinguer marque/hors marque.

La nouvelle URL n’a pas de période antérieure comparable en tant que page publiée. Une position moyenne absente n’est pas un rang zéro. Les premiers résultats constituent son point de départ ; l’avant/après régional porte aussi sur l’ensemble du site et les pages existantes.

## Calendrier après consolidation

| Échéance | Lecture prévue | Périodes complètes |
| --- | --- | --- |
| 23 novembre, J+7 | Première lecture indicative : indexation, impressions et recherches apparues | Attendre sept jours complets disponibles ; aucune journée partielle |
| 30 novembre, J+14 | Première comparaison à durée égale, une fois les données complètes | Avant : 2–15 novembre ; après : 17–30 novembre |
| 14 décembre, J+28 | Comparaison principale, une fois les données complètes | Avant : 19 octobre–15 novembre ; après : 17 novembre–14 décembre |

Exclure le 16 novembre, jour des changements. Les échéances sont des dates de fin de période : consulter/exporter plus tard si Search Console n’a pas encore consolidé ces journées. Conserver les futurs exports et rapports dans des dossiers datés distincts, sans écraser les références avant publication. Aucun rappel automatique n’est programmé.

Les offres 0.4.13 et le maillage régional 0.4.15 sont publiés le même jour. Les données quotidiennes ne permettent pas d’attribuer séparément un effet à chacun de ces lots. Le correctif de dépendance 0.4.14 n’avait modifié aucun fichier public. Consigner également les publications suivantes, la saisonnalité et les changements d’indexation ; le faible trafic rend les variations de CTR instables.

## Publication et contrôles

Le résultat du déploiement et son horodatage exact seront ajoutés après vérification. La demande d’indexation Search Console reste à effectuer depuis un accès authentifié ; sa réalisation ne doit pas être déduite de la présence de l’URL dans le sitemap.
