# Phase 2 - Micro-audit commercial

Date : 2026-06-18

Objectif : transformer le micro-audit public en vraie collecte commerciale exploitable, stockee dans PostgreSQL.

## Statut

Phase 2 terminee cote code local, avec la collecte et le PDF serveur en place localement.

La soumission du micro-audit public est maintenant branchee sur l'API Fastify locale.

## Livrables realises

- Suppression du stockage `localStorage` comme source de verite.
- Ajout d'une configuration API cote navigateur :
  - local : `http://127.0.0.1:3001/api` ;
  - production : `/api`.
- Construction d'un payload complet :
  - contact ;
  - telephone obligatoire ;
  - consentement ;
  - reponses detaillees ;
  - score total ;
  - axes ;
  - profil dominant ;
  - quick wins ;
  - estimation ROI ;
  - source `micro_audit_web`.
- Envoi vers `POST /api/micro-audits`.
- Affichage du bilan uniquement apres reponse API positive.
- Message d'erreur si l'API ne peut pas enregistrer la demande.
- Texte de consentement harmonise avec l'enregistrement serveur.
- Email et telephone obligatoires cote formulaire et cote API :
  - sans ces informations, la soumission est rejetee ;
  - le bilan et le PDF ne sont affiches qu'apres enregistrement API reussi.
- Politique de confidentialite mise a jour :
  - donnees nominatives du micro-audit explicitees ;
  - conservation alignee sur 12 mois.
- Generation PDF cote serveur avec `jsPDF`.
- Template PDF serveur aligne sur le PDF navigateur initial :
  - synthese visuelle ;
  - score ;
  - heatmap ;
  - quick wins ;
  - CTA.
- Stockage des PDF dans `DOCUMENTS_PRIVATE_DIR`, hors webroot.
- Creation d'une ligne `documents` rattachee au lead et au micro-audit.
- Telechargement du PDF via `GET /api/documents/:id/download`.
- Le bouton public de telechargement utilise maintenant le PDF serveur quand il est disponible, avec l'ancien PDF navigateur en secours.
- Notification email interne optionnelle via SMTP :
  - service `server/src/services/notifications.ts` ;
  - variables `SMTP_*`, `NOTIFICATION_FROM`, `NOTIFICATION_TO` ;
  - la soumission ne bloque pas si le SMTP n'est pas configure.

## Verification realisee

- `node --check micro-audit.js` : OK.
- `GET /api/health` : OK, `database.ok: true`.
- Test HTTP avec header `Origin: http://127.0.0.1:8080` : OK.
- Reponse API `POST /api/micro-audits` : `201`.
- Header CORS confirme :
  - `access-control-allow-origin: http://127.0.0.1:8080`.
- Verification PostgreSQL :
  - lignes creees avec `source = micro_audit_web`.
- Verification PDF serveur :
  - reponse `POST /api/micro-audits` avec `documentId` et `pdfUrl` ;
  - telechargement du PDF via l'API ;
  - fichier retourne avec en-tete `%PDF`.
- `npm run test:smoke` : OK avec verification `leads`, `micro_audits`, `lead_events` et `documents`.
- Verification de coherence RGPD :
  - `confidentialite.html` ne dit plus que le micro-audit est anonyme ;
  - duree de conservation micro-audit alignee sur le formulaire.

## Reste a faire en Phase 2

- Tester le parcours complet dans Chrome en remplissant le vrai formulaire.
- Tester le telechargement PDF dans Chrome via le vrai formulaire.
- Configurer le SMTP reel sur le VPS pour activer la notification interne.
- Reprendre le moteur de scoring/recommandations selon `docs/SPEC_MICRO_AUDIT_SCORING.md`.
- Contrainte pour cette reprise : aucun changement visuel du resultat public ni du PDF, uniquement une meilleure logique automatique.
- Faire recalculer a terme le score et les recommandations cote serveur pour que l'API soit la source de verite.
- Ajouter des tests de differenciation entre plusieurs profils de reponses.
- Durcir l'acces PDF public dans une iteration suivante :
  - lien opaque temporaire ou session admin selon usage ;
  - journalisation des consultations.
- Nettoyer les donnees de test locales si necessaire.

## Hors Phase 2

- Back-office commercial : Phase 3.
- Navigation/footer dynamiques : Phase 4.
- Back-office editorial : Phase 5.
