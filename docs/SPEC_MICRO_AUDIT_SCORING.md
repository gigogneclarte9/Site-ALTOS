# Specification - scoring et recommandations micro-audit

Date : 2026-06-19

Statut : specification avant implementation.

## Objectif

Le micro-audit doit produire automatiquement un bilan utile, credible et exploitable commercialement a partir des 10 reponses du prospect.

Il ne doit pas etre un simple generateur de 3 recommandations generiques. Il doit aider a :

- identifier les frictions operationnelles dominantes ;
- qualifier le niveau d'opportunite IA / automatisation ;
- proposer des quick wins coherents avec les reponses ;
- donner a ALTOS une base de relance commerciale dans l'admin ;
- fournir au prospect un PDF immediatement utile.

Le micro-audit reste une premiere lecture. Il ne remplace pas un audit flash IA complet.

## Contrainte visuelle obligatoire

Cette iteration ne doit pas changer le rendu visuel :

- pas de refonte de `micro-audit.html` ;
- pas de changement de mise en page du resultat affiche sur le site ;
- pas de changement de design du PDF ;
- pas de nouveau bloc visuel ;
- pas de modification de la structure graphique existante.

Le travail porte uniquement sur le moteur automatique :

- calcul du score ;
- choix du profil ;
- selection des recommandations ;
- coherence du payload stocke ;
- coherence entre resultat site, PDF et admin.

Le contenu affiche dans les emplacements existants peut changer si le moteur produit un meilleur resultat, mais la forme visuelle doit rester identique.

## Intention commerciale

Le questionnaire sert a detecter des signaux de valeur pour ALTOS :

- perte de temps administrative ;
- ressaisie et dispersion des donnees ;
- absence de pilotage temps reel ;
- friction commerciale ou sourcing manuel ;
- production de contenu irreguliere ;
- surcharge documentaire ;
- faible maturite IA ;
- blocages perçus ;
- pression dirigeant.

Le resultat doit permettre de repondre a trois questions :

1. Le prospect a-t-il une opportunite d'automatisation significative ?
2. Quel axe doit etre traite en premier ?
3. Quel quick win est le plus credible pour ouvrir une discussion ?

## Problemes constates dans l'algorithme actuel

- Le moteur force toujours 3 quick wins.
- La bibliotheque de recommandations est courte.
- Des parcours differents peuvent produire des bilans tres proches.
- Un score faible peut quand meme produire des recommandations ambitieuses.
- Les recommandations secondaires sont parfois choisies par defaut, pas par signal fort.
- Avant reprise, le serveur ne recalculait pas le score et faisait confiance au payload navigateur.

## Principes cibles

### 1. Niveau global d'opportunite

Le score total reste sur 30 pour conserver le rendu existant.

Interpretation cible :

```text
0-6   : opportunite faible / maturite deja correcte
7-13  : opportunite moderee
14-21 : opportunite forte
22-30 : opportunite critique
```

Ces seuils ne changent pas le design. Ils servent a choisir le ton des recommandations et a eviter un bilan trop alarmiste ou trop generique.

### 2. Axes metiers

Axes conserves :

- `admin`
- `data`
- `commercial`
- `documents`
- `ia`
- `pain`
- `blocker`

Axes actionnables principaux :

- `admin`
- `data`
- `commercial`
- `documents`

Axes de contexte :

- `ia` : niveau de maturite IA ;
- `pain` : urgence ressentie ;
- `blocker` : frein a lever avant mission.

Le profil principal doit rester choisi parmi les axes actionnables, mais les axes de contexte doivent influencer les messages et les recommandations.

### 3. Cas score faible

Si le score est faible, le bilan ne doit pas pousser artificiellement trois chantiers.

Comportement attendu :

- garder 3 emplacements visuels pour ne pas changer le design ;
- utiliser un ton plus prudent ;
- proposer plutot :
  - maintien / consolidation ;
  - verification rapide ;
  - opportunite ponctuelle ;
  - cadrage leger.

Exemple d'intention :

```text
Votre niveau de friction semble contenu. Le gain potentiel existe surtout sur des optimisations ciblees, pas sur une refonte complete.
```

### 4. Recommandations conditionnelles

Chaque recommandation doit etre declenchee par un signal clair.

Exemples :

- `admin` si `admin_hours` ou `data_resaisie` sont eleves.
- `data` si `data_central` ou `dashboard` sont eleves.
- `commercial` si `prospect` est eleve.
- `content` si `content` est eleve.
- `documents` si `docs` est eleve.
- `ia` si `ia_maturity` montre une faible maturite.
- `blocker` doit orienter la recommandation :
  - temps : mission courte et cadree ;
  - competence : transfert / formation ;
  - cout / ROI : cadrage business case ;
  - RGPD / securite : approche donnees et gouvernance.

### 5. Recommandations secondaires

Les recommandations secondaires ne doivent plus etre de simples remplissages.

Regle cible :

- recommandation 1 : axe prioritaire reel ;
- recommandation 2 : second axe avec signal suffisant ou recommandation de contexte ;
- recommandation 3 : levier d'activation, d'acculturation ou de cadrage selon maturite IA / frein.

Si aucun signal secondaire n'est fort, utiliser une recommandation de consolidation plutot qu'un chantier artificiel.

### 6. Coherence site / PDF / admin

Le site, le PDF et l'admin doivent afficher le meme resultat logique.

Le payload stocke doit contenir :

- reponses detaillees ;
- score total ;
- score par axe ;
- niveau global ;
- axe prioritaire ;
- recommandations retenues ;
- raison de selection des recommandations, meme si cette raison n'est pas affichee publiquement ;
- version du moteur de scoring.

La version du moteur permettra de savoir avec quelle logique un micro-audit ancien a ete calcule.

### 7. Calcul cote serveur

La cible est de recalculer le score et les recommandations cote serveur a partir des reponses.

Le serveur doit etre la source de verite au moment de la soumission.

Objectifs :

- eviter un score falsifie dans le payload ;
- garantir que le PDF correspond aux reponses stockees ;
- garder une logique testable ;
- faciliter les evolutions futures sans dupliquer trop de code.

## Regles de non-regression

Avant validation :

- le parcours public doit rester identique visuellement ;
- le bouton PDF doit toujours telecharger un PDF serveur ;
- le PDF doit garder le design actuel ;
- l'admin doit continuer a afficher coordonnees, score, axes, quick wins et PDF ;
- le smoke test API doit passer ;
- un test doit verifier au moins deux jeux de reponses tres differents ;
- les recommandations des deux jeux de test doivent etre differentes ;
- un cas score faible doit etre couvert.

## Jeux de test minimaux

### Cas faible friction

Objectif : verifier qu'un prospect peu frictif ne recoit pas un bilan dramatise.

Attendu :

- score bas ;
- ton prudent ;
- recommandations de consolidation ou optimisation ciblee.

### Cas administratif

Objectif : verifier que les pertes de temps et doubles saisies menent a un axe `admin`.

Attendu :

- profil admin ;
- recommandation automatisation admin / doubles saisies.

### Cas data

Objectif : verifier que dispersion des donnees et absence de dashboard menent a un axe `data`.

Attendu :

- profil data ;
- recommandation hub de donnees / tableau de bord.

### Cas commercial

Objectif : verifier que sourcing manuel et contenu irregulier menent a un axe `commercial` ou `content`.

Attendu :

- recommandation qualification commerciale ou studio contenu selon les reponses.

### Cas maturite IA faible

Objectif : verifier que l'acculturation IA apparait quand elle est vraiment pertinente.

Attendu :

- recommandation IA si maturite faible ;
- pas de recommandation IA automatique si plusieurs cas d'usage sont deja en production.

## Hors perimetre de cette iteration

- Refonte UI du micro-audit.
- Refonte graphique du PDF.
- Ajout de nouvelles pages.
- Back-office editorial.
- Connexion a un outil tiers.
- Utilisation de n8n ou d'un SaaS externe comme source de verite.
