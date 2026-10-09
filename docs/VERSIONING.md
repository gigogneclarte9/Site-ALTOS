# Versioning ALTOS

Date : 2026-10-09

Objectif : garder une trace claire des versions du site public et de la zone admin, visible dans l'admin et documentee avant chaque commit/release.

## Version courante

```text
Site public : 0.4.12
Admin       : 0.3.0
Release     : 0.4.12 - Coordonnees des mentions legales
```

## Fichiers de reference

- `CHANGELOG.md` : historique lisible des versions.
- `server/src/version.ts` : source utilisee par l'admin et par `/api/health`.
- `server/package.json` : version technique du package backend Node.

La version technique du package backend reste independante de la release du site.
La version du site est affichee dans l'administration et exposee par `/api/health`, sans badge sur les pages publiques.

## Regle pratique

- Incrementation mineure (`0.x.0`) quand une phase produit est terminee.
- Incrementation patch (`0.x.y`) pour correctifs, documentation ou ajustements sans changement fonctionnel majeur.
- Tant que le projet reste en pre-production, rester en version `0.x`.

## Versions separees

Le site public et l'admin peuvent avancer a des rythmes differents :

- `siteVersion` suit le site public, les pages, les assets, le SEO et les contenus statiques.
- `adminVersion` suit le back-office commercial/editorial et les routes admin.
- `releaseVersion` permet d'identifier le jalon global visible dans `/api/health`.

## Avant un commit de release

1. Mettre a jour `CHANGELOG.md`.
2. Mettre a jour `server/src/version.ts`.
3. Mettre a jour ce document.
4. Verifier l'affichage dans `/admin/login` ou `/admin/leads`.
5. Verifier `/api/health`.
6. Lancer les controles habituels.

## Affichage admin

La zone admin affiche :

```text
Site vX.Y.Z - Admin vX.Y.Z
```

Cet affichage sert a verifier rapidement quelle version est en cours sur le VPS apres deploiement.
