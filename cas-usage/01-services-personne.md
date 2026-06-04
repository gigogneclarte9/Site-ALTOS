# Cas d'usage — Réseau de services à la personne

> **Secteur :** Services à la personne — maintien à domicile des seniors
> **Profil :** Réseau régional, site local en Occitanie
> **Durée de l'accompagnement :** 5 jours
> **Année :** 2025

---

## Contexte

Réseau de services à la personne dont l'activité est orientée vers le maintien à domicile des seniors. La structure était engagée dans un projet d'optimisation numérique visant à automatiser certains processus internes, notamment la production de bilans annuels et l'analyse d'événements indésirables (EI).

L'enjeu principal portait sur l'amélioration de l'efficacité opérationnelle par la réduction des tâches manuelles chronophages, la fiabilisation des analyses produites et le renforcement de la visibilité web via la production de contenus SEO adaptés au marché français.

## Objectifs

- **Automatisation des rapports :** générer les bilans annuels et les bilans d'Événements Indésirables (EI) pour réduire le temps de traitement manuel.
- **Optimisation SEO :** produire des articles de blog pertinents pour le référencement national français.
- **Fiabilisation des données :** corriger les erreurs de segmentation et améliorer la précision des analyses produites par l'IA.
- **Autonomie technique :** permettre au référent technique interne de gérer les formulaires et les prompts.

## Actions réalisées

1. **Cadrage** des besoins prioritaires.
2. **Analyse et optimisation** des workflows existants, notamment pour les bilans EI et annuels.
3. **Corrections techniques :**
   - Sources SEO recentrées sur des sources françaises et européennes.
   - Refonte du workflow EI pour permettre l'analyse de l'année complète (correction du bug de découpage par tranches).
   - Optimisation de la consommation de tokens.
   - Passage du mode sombre au mode clair sur les signatures de formulaires.
   - Configuration WordPress en mode brouillon via n8n pour validation humaine.
   - Lecture directe des fichiers CSV sans conversion préalable.
4. **Tests et validation** avec le client.
5. **Formation** progressive du référent interne au prompting et à la supervision des workflows.

### Stack déployée

n8n, ChatGPT (OpenAI), OpenForm, WordPress.

## Bénéfices

- Production d'un bilan : **5 h → 15 min** (collecte, saisie, rédaction de 2 bilans).
- Production d'un article SEO : **1 h → 15 min**.
- Consommation de tokens IA optimisée.
- Sources SEO plus pertinentes pour le marché français.
- Meilleure traçabilité du raisonnement de l'IA.

### ROI sur 12 mois

| Nombre de clients/an | Gain total (h/an) | Gains financiers (25 €/h) | ROI 12 mois |
|---|---|---|---|
| 50 | 265,25 | 6 631 € | **249 %** |
| 100 | 502,75 | 12 569 € | **561 %** |
| 150 | 740,25 | 18 506 € | **874 %** |
| 200 | 977,75 | 24 444 € | **1 186 %** |

*Coût de l'accompagnement : 1 900 €.*

## Difficultés & solutions

- Contraintes du fournisseur mail → redirection vers une adresse Gmail dédiée.
- Accès administrateur WordPress limités → publication maintenue en mode brouillon.
- Incohérences dans les données EI → éléments de preuve ajoutés aux workflows pour fiabiliser les analyses.

## Cas d'usage transférables

Numérisation de formulaires papier, génération automatisée de bilans annuels, rédaction d'articles SEO sourcés. Transférable à toute structure de services à la personne confrontée à des volumes importants de données et à des obligations de reporting.

## Témoignage

> « Les équipes soulignent la rapidité de production des bilans et la facilité d'utilisation des nouveaux outils. »
