# Audit securite du depot

Date : 2026-06-18

## Statut

Le depot est versionne avec Git et pointe vers un depot distant GitHub.

Avant tout deploiement public sur le VPS OVH, le depot doit etre nettoye ou deploye via une liste blanche stricte. Plusieurs dossiers contenant des documents de travail, audits, exports ou fichiers potentiellement sensibles sont actuellement suivis par Git.

## Constat principal

Un fichier `.gitignore` a ete ajoute pour eviter les futurs ajouts accidentels de fichiers locaux, prives, generes ou sensibles.

Les dossiers `uploads/`, `work/`, `audits-raw/`, `audits-extracted/` et `screenshots/` ont ensuite ete retires du suivi Git avec `git rm --cached`.

`assets/audit-bot.js` a aussi ete retire du suivi Git : ce fichier ressemble a un prototype Claude Artifact, depend de `window.claude.complete` et n'est pas reference par les pages publiques.

Attention : cette action retire les fichiers du prochain etat du depot, mais ne retire pas automatiquement les fichiers de l'historique Git deja pousse.

## Dossiers suivis a risque

| Dossier | Fichiers suivis | Risque |
| --- | ---: | --- |
| `uploads/` | 35 | Documents PDF/DOCX, captures et fichiers importes qui ne doivent pas etre exposes directement. |
| `work/` | 26 | Documents de travail, extractions texte et supports internes. |
| `audits-raw/` | 15 | Audits source au format DOCX. |
| `audits-extracted/` | 10 | Extractions texte d'audits, potentiellement sensibles. |
| `screenshots/` | 11 | Captures de conception ou de verification, pas necessaires au site public. |

## Action realisee avant production

Les dossiers prives ont ete retires du suivi Git tout en conservant les fichiers localement :

```bash
git rm --cached -r uploads work audits-raw audits-extracted screenshots
```

Si des informations sensibles ont deja ete poussees sur GitHub, une simple desindexation ne suffit pas a les retirer de l'historique. Il faudra envisager un nettoyage d'historique avec un outil dedie, puis verifier si des secrets ou donnees personnelles doivent etre remplaces, supprimes ou consideres comme exposes.

## Regle de deploiement VPS

Le deploiement ne doit pas envoyer tout le contenu du depot vers le repertoire public Nginx.

Approche recommandee :

- deployer uniquement les fichiers publics necessaires au site ;
- garder les fichiers PDF generes, documents clients, imports et backups hors du webroot ;
- servir les documents prives uniquement via une route backend authentifiee ;
- ne jamais exposer directement `uploads/`, `work/`, `audits-raw/`, `audits-extracted/`, `private/` ou `backups/`.

## Liste blanche publique initiale

Fichiers et dossiers publics probables pour la version statique actuelle :

- `index.html`
- `cas-usage.html`
- `micro-audit.html`
- `micro-audit.js`
- `mentions-legales.html`
- `confidentialite.html`
- `robots.txt`
- `sitemap.xml`
- `assets/` uniquement pour les assets publics verifies
- `cas-usage/` uniquement pour les pages HTML publiques
- `journal/` uniquement pour les articles publics
- `directions/` uniquement si ces pages sont confirmees comme publiques

## Points a verifier avant mise en ligne

- Confirmer quels PDF dans `assets/` sont vraiment publics.
- `assets/audit-bot.js` est conserve localement mais exclu du suivi Git.
- Verifier que `robots.txt` ne remplace pas une vraie protection : bloquer un chemin aux robots n'empeche pas l'acces direct a un fichier.
- Ajouter une politique de conservation des donnees pour les leads, audits et PDF generes.
- Prevoir une sauvegarde chiffree de PostgreSQL et des fichiers prives hors webroot.
