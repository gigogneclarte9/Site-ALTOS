# Modele de donnees ALTOS

Document de reference pour decider quelles informations doivent aller en base PostgreSQL, quelles informations doivent rester en fichiers, et quelles parties du site peuvent rester statiques.

## 1. Principe general

Tout ne doit pas aller en base.

La base PostgreSQL doit devenir la source de verite pour les donnees applicatives, commerciales, administrables ou sensibles.

Les pages purement editoriales peuvent rester statiques au depart. Les fichiers lourds, notamment PDF, doivent rester sur disque hors webroot avec uniquement leurs metadonnees en base.

## 2. Donnees a mettre en base des le premier palier

### Micro-audit

Le micro-audit est la fonctionnalite prioritaire a connecter a la base.

Donnees a stocker :

- contact :
  - prenom ;
  - nom ;
  - email ;
  - telephone ;
  - entreprise si ajoutee au formulaire ;
  - source ;
  - consentement ;
  - date de consentement.
- reponses :
  - identifiant question ;
  - option choisie ;
  - score ;
  - libelle de la reponse au moment de la soumission.
- resultat :
  - score total ;
  - axes de friction ;
  - profil principal ;
  - quick wins recommandes ;
  - estimation de gain ;
  - estimation de ROI ;
  - date de generation.
- suivi :
  - statut commercial ;
  - notes internes ;
  - date de premier contact ;
  - date de RDV si connue ;
  - origine du lead.

Tables concernees :

```text
leads
micro_audits
lead_events
documents
```

On peut demarrer avec `answers_json`, `axes_json` et `recommendations_json` dans `micro_audits`, puis normaliser plus tard si besoin de reporting fin.

### PDF generes par le micro-audit

Les PDF ne doivent pas etre stockes directement en base.

En base :

- identifiant document ;
- lead rattache ;
- micro-audit rattache ;
- nom de fichier ;
- chemin serveur ;
- type MIME ;
- taille ;
- hash SHA-256 ;
- visibilite ;
- date de creation ;
- date d'expiration ou de suppression prevue.

Sur disque :

```text
/var/lib/altos/documents/private/micro-audits/
```

Table concernee :

```text
documents
```

### Back-office et suivi commercial

Tout ce qui sert a exploiter commercialement les leads doit etre en base.

Donnees a stocker :

- utilisateurs admin ;
- roles ;
- sessions ou tokens ;
- statuts des leads ;
- notes internes ;
- historique des actions ;
- exports realises ;
- consultations de documents sensibles.

Tables concernees :

```text
admin_users
admin_sessions
lead_events
```

### Journal d'evenements

Important pour tracer l'activite sans surcharger les tables principales.

Evenements possibles :

- micro-audit soumis ;
- PDF genere ;
- PDF consulte ;
- lead contacte ;
- statut change ;
- note ajoutee ;
- donnees exportees ;
- lead anonymise ou supprime.

Table concernee :

```text
lead_events
```

## 3. Donnees a mettre en base en deuxieme palier

### Rendez-vous Cal.com

Cal.com peut rester l'outil de reservation, mais le site peut plus tard garder une copie locale minimale.

Donnees utiles :

- lead rattache si connu ;
- email ;
- date/heure du RDV ;
- statut :
  - reserve ;
  - annule ;
  - reporte ;
  - realise ;
- lien Cal.com ;
- date de synchronisation.

Table possible :

```text
appointments
```

Ce n'est pas obligatoire au premier palier si Cal.com reste consulte separement.

### Notifications email

Si le backend envoie des emails, garder une trace minimale.

Donnees utiles :

- destinataire ;
- type d'email ;
- statut d'envoi ;
- message d'erreur si echec ;
- date d'envoi.

Table possible :

```text
email_events
```

### Parametres applicatifs

Certains reglages peuvent devenir administrables.

Exemples :

- email de notification interne ;
- duree de conservation des PDF ;
- texte de consentement actif ;
- version du questionnaire micro-audit ;
- liens CTA principaux.

Table possible :

```text
settings
```

## 4. Contenus pouvant rester statiques au depart

Ces parties n'ont pas besoin d'etre en base pour le premier palier.

### Page d'accueil

Peut rester dans `index.html`.

Raison :

- contenu marketing stable ;
- pas de besoin d'administration immediate ;
- bon pour performance et simplicite.

### Pages legales

Peuvent rester statiques :

- `mentions-legales.html`
- `confidentialite.html`

Raison :

- contenu rarement modifie ;
- validation manuelle souhaitable ;
- pas besoin de back-office au depart.

### Journal editorial

Peut rester statique au depart.

Actuel :

- fichiers HTML dans `journal/`.

Evolution retenue en second temps :

- migrer les articles en base PostgreSQL ;
- les administrer via un back-office editorial ;
- utiliser un editeur WYSIWYG ;
- conserver les revisions et statuts de publication.

La base devient utile a partir du moment ou le back-office editorial est lance.

### Cas d'usage

Peuvent rester statiques au depart.

Actuel :

- `cas-usage.html` ;
- fiches HTML dans `cas-usage/` ;
- quelques sources Markdown.

Evolution retenue en second temps :

- migrer les cas d'usage en base PostgreSQL ;
- les administrer via un back-office editorial ;
- utiliser un editeur WYSIWYG ;
- conserver les categories, tags, secteurs, brouillons et revisions.

La base peut devenir utile plus tard si :

- on veut rechercher/filtrer depuis l'API ;
- on veut un admin pour ajouter des cas ;
- on veut relier des cas a des tags, secteurs ou campagnes.

## 5. Fichiers a garder hors base

### PDF publics

Exemples :

- charte ambassadeur IA ;
- PDF publics valides.

Ils peuvent etre servis depuis un dossier public controle, avec metadonnees en base seulement si on veut les administrer.

### PDF prives

Exemples :

- bilans de micro-audit ;
- documents clients ;
- exports internes.

Ils doivent etre hors webroot et accessibles uniquement via l'API.

### Documents de travail

Exemples :

- `uploads/`
- `work/`
- `audits-raw/`
- `audits-extracted/`

Ils ne doivent pas etre exposes publiquement.

Decision a prendre :

- soit ils sortent du depot et restent dans un stockage prive ;
- soit ils sont nettoyes/anonymises ;
- soit seuls des extraits publics valides sont publies dans `assets/` ou dans le contenu editorial.

## 6. Schema minimal recommande

Premier schema suffisant :

```text
leads
  id
  first_name
  last_name
  email
  phone
  company
  source
  consent_text
  consent_at
  status
  created_at
  updated_at

micro_audits
  id
  lead_id
  score_total
  top_axis
  axes_json
  answers_json
  recommendations_json
  estimated_hours_per_week
  estimated_roi
  pdf_document_id
  created_at

documents
  id
  lead_id
  micro_audit_id
  type
  filename
  storage_path
  mime_type
  size_bytes
  sha256
  visibility
  created_at
  expires_at

lead_events
  id
  lead_id
  type
  payload_json
  created_at

admin_users
  id
  email
  password_hash
  role
  two_factor_enabled
  two_factor_secret_encrypted
  created_at
  last_login_at
```

## 7. Priorisation

### P0 - En base tout de suite

- Leads micro-audit.
- Reponses micro-audit.
- Scores et recommandations.
- Consentement.
- Statut commercial.
- Metadonnees PDF.
- Journal d'evenements minimal.

### P1 - En base rapidement

- Utilisateurs admin.
- Notes internes.
- Historique de consultation/telechargement PDF.
- Trace des notifications email.

### P2 - Eventuellement en base plus tard

- RDV Cal.com synchronises.
- Parametres administrables.
- Catalogue des documents publics.

### P3 - Back-office editorial

Le back-office editorial est prevu en second temps. Il ne change pas le socle technique, mais ajoutera de nouvelles donnees administrables.

Donnees possibles :

- articles ;
- cas d'usage ;
- contenu WYSIWYG ;
- contenu HTML publie ;
- categories ;
- tags ;
- auteurs ;
- brouillons ;
- revisions ;
- statuts de publication ;
- metadonnees SEO ;
- medias publics ;
- historique de publication.

Tables possibles :

```text
content_items
content_revisions
content_categories
content_tags
content_media
authors
```

Structure possible :

```text
content_items
  id
  type                  # article, case_study, page
  title
  slug
  excerpt
  body_json             # representation editeur WYSIWYG
  body_html             # HTML publie/preview
  status                # draft, review, published, archived
  author_id
  seo_title
  seo_description
  published_at
  created_at
  updated_at

content_revisions
  id
  content_item_id
  body_json
  body_html
  created_by
  created_at

content_media
  id
  filename
  storage_path
  mime_type
  size_bytes
  alt_text
  visibility
  created_at
```

Decision actuelle :

- ne pas creer ces tables au premier palier ;
- garder le contenu statique tant que le back-office editorial n'est pas prioritaire ;
- reserver la base aux leads, micro-audits, PDF et suivi commercial ;
- creer ces tables lors de la phase back-office editorial ;
- utiliser un editeur WYSIWYG pour les articles et cas d'usage.

### A garder statique pour l'instant

- Accueil.
- Pages legales.
- Articles du journal.
- Cas d'usage.
- SEO editorial.
- Assets publics valides.

## 8. Regle de decision

Mettre en base si l'information est :

- produite par un utilisateur ;
- liee a un lead ;
- sensible ;
- modifiable par un back-office ;
- necessaire au suivi commercial ;
- necessaire a un historique ;
- necessaire a une suppression/anonymisation RGPD ;
- necessaire a un controle d'acces.

Garder en fichier statique si l'information est :

- editorialisee ;
- peu modifiee ;
- versionnable dans Git ;
- publique ;
- mieux geree par generation statique.

Garder hors base si c'est :

- un PDF ;
- une image ;
- un document lourd ;
- une archive ;
- un fichier source de travail.
