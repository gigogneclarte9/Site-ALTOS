# Suivi du maillage régional et des intitulés de liens

Lot 0.4.16 du 17 novembre 2026 : quatre liens contextualisés vers `consultant-ia-occitanie.html` depuis l’index des cas, la quincaillerie en Aveyron, le froid commercial dans l’Hérault et l’agence immobilière à Montpellier. Dix intitulés incomplets corrigés dans huit fiches de cas ; bouton du Journal renommé « Faire le micro-audit gratuit ». Onze pages HTML concernées au total.

## Référence avant publication

Le [manifeste](manifest.json) conserve treize réponses publiques capturées avant publication : les onze pages modifiées, le sitemap et le health exposant la version 0.4.15. Les fichiers bruts et leurs empreintes sont conservés dans `production-avant/` ; ne pas les remplacer lors d’un contrôle ultérieur.

La page Occitanie recevait des liens depuis cinq pages distinctes ; elle en reçoit neuf après publication. Les nouvelles ancres sont dans le contenu des pages, hors navigation et pied de page. Les autres destinations existantes sont conservées. Les quatre pages enrichies portent la date de modification du 17 novembre dans le sitemap et, lorsqu’il existe, le champ JSON-LD correspondant. Les corrections de seuls intitulés ne réactualisent pas automatiquement les dates des autres pages.

## Mesure et limites

Conserver le [protocole des offres](../2026-11-16-avant-0.4.13/README.md) et le [suivi Occitanie](../2026-11-16-avant-0.4.15/README.md). Noter ce lot comme changement supplémentaire le 17 novembre, au début de leur fenêtre après publication. Les effets de ces lots rapprochés ne pourront pas être isolés avec les seules données quotidiennes Search Console.

Suivre l’URL Occitanie, les requêtes régionales et la visibilité globale sur ces requêtes pour distinguer hausse globale et déplacement entre pages. Les comparaisons prévues des périodes terminant le 30 novembre et le 14 décembre restent conditionnées à la consolidation des données. Aucun nouvel export Search Console n’a été obtenu pour cette publication ; le dernier export archivé s’arrête au 10 novembre. Ne pas inventer une mesure au 17 novembre.

Les demandes d’indexation des trois cas (coiffure, patrimoine, immobilier) ont été effectuées par l’utilisateur le 16 novembre. Leur suivi reste prévu les 23 et 30 novembre ; une indexation ultérieure ne pourra pas être attribuée à la seule correction des liens. Aucun rappel automatique programmé.

## Vérifications et publication

Contrôles avant publication : build TypeScript et synchronisation des composants réussis ; onze pages contrôlées, exactement quatre liens ajoutés et dix intitulés de cartes corrigés, destinations et fragments internes valides, JSON-LD analysable et sitemap de 21 URL. Aucun changement de dépendance, migration, formulaire ou parcours de prise de rendez-vous. Le rendu navigateur n’a pas été vérifié pendant ce lot.

Sauvegarde protégée du VPS : `/var/lib/altos/backups-local/releases/20261117-before-0.4.16/`, API et public 0.4.15, dump de la base ALTOS et état préalable des services et fichiers Radar.

**Publication effectuée le 17 novembre 2026 à 10 h 09 min 50 s (Paris), soit 09:09:50 UTC**, commit applicatif `e2f7b02`, site/release 0.4.16, admin 0.3.0. [Rapport de vérification en production](verification-production-0.4.16.json) : 39 fichiers publics conformes au commit, health/base et versions valides, chemins privés inaccessibles. Aucun changement de dépendance ni migration en attente ; seul `altos-api` redémarré.

Radar : les 74 fichiers contrôlés hors dépendances et les processus Radar/Nginx/PostgreSQL sont inchangés. Contrôle sans authentification sur le port local Radar : accueil HTTP 401, API de session HTTP 200 ; aucun parcours connecté vérifié. Le constat avant/après est conservé dans la sauvegarde protégée.
