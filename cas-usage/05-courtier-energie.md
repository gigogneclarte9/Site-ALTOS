# Cas d'usage — Courtier en énergie pour professionnels

> **Secteur :** Courtage en contrats et services énergétiques pour les professionnels
> **Profil :** TPE — équipe restreinte (dirigeant + 4 commerciaux + 1 assistante), reprise de franchise en 2020
> **Durée de l'accompagnement :** 5 jours
> **Année :** 2025

---

## Contexte

Entreprise spécialisée dans le courtage en contrats et services énergétiques à destination des professionnels, avec pour objectif principal la réduction des consommations et l'optimisation des coûts énergétiques. Implantation principale sur le sud-ouest de la France.

Le modèle commercial repose principalement sur la prospection téléphonique sortante via fichiers qualifiés.

**Enjeux identifiés :**

- Automatisation des processus métiers chronophages (notamment traitement des commissions).
- Amélioration de la qualification et du ciblage commercial.
- Exploitation plus avancée des données disponibles.
- Structuration d'une démarche d'innovation basée sur l'IA et l'automatisation.

## Objectifs

- Identifier les opportunités concrètes d'automatisation et d'intégration de l'IA dans les processus métiers.
- Concevoir et déployer des workflows opérationnels adaptés aux besoins réels.
- Structurer l'exploitation des données commerciales et de prospection.
- Renforcer la capacité d'analyse et de veille.
- Acculturer l'entreprise aux outils d'automatisation et aux logiques d'orchestration no-code.

## Actions réalisées

1. Phase de cadrage et diagnostic : analyse des processus internes (prospection, commissions, reporting, veille).
2. Identification et priorisation des cas d'usage IA et automatisation.
3. Conception technique des workflows sur n8n.
4. Tests, ajustements et sécurisation des automatisations.
5. Transfert de compétences et accompagnement à la prise en main.

### Scénarios déployés

#### 1. Assistant IA conversationnel (RAG Supabase)

- Ingestion automatisée de documents depuis Google Drive.
- Vectorisation via OpenAI Embeddings.
- Stockage vectoriel dans Supabase (pgvector).
- Interrogation conversationnelle via LangChain et Claude Sonnet (OpenRouter).
- Mémoire conversationnelle multi-tours.
- Extension possible vers noCRM.io pour enrichir les réponses commerciales.

**Usages :** consultation rapide d'informations internes, support à la prise de décision, centralisation des connaissances.

#### 2. Agent IA de veille entreprises (Pappers + BODACC via Telegram)

- Interrogation conversationnelle via Telegram.
- Recherche d'entreprises par nom, SIREN ou SIRET.
- Récupération de fiches complètes (dirigeants, finances, procédures).
- Scoring financier automatisé.
- Veille quotidienne via CRON, alertes Telegram en cas de risque, historisation dans Google Sheets.

**Usages :** sécurisation des prises de décision commerciales, qualification avancée des prospects, anticipation des risques clients.

### Stack utilisée

n8n (self-hosted), Claude Sonnet via OpenRouter, Supabase, OpenAI Embeddings, LangChain, Pappers API, Telegram Bot API, Google Drive, Google Sheets.

## Bénéfices

- **Analyse de prospects : -60 %** de temps.
- **Recherche d'informations entreprises : -70 %** de temps.
- Meilleure qualification des leads.
- Prise de décision plus rapide et sécurisée.
- Montée en autonomie du dirigeant sur les sujets d'analyse.
- Structuration progressive de la stratégie data.

### ROI sur 12 mois

| Poste de gain | Estimation |
|---|---|
| Analyse / qualification prospects (≈ 1 h/jour × 220 jours, valorisé 30 €/h) | **6 600 €** |
| Recherche infos entreprises (≈ 20 min/jour, ≈ 70 h/an) | **2 100 €** |
| Gains indirects (meilleur ciblage, réduction du risque commercial, décisions plus rapides) | **900 €** |
| **Gains annuels estimés** | **9 600 €** |

- Coût de l'accompagnement : **1 900 €**.
- **ROI : 405 %.**

## Difficultés & solutions

- Hétérogénéité des données initiales → normalisation progressive des fichiers.
- Faible formalisation des processus en amont → simplification des interfaces.
- Nécessité d'acculturation aux outils IA → approche pédagogique progressive.

## Cas d'usage transférables

Analyse rapide d'entreprises avant prospection, détection automatique des risques clients, consultation assistée des bases internes. Transférables aux activités de courtage, vente B2B, services financiers et conseil.

## Témoignage

> « Les outils déployés nous permettent aujourd'hui d'aller plus vite dans l'analyse des prospects et d'améliorer la fiabilité de nos décisions commerciales. Les équipes perçoivent les automatisations comme un levier d'efficacité et non comme une contrainte. »
