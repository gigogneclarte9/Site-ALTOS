# Phase 0 - Cadrage et securisation

Date : 2026-06-18

Objectif : rendre le depot, le futur deploiement et les donnees suffisamment propres avant de passer au socle applicatif VPS.

## Statut

Phase 0 en cours, avec les premiers blocages critiques traites cote depot.

## Actions realisees

- Analyse du projet statique existant.
- Confirmation du versionnement Git.
- Creation du backlog projet.
- Documentation de la stack technique cible.
- Documentation des decisions techniques.
- Documentation du modele de donnees cible.
- Creation de la roadmap produit.
- Creation de l'audit securite du depot.
- Ajout d'un `.gitignore`.
- Desindexation Git des dossiers prives ou non destines au site public :
  - `uploads/` ;
  - `work/` ;
  - `audits-raw/` ;
  - `audits-extracted/` ;
  - `screenshots/`.
- Desindexation de `assets/audit-bot.js`, prototype non production base sur `window.claude.complete`.
- Creation de la liste blanche publique `deploy/public-allowlist.txt`.
- Creation d'un exemple Nginx cible `deploy/nginx-altos.conf.example`.
- Creation de la documentation `docs/DEPLOIEMENT_VPS.md`.
- Nettoyage de `robots.txt` : le PDF charte reste public car il est volontairement lie depuis l'accueil.

## Verification realisee

- Fichiers encore suivis par Git dans les dossiers prives : `0`.
- Fichiers toujours presents localement dans ces dossiers : `97`.
- Les fichiers ont ete retires du suivi Git avec `git rm --cached`, donc ils restent disponibles sur la machine locale.

## Attention importante

La desindexation retire ces fichiers du prochain etat du depot, mais ne les efface pas automatiquement de l'historique Git deja pousse.

Si le depot GitHub contient deja des donnees confidentielles ou personnelles, il faudra prevoir une etape specifique de nettoyage d'historique avant de considerer le depot comme publiable ou partageable largement.

## Reste a faire en Phase 0

- Valider definitivement la liste blanche des fichiers publics a deployer.
- Valider l'exemple Nginx cible.
- Formaliser les variables d'environnement attendues.
- Preparer la strategie de sauvegarde :
  - dump PostgreSQL ;
  - fichiers prives hors webroot ;
  - copie chiffree hors VPS ;
  - test de restauration.

## Critere de passage en Phase 1

On pourra passer a la Phase 1 quand :

- les dossiers prives sont bien hors suivi Git ;
- la liste blanche de deploiement public est creee et validee ;
- le plan Nginx/VPS est suffisamment clair et valide ;
- les secrets et fichiers prives sont explicitement exclus du depot et du webroot ;
- les risques majeurs de publication accidentelle sont documentes.
