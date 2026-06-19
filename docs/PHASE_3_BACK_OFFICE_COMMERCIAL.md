# Phase 3 - Back-office commercial

Date : 2026-06-18

Objectif : permettre a ALTOS d'exploiter les leads micro-audit sans outil tiers, depuis une interface HTML/admin sobre, dynamique et protegee.

## Statut

Phase 3 avancee, avec un back-office local fonctionnel pour l'exploitation commerciale de base des leads micro-audit.

URL locale :

```text
http://127.0.0.1:3001/admin/login
```

Compte local de test cree dans PostgreSQL Docker :

```text
Email : admin@altos.local
Mot de passe : AltosLocal!2026
```

Ce compte est uniquement pour le developpement local. En production, creer un compte dedie avec un mot de passe fort et un `ADMIN_SESSION_SECRET` long.

## Livrables realises

- Routes admin HTML rendues cote serveur.
- Connexion admin par email + mot de passe.
- Hash des mots de passe avec `scrypt`.
- Sessions admin signees par HMAC.
- Cookie admin `HttpOnly`, `SameSite=Lax`, `Secure` en production.
- Protection CSRF sur les formulaires sensibles.
- Script de creation/mise a jour d'utilisateur admin :

```bash
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="..." npm run admin:create
```

- Liste des leads micro-audit :
  - contact ;
  - statut ;
  - score ;
  - source ;
  - nombre de notes ;
  - lien PDF admin.
- Recherche dans les leads par nom, prenom, email ou telephone.
- Filtres par statut et source.
- Pagination de la liste des leads.
- Export CSV des leads, compatible avec les filtres actifs :

```text
GET /admin/leads/export.csv
```

- Fiche detail lead :
  - coordonnees ;
  - statut commercial ;
  - consentement ;
  - score ;
  - axes ;
  - quick wins ;
  - reponses detaillees du questionnaire ;
  - documents ;
  - notes internes ;
  - journal d'evenements.
- Changement de statut commercial.
- Notes internes.
- Telechargement PDF via route admin protegee :

```text
GET /admin/documents/:id/download
```

- Journalisation :
  - changement de statut ;
  - ajout de note ;
  - telechargement PDF admin.
- Template PDF serveur remplace par un port `jsPDF` de l'ancien generateur navigateur :
  - bandeau noir ;
  - score en grand ;
  - estimation de gain ;
  - cartographie des frictions ;
  - quick wins ;
  - CTA.
- Script de nettoyage des donnees locales de test :

```bash
npm run db:cleanup-test-data
```

## Base de donnees

Migration ajoutee :

```text
server/migrations/002_admin_notes.sql
```

Nouvelle table :

```text
lead_notes
```

Les actions sensibles continuent d'utiliser :

```text
lead_events
```

## Variables d'environnement

Nouvelle variable :

```text
ADMIN_SESSION_SECRET=...
```

Obligatoire en production avec une valeur longue et aleatoire.

## Verification realisee

- `npm run db:migrate` : OK.
- `npm run typecheck` : OK.
- `npm run build` : OK.
- `npm run test:smoke` : OK.
- Rendu PDF `jsPDF` serveur verifie en PNG via PyMuPDF :
  - cas smoke minimal ;
  - cas realiste avec 3 recommandations et 10 reponses.
- Test HTTP admin :
  - `GET /admin/login` : 200 ;
  - `POST /admin/login` : 303 vers `/admin/leads` ;
  - `GET /admin/leads` authentifie : 200 ;
  - `GET /admin/leads?q=...&source=...` authentifie : 200 ;
  - `GET /admin/leads/export.csv?source=...` authentifie : 200 ;
  - `GET /admin/leads/:id` : 200 ;
  - affichage des reponses detaillees : OK ;
  - ajout de note : 303 ;
  - changement de statut : 303 ;
  - telechargement PDF admin : 200 avec en-tete `%PDF`.

## Reste a faire en Phase 3

- Tester visuellement dans Chrome.
- Ajouter 2FA plus tard.
- Durcir la politique d'acces PDF public :
  - aujourd'hui, le visiteur peut telecharger son PDF via l'URL renvoyee apres soumission ;
  - l'admin dispose deja d'une route protegee ;
  - une prochaine amelioration peut ajouter un token public temporaire avec expiration.
- Ajouter une page admin plus nette pour les erreurs 403/404.

## Hors Phase 3

- Back-office editorial : Phase 5.
- Factorisation navigation/footer public : Phase 4.
