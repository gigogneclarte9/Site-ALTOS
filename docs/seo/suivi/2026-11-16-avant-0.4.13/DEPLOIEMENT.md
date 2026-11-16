# Publication SEO 0.4.13

**Publication terminée le 16 novembre 2026 à 16 h 41 min 58 s (Europe/Paris), soit 15:41:58 UTC.** Publication autorisée par l’utilisateur et réalisée selon la procédure habituelle du VPS.

- Version précédente : site/release 0.4.12 ; admin 0.3.0.
- Version publiée : site/release 0.4.13 ; admin inchangé 0.3.0.
- Référence prépublication : [manifeste des captures](manifest.json), Search Console et relevés web conservés dans ce dossier.
- Procédure : local → commit → push GitHub → pull du dépôt VPS → `deploy/deploy.sh`.
- Rendu navigateur complet et ouverture du calendrier : non validés automatiquement. Contrôles de fichiers, contraste calculé, métadonnées, liens et HTTP effectués avant publication.

## Exécution et vérification

- Commit applicatif poussé sur `main` : `279a082cd997284d8f7904e52275c9d18f5276e0`.
- Sauvegarde du webroot précédent : `/var/lib/altos/backups-local/releases/20261116-before-0.4.13/public-0.4.12.tar.gz` ; commit précédent conservé dans le même dossier.
- Déploiement de 15:41:48 à 15:41:58 UTC : `git pull --ff-only`, puis `sudo bash deploy/deploy.sh`. Build TypeScript réussi, aucune migration en attente, API redémarrée.
- Services `altos-api`, `nginx` et `postgresql` actifs après publication.
- Tous les fichiers publics de la liste de déploiement correspondent octet pour octet au commit applicatif, y compris CSS, visuel social, robots et sitemap. Les pages attendues répondent en 200 ; la page 404 répond en 404.
- Health : statut `ok`, base accessible ; versions 0.4.13/0.3.0 également présentes dans la page de connexion admin.
- Chemins testés des documents SEO, du ZIP Search Console, du code serveur et de `.git` : HTTP 404.
- Preuves : [rapport de vérification de production](verification-production-0.4.13.json), collecté à partir de 15:42:38 UTC. Aucun lead ou email de test créé.

Les mises à jour documentaires après publication font l’objet d’un commit séparé ; elles ne modifient pas les fichiers applicatifs de cette release.

## Point technique à traiter séparément

Lors du déploiement, npm a signalé **5 vulnérabilités dans les dépendances de production (4 élevées, 1 critique)**. Les dépendances et le lockfile n’ont pas été modifiés par cette release SEO. Ce compteur ne constitue pas une analyse d’exploitabilité : qualification et correctifs restent à réaliser dans un lot dédié, sans mise à jour automatique pendant ce déploiement.
