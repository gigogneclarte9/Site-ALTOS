# Cas d'usage — Cabinet de chasse de têtes

> **Secteur :** Recrutement de cadres et cadres dirigeants
> **Profil :** TPE — cabinet national, 8 ans d'existence
> **Durée de l'accompagnement :** 5 jours
> **Année :** 2025

---

## Contexte

Cabinet de recrutement de cadres et cadres dirigeants, intervenant au niveau national avec une forte dimension RSE. Structure agile mais très centralisée, où la dirigeante gérait manuellement une grande partie de la prospection et de la veille stratégique.

**Problématique :** une surcharge opérationnelle liée à des tâches manuelles chronophages (sourcing, saisie de données, relances) limitant le temps alloué à la relation client et au conseil à haute valeur ajoutée.

## Objectifs

Industrialiser la détection et la qualification d'opportunités de recrutement.

- **Automatisation du sourcing** : supprimer la veille manuelle sur les plateformes d'emploi.
- **Qualification intelligente** : filtrer uniquement les postes à responsabilité (CODIR, COMEX).
- **Efficacité commerciale** : centraliser les données de prospection dans Airtable.
- **Suppression du « bruit »** : éliminer automatiquement les offres non pertinentes (profils juniors, concurrents, intérim).

## Actions réalisées

1. **Audit flash** : diagnostic des processus et identification des gisements de productivité.
2. **Configuration technique** : paramétrage du scraping (Apify / LinkedIn) et de la base Airtable.
3. **Développement de l'agent IA** : création et test des prompts de qualification sur l'API ChatGPT.
4. **Formation** au pilotage du système.

### Stack déployée

- **Apify (LinkedIn Jobs)** — scraping automatisé des offres selon mots-clés stratégiques (CEO, CFO, CTO…).
- **Airtable** — base centrale « PIGES » structurant les opportunités collectées.
- **n8n** — orchestrateur reliant scraping, analyse IA et injection dans la base.
- **OpenAI / ChatGPT API** — scoring et nettoyage des données.

### Volet formation

Acculturation API + n8n, prompt engineering (adaptation des critères de qualification si le positionnement évolue), gestion Airtable (vues, filtrage des scores, listes d'exclusion / priorité).

## Bénéfices

- **Gain de temps : -70 %** sur la phase de sourcing et de tri initial.
- **Veille 24h/24** sans intervention humaine.
- **Rejet automatique** des offres hors-scope (juniors / intérim) proche de **100 %**.
- **Recentrage stratégique** : le cabinet ne traite que des opportunités ultra-qualifiées, renforçant son positionnement premium.
- **Fiabilité** : suppression de l'erreur humaine et normalisation des données (URL, intitulé, localisation).

### ROI sur 12 mois

- Gain de temps : 10 h de veille manuelle / semaine → -70 %, soit **7 h / semaine** récupérées.
- Sur 36 semaines de prospection active : **252 h / an** valorisées à 60 €/h = **15 120 €**.
- Coût de l'accompagnement : **1 900 € HT**.
- **ROI : +695 % — investissement amorti en ~6,5 semaines.**

## Difficultés & solutions

- Complexité du scraping LinkedIn → usage d'outils conformes et robustes (Apify) pour éviter les blocages.
- Précision du filtrage → logique en étapes : nettoyage par mots-clés, puis analyse sémantique fine par l'agent IA.
- Faux positifs → validation humaine pour les scores intermédiaires (40-69).

## Cas d'usage

### Cas n°1 — Sourcing & qualification par agent IA (cœur de mission)

Le système interroge chaque semaine LinkedIn sur la zone Paris / grandes métropoles pour des postes de Direction. L'IA analyse le descriptif, vérifie qu'il ne s'agit pas d'une offre concurrente, attribue un score de 0 à 100 selon la séniorité, et injecte le résultat dans Airtable.

### Cas n°2 — Pilotage de l'activité commerciale

Formulaire simplifié relié à Airtable pour comptabiliser appels et mails sortants, générant un tableau de bord de performance en temps réel.

### Transférabilité

Directement applicable à toute activité de veille commerciale B2B nécessitant un filtrage sémantique complexe. Conditions : base centrale type CRM ou Airtable, critères de ciblage clairement définis, budgets pour les outils d'automatisation (n8n, OpenAI, Apify).

## Témoignage

> « Ce système agit comme un analyste marché, un assistant commercial et un contrôleur qualité disponible en permanence. L'IA nous permet désormais de renforcer notre positionnement premium en ne traitant que les opportunités les plus stratégiques. »
