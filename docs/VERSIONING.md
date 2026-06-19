# Versioning ALTOS

Date : 2026-06-19

Objectif : garder une trace claire des versions du site public et de la zone admin, visible dans l'admin et documentee avant chaque commit/release.

## Version courante

```text
Site public : 0.4.0
Admin       : 0.3.0
Release     : Phase 4 locale terminee
```

## Fichiers de reference

- `CHANGELOG.md` : historique lisible des versions.
- `server/src/version.ts` : source utilisee par l'admin et par `/api/health`.
- `server/package.json` : version technique du package backend Node.

## Regle pratique

- Incrementation mineure (`0.x.0`) quand une phase produit est terminee.
- Incrementation patch (`0.x.y`) pour correctifs, documentation ou ajustements sans changement fonctionnel majeur.
- Tant que le premier deploiement VPS n'est pas valide, rester en version `0.x`.

## Versions separees

Le site public et l'admin peuvent avancer a des rythmes differents :

- `siteVersion` suit le site public, les pages, les assets, le SEO et les contenus statiques.
- `adminVersion` suit le back-office commercial/editorial et les routes admin.
- `releaseVersion` permet d'identifier le jalon global visible dans l'admin.

## Avant un commit de release

1. Mettre a jour `CHANGELOG.md`.
2. Mettre a jour `server/src/version.ts`.
3. Verifier l'affichage dans `/admin/login` ou `/admin/leads`.
4. Verifier `/api/health`.
5. Lancer les controles habituels.

## Affichage admin

La zone admin affiche :

```text
Site vX.Y.Z · Admin vX.Y.Z
```

Cet affichage sert a verifier rapidement quelle version est en cours sur le VPS apres deploiement.
