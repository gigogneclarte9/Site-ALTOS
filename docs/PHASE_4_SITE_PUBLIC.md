# Phase 4 - Industrialisation du site public

Date : 2026-06-19

Objectif : rendre le site public plus maintenable sans perdre les informations editoriales ou metier deja presentes dans les pages.

## Statut

Phase 4 terminee cote industrialisation locale.

Premiere passe realisee : harmonisation de la navigation principale sur le perimetre public prioritaire.

Deuxieme passe realisee : uniformisation du footer public, avec conservation des notes specifiques juste au-dessus du footer.

Precision : le menu et le footer sont maintenant factorises par partials et synchronises dans les pages statiques. Le site servi reste statique, mais les sources de verite des composants communs sont centralisees.

Sources communes :

- `partials/site-nav.html`
- `partials/site-footer.html`

Commande de synchronisation :

```bash
node tools/sync-shared-components.mjs
```

Commande de verification :

```bash
node tools/sync-shared-components.mjs --check
```

Toute modification du menu ou du footer doit passer par les partials, puis par la commande de synchronisation. Les pages HTML contiennent des marqueurs `SHARED_NAV_*` et `SHARED_FOOTER_*` qui permettent au script de remplacer uniquement les blocs communs.

Recette visuelle locale :

- test utilisateur realise sur `http://127.0.0.1:8080/index.html` et les pages publiques principales ;
- aucun probleme visuel signale apres les extractions Phase 4 ;
- le site public reste volontairement servi en pages HTML statiques a ce stade.

## Regle de conservation du contenu

Les footers ne doivent pas etre remplaces aveuglement par un footer unique sans extraire les notes specifiques.

Certaines pages portent des informations specifiques qu'il faut conserver :

- `micro-audit.html` : note methodologique sur la grille de diagnostic, les 120 missions PME/TPE, le role du micro-audit et l'usage des reponses.
- `cas-usage.html` : note d'anonymisation des vingt cas, distinction missions livrees / audits flash, retrait des donnees sensibles et precision sur les gains projetes.
- `cas-usage/*.html` : note d'anonymisation propre a chaque audit.
- `journal/*.html` : notes d'anonymisation ou de contexte propres aux articles.

La factorisation du footer appliquee prevoit maintenant :

- un socle commun : marque, contact, liens legaux, liens structurants ;
- une zone de note specifique par page, preservee juste au-dessus du footer ;
- aucune suppression de texte metier sans validation.

## Livrables realises

- Harmonisation du CTA de navigation sur les pages principales : `Diagnostic 30 min`.
- Harmonisation du CTA de navigation sur les pages legales.
- Harmonisation du CTA de navigation sur les articles du journal.
- Harmonisation du CTA de navigation sur les fiches de cas d'usage.
- Conservation des footers specifiques existants.
- Conservation des liens de retour propres aux articles et fiches cas.
- Ajout d'une regle documentee pour ne pas perdre les notes methodologiques ou d'anonymisation.
- Ajout d'une feuille CSS partagee pour le footer et les notes de page : `assets/site-components.css`.
- Footer public commun applique sur les pages prioritaires.
- Notes specifiques de page sorties du footer et placees dans un bloc `site-page-note` juste au-dessus.
- Creation de partials partages pour le menu et le footer.
- Creation d'un script de synchronisation idempotent : `tools/sync-shared-components.mjs`.
- Ajout de marqueurs de synchronisation dans les pages publiques prioritaires.
- Extraction du script Cal.com commun dans `assets/calcom.js`.
- Remplacement des embeds Cal.com inline par une balise script partagee.
- Verification que toutes les pages contenant `data-cal-link` chargent `assets/calcom.js`.
- Nettoyage des anciennes regles CSS de footer devenues inutiles dans les pages publiques prioritaires.
- Creation d'une page `journal.html` listant les articles existants.
- Remplacement du lien placeholder `href="#"` du bouton `Tous les articles` par `journal.html`.
- Harmonisation du lien `Journal` du menu et du footer vers `journal.html`.
- Extraction des styles communs de navigation dans `assets/site-components.css`.
- Nettoyage des anciennes regles CSS de navigation locales sur les pages publiques prioritaires.
- Extraction des styles communs de boutons dans `assets/site-components.css`.
- Extraction des animations `reveal` et `reveal-line` dans `assets/site-components.css`.
- Conservation des surcharges contextuelles de CTA quand elles portent une intention visuelle locale.
- Extraction du script commun `IntersectionObserver` dans `assets/reveal.js`.
- Remplacement des scripts inline de reveal sur `index.html` et `cas-usage.html`.
- Extraction du script de filtres de `cas-usage.html` dans `assets/case-filters.js`.
- Conservation des 5 filtres secteur, 3 filtres type et 20 cartes de cas d'usage apres extraction.
- Creation du document de structure cible pour les contenus publics : `docs/STRUCTURE_CONTENU_PUBLIC.md`.
- Recette visuelle locale utilisateur consideree OK sur le serveur statique `127.0.0.1:8080`.

## Pages couvertes par la premiere passe

- `index.html`
- `cas-usage.html`
- `micro-audit.html`
- `journal.html`
- `mentions-legales.html`
- `confidentialite.html`
- `journal/*.html`
- `cas-usage/*.html`

## Points reportes hors Phase 4

- Extraire progressivement les styles communs restants : blocs de CTA, grilles recurrentes, typographies utilitaires.
- Corriger les liens placeholder restants dans les archives/prototypes si ces pages doivent redevenir publiques.
- Verifier visuellement les pages dans Chrome apres chaque future extraction.
- Migrer effectivement les articles/cas en base lors de la phase editoriale.
