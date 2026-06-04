# Cas d'usage — Chasse immobilière internationale

> **Secteur :** Chasse immobilière pour clientèle étrangère (Belgique, Pays-Bas)
> **Profil :** Agence régionale, Sud-Ouest (4 départements)
> **Durée de l'accompagnement :** 5 jours
> **Année :** 2025

---

## Contexte

Agence de chasse immobilière dédiée à une clientèle étrangère (principalement belge et néerlandaise) cherchant à acquérir des biens dans le Sud-Ouest. L'activité couvre quatre départements et nécessite de scanner en permanence des milliers d'annonces issues de plateformes nationales, de réseaux d'agences et d'acteurs indépendants.

Avant intervention, le sourcing reposait sur un fonctionnement artisanal : chaque agent consacrait **environ une journée par semaine** à des recherches répétitives sur les portails immobiliers. L'enjeu était double : industrialiser la veille et améliorer la qualité des dossiers remis aux acquéreurs.

## Objectifs

- Surveiller en continu plusieurs plateformes immobilières simultanément.
- Automatiser la collecte, le tri et l'analyse des annonces selon des critères clients.
- Réduire le temps consacré aux recherches manuelles.
- Industrialiser la génération des dossiers PDF clients.
- Maîtriser les coûts liés à l'utilisation des API IA.
- Transférer les compétences à l'équipe pour assurer la maintenance.

## Actions réalisées

### Architecture déployée

**Solution de veille immobilière sur mesure** centralisant l'ensemble du pipeline :
1. **Scraping** automatisé via Apify (plateformes nationales, réseaux d'agences)
2. **Analyse sémantique** via OpenAI / GPT (extraction surface, DPE, caractéristiques, mots-clés)
3. **Filtrage automatique** selon les critères client définis
4. **Génération automatique** de dossiers PDF standardisés
5. **Supervision via logs** avec indicateurs visuels pour détecter les anomalies

### Optimisations clés

- Lancement des traitements la nuit → résultats disponibles dès le matin
- Standardisation des URLs pour stabiliser les flux dans la durée
- Paramétrage des plafonds budgétaires API pour sécuriser les coûts
- Optimisation du choix des modèles IA selon la tâche (économie significative)

### Stack déployée

Apify (scraping) · OpenAI / GPT (analyse sémantique) · Générateur PDF custom · Système de logs supervisé

## Bénéfices

- **−7 heures / semaine / agent** sur les recherches immobilières — soit **~364 h/an/agent**
- **−52 heures / an / agent** sur la génération de dossiers
- Coût de collecte optimisé à ~0,50 $ par agence scannée
- Capacité de traitement simultané de plusieurs recherches clients
- Plusieurs biens pertinents détectés dès les premières phases de test, dont un ayant donné lieu à une offre d'achat
- Uniformisation et professionnalisation des livrables remis aux acquéreurs

## Difficultés & solutions

- Saturation ponctuelle des serveurs lors du scraping → optimisation des fréquences et standardisation des flux
- Variabilité des coûts OpenAI selon les modèles → paramétrage de plafonds budgétaires + benchmark des modèles
- Évolutions régulières des sites sources → mise en place d'un système de logs visuels + maintenance corrective continue

## Cas d'usage transférables

Veille automatisée multi-sources (immobilier, marchés publics, opportunités B2B), automatisation documentaire et génération de rapports commerciaux, analyse IA de données textuelles non structurées, systèmes de surveillance automatisée dans tout secteur à fort volume documentaire.

## Témoignage

> « Cela nous fait gagner beaucoup de temps, et permet à mon équipe de faire autre chose pendant que l'outil cherche des biens. On a libéré du temps humain. »
