# Structure cible du contenu public

Date : 2026-06-19

Objectif : preparer le passage futur des articles et cas d'usage vers une gestion en base, sans changer tout de suite le fonctionnement du site public.

Le site public reste actuellement statique : pages HTML, CSS et JavaScript servis par Nginx. Cette structure cible sert de reference pour la phase editoriale future.

## Principes

- Ne pas perdre les contenus metier deja presents dans les pages HTML.
- Conserver les notes methodologiques, notes d'anonymisation et mentions RGPD propres a chaque page.
- Garder des URLs publiques stables autant que possible.
- Separer le contenu editorial des composants communs : menu, footer, styles, scripts.
- Prevoir une migration progressive : HTML actuel vers donnees structurees, puis back-office editorial.

## Articles du journal

Source actuelle :

- `journal.html`
- `journal/*.html`

Champs cible :

- `id`
- `slug`
- `title`
- `seo_title`
- `seo_description`
- `canonical_url`
- `status` : draft, published, archived
- `published_at`
- `updated_at`
- `reading_time_minutes`
- `category`
- `tags`
- `author_name`
- `hero_label`
- `intro`
- `body_html` ou `body_json`
- `note_contextuelle`
- `og_image_path`
- `created_at`
- `updated_at`

Regles de conservation :

- Les dates de publication existantes doivent etre reprises.
- Les titres, descriptions, categories et temps de lecture doivent rester coherents avec les pages actuelles.
- Les notes de contexte ou d'anonymisation doivent etre stockees dans un champ dedie, pas perdues dans le footer.

## Cas d'usage

Source actuelle :

- `cas-usage.html`
- `cas-usage/*.html`
- `cas-usage/_case-style.css`

Champs cible :

- `id`
- `slug`
- `title`
- `seo_title`
- `seo_description`
- `canonical_url`
- `status` : draft, published, archived
- `case_type` : mission, audit
- `sector`
- `year`
- `summary`
- `context`
- `pain_points`
- `solution`
- `tools`
- `results`
- `projected_gains`
- `metrics`
- `tags`
- `body_html` ou `body_json`
- `anonymisation_note`
- `source_report_reference`
- `published_at`
- `updated_at`

Regles de conservation :

- Les 20 cas listes dans `cas-usage.html` doivent rester presents.
- Les 10 fiches detaillees d'audit doivent conserver leurs notes d'anonymisation.
- Les gains projetes doivent rester identifies comme projections quand c'est le cas.
- Les distinctions `mission` et `audit` doivent rester disponibles pour les filtres.
- Les secteurs actuels doivent rester compatibles avec les filtres : services, distribution, conseil, immobilier.

## Medias et fichiers publics

Champs cible :

- `id`
- `file_path`
- `public_url`
- `mime_type`
- `alt_text`
- `caption`
- `credit`
- `usage_context`
- `is_public`
- `created_at`

Regles :

- Les medias publics restent dans un repertoire public controle.
- Les documents prives, audits bruts et fichiers de travail restent hors webroot.
- Les PDF generes par le micro-audit ne deviennent pas des medias publics.

## Relation avec le back-office editorial

Le back-office editorial arrivera apres le back-office commercial.

Fonctions cible :

- creer/modifier un article ;
- creer/modifier un cas d'usage ;
- gerer brouillon, publication et archivage ;
- modifier les metadonnees SEO ;
- gerer les notes d'anonymisation et de contexte ;
- associer des medias publics ;
- conserver un historique des revisions.

Cette evolution ne change pas la stack retenue :

```text
Frontend public statique ou genere
API TypeScript + Node.js LTS + Fastify
PostgreSQL
Back-office HTML/admin dynamique
Nginx
VPS OVH
```

## Migration progressive recommandee

1. Garder les pages HTML actuelles comme reference.
2. Extraire une premiere representation structuree des articles et cas.
3. Verifier que les pages generees reproduisent les contenus existants.
4. Brancher le back-office editorial seulement apres validation du modele.
5. Publier les contenus depuis la base ou depuis une generation statique controlee.

## Hors perimetre Phase 4

- Creation du back-office editorial.
- Migration effective des articles/cas en base.
- Editeur WYSIWYG.
- Gestion des revisions en production.
- Generation automatique complete du sitemap.
