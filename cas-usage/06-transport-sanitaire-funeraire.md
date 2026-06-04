# Cas d'usage — Transport sanitaire & funéraire

> **Secteur :** Transport sanitaire (ambulances, VSL), taxi conventionné, funéraire
> **Profil :** PME de 48 salariés (43 ETP), en croissance par acquisitions depuis 2022
> **Durée de l'accompagnement :** 5 jours
> **Année :** 2025

---

## Contexte

Entreprise multi-activités du transport sanitaire et des services funéraires, ayant absorbé plusieurs structures depuis 2022. L'organisation reposait historiquement sur des processus manuels (Excel, papier, ressaisie) pour la gestion administrative, comptable et sociale — un héritage devenu critique avec la croissance.

Le dirigeant cherchait à structurer ses processus, automatiser les tâches à faible valeur ajoutée et obtenir une visibilité temps réel sur sa trésorerie, sa masse salariale et ses plannings.

## Objectifs

- Remplacer les processus manuels par des outils numériques centralisés.
- Automatiser les tâches administratives et comptables répétitives.
- Fiabiliser la gestion des données (paie, facturation, trésorerie).
- Améliorer la gestion des plannings et des ressources humaines.
- Disposer d'une vision en temps réel de l'activité financière.
- Mettre en place un assistant IA pour faciliter le pilotage.

## Actions réalisées

Deux applications métier internes ont été développées sur mesure :

### 1. Application comptable interne
- Centralisation des factures fournisseurs
- Visualisation des données financières (CA, dépenses, marge)
- Rapprochement bancaire semi-automatisé
- Import OCR des documents
- Assistant IA financier connecté aux données

### 2. Application RH & paie interne
- Gestion des plannings salariés
- Saisie des heures travaillées
- Calcul automatique des heures supplémentaires (jour, nuit, dimanche, astreintes)
- Génération des éléments variables de paie (EVP)
- Export automatique vers le cabinet comptable

### 3. Orchestration n8n
- Synchronisation RH → Comptabilité (masse salariale)
- Rapprochement bancaire automatisé en fin de mois
- Création automatique de factures à partir de documents
- Envoi de rapports mensuels au dirigeant

### Stack déployée

React 18 (via Lovable) · Supabase (PostgreSQL Europe) · n8n (serveur dédié) · OpenRouter (Claude, GPT, Gemini)

## Bénéfices

- **Rapprochement bancaire :** 8 à 12 heures économisées par mois
- **Taux de rapprochement automatique :** ~75 %
- Suppression de la double saisie administrative
- Fiabilisation des données de paie
- Visibilité financière en temps réel pour le dirigeant
- **ROI sur 12 mois : ~700 %**

## Difficultés & solutions

- Habitudes Excel/papier profondément ancrées → déploiement progressif des fonctionnalités, automatisation par étapes.
- Données initialement non structurées → travail de mise en forme préalable avant automatisation.
- Prise en main des nouveaux outils → simplification des interfaces, formation ciblée.

## Cas d'usage transférables

PME multi-sites avec gestion RH et comptable internalisée, activités nécessitant un suivi de plannings et de ressources, structures ayant connu une croissance externe rapide nécessitant une refonte des process.

## Témoignage

> « Cet accompagnement nous a permis de créer des outils sur mesure, de gagner du temps sur les tâches administratives et de mieux piloter notre activité. Les solutions proposées étaient parfaitement adaptées à notre fonctionnement. »
