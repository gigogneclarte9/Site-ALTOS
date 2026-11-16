# Plan SEO des trois pages offres ALTOS

Analyse du 16 novembre 2026. Ordre de travail conservé : **Audit IA, Agents IA, Automatisation**, puis page Occitanie. Les trois pages répondent déjà aux thèmes recherchés et possèdent une base éditoriale solide. L’amélioration proposée consiste à préciser la prestation, montrer des livrables et des réalisations, puis répondre aux questions de choix et de budget. Ajouter des définitions ou multiplier les pages sur les mêmes mots ne constitue pas la priorité.

**Précisions confirmées par l’utilisateur :** micro-audit gratuit par quiz ; premier diagnostic gratuit de 30 minutes pour établir le contact ; audit complet payant de cinq jours. Ces offres ne sont pas contradictoires. La mention erronée d’une journée dans la note du quiz est corrigée localement. Aucun montant ni grille tarifaire ajouté. Les [textes retenus pour Audit IA](PROPOSITION_TEXTES_AUDIT_IA_2026-11-16.md) sont intégrés et prévalent sur les formulations initiales ci-dessous. Les deux autres offres expliquent les postes de coûts et le suivi à convenir, sans promettre de forfait ou de maintenance inclus.

**État au 16 novembre : les trois pages offres sont publiées en 0.4.13 depuis 16 h 41 min 58 s (Paris).** [Compte rendu de déploiement](suivi/2026-11-16-avant-0.4.13/DEPLOIEMENT.md) et [référence avant/après](suivi/2026-11-16-avant-0.4.13/README.md). Le plan initial ci-dessous est conservé comme référence ; le bilan suivant indique ce qui a réellement été intégré. Le [contrôle technique](AUDIT_SEO_TECHNIQUE_2026-11-16.md) n’a identifié aucun blocage majeur sur les 20 pages du sitemap public ; les cinq exclusions Google restent à qualifier séparément.

## Bilan de l’intégration locale

**Les quatre corrections relevées sont appliquées et déployées.** CSS ajouté à la liste de déploiement, grille Audit IA corrigée, domaine de l’image sociale rectifié et CTA de la page des cas harmonisé. Les constats de l’audit ci-dessous sont conservés comme historique ; contrôle navigateur encore à réaliser.

- **Audit IA** : textes retenus intégrés, trois formats distincts, livrables et exemple patrimoine détaillés, huit FAQ alignées avec le JSON-LD. Mention d’une journée corrigée dans le quiz.
- **Agents IA** : introduction centrée sur les missions, cas livré du cabinet de recrutement placé avant les définitions, contenu d’un projet, pilotage quotidien et postes de coûts. Le délai de prototype reste conditionnel et distinct de la production. Aucun tarif ni engagement de support ajouté ; les modalités sont à convenir.
- **Automatisation** : cas des bilans avant/après, flux en quatre étapes, choix du premier processus, tableau des intégrations, transmission et exploitation. Mesure du retour détaillée jusqu’à la relecture et aux corrections. Titre et formulation du H1 conservés.
- **Maillage** : ancres `cas-usage.html#mission-cabinet-recrutement` et `cas-usage.html#mission-bilans-services-personne`, avec liens réciproques vers les offres. Descriptions de partage et meta description de la page des cas resserrées. Les contenus restent fondés sur les deux sources internes citées plus bas.
- **Cohérence technique** : title, descriptions et WebPage alignés ; huit questions visibles et structurées identiques sur chaque page offre ; dates des cinq pages modifiées alignées dans le sitemap. URL et canonical conservées, navigation et pied de page synchronisés.

**Choix sur les chiffres :** aucune nouvelle mise en avant des 70 % du recrutement, faute de détail de mesure vérifié. Pour les bilans, la source interne indique « 5 h → 15 min » avec un périmètre mentionnant la collecte, la saisie et la rédaction de deux bilans, tandis que la page publique indique « par bilan complet ». Le nouveau texte décrit donc le flux sans reprendre ce chiffre. Les statistiques historiques de la page des cas restent à clarifier avec le bilan de mission ; elles ne sont pas utilisées comme nouvelles preuves de performance. La validation avant diffusion des bilans est présentée comme un contrôle à prévoir pour le projet du lecteur, sans inventer une étape livrée dans le cas source.

**Contrôles effectués :** cinq pages en HTTP 200 local, structure HTML et identifiants, 223 occurrences de liens/ressources locales et leurs ancres, JSON-LD, métadonnées des trois offres, FAQ, configuration déclarative des liens Cal.com, sitemap XML de vingt URL et composants partagés. Résultats dans `../../../output/seo-offres-2026-11-16/verification.json`.

**Vérifications restantes après publication :** inspection visuelle ordinateur/mobile, tableau défilant, accès aux missions et ouverture du calendrier. L’accès navigateur automatisé est indisponible ; les contrôles de fichiers ne valident pas le rendu ni le fonctionnement du calendrier externe. Les fichiers servis sont conformes au commit publié ; aucun effet SEO n’est encore mesuré.

## Plan initial — référence éditoriale

### Contrôle complémentaire local SEO, SMO et GEO — 16 novembre 2026

**Suivi des corrections autorisées après cet audit :**

- `deploy/public-allowlist.txt` comprend maintenant `assets/offer-details.css`. Toutes les feuilles de style locales chargées par les trois pages offres figurent dans la liste publique.
- `.proof-grid.audit-other-proofs` est plus spécifique que `.proof-grid` : la règle de deux colonnes au-dessus de 900 px prévaut désormais. Les règles mobiles à une colonne restent applicables.
- `assets/og-default.png` a été retouché avec l’outil intégré `image_gen`. Instruction : remplacer le texte inférieur droit « ALTOS.FR » par « ALTOS-EXPERTS.FR », en conservant les autres textes, couleurs et la composition. Le domaine corrigé a été inspecté visuellement. L’export natif est de 1731 × 909 pixels, 1 284 245 octets ; les dimensions Open Graph et les textes alternatifs Open Graph/X des 22 pages qui partagent cette image sont alignés. Le visuel reste générique. Original sauvegardé dans `../../../output/seo-offres-2026-11-16/og-default-avant-correction.png`.
- Le CTA de `cas-usage.html` propose un premier échange gratuit de 30 minutes, sans engagement, et réserve la feuille de route à l’audit complet payant de cinq jours.

Contrôles après correction : configuration de déploiement, sélecteur CSS, texte du CTA, image servie en HTTP 200 et conforme au fichier, dimensions/alternatives des 22 pages, puis nouvelle exécution des contrôles des cinq pages, liens, FAQ/JSON-LD, canonical, sitemap et composants partagés. Résultats dans `../../../output/seo-offres-2026-11-16/corrections-verifiees.json`. Aucun test de rendu navigateur ni de calendrier externe ajouté ; aucune publication.

**Constats historiques de l’audit avant correction :**

Périmètre principal : Audit IA, Agents IA, Automatisation. Vérification des pages liées du micro-audit et des cas pour les liens et la cohérence du parcours. Relecture des fichiers et des réponses HTTP locales, inspection de l’image de partage, examen des règles CSS et de la liste de déploiement. Aucun changement HTML, CSS, JavaScript ou de configuration pendant cet audit. Preuves détaillées : `../../../output/seo-offres-2026-11-16/audit-seo-smo-geo-local.json` ; script de contrôle dans le même dossier.

| Axe | Appréciation locale | Éléments vérifiés |
| --- | --- | --- |
| SEO | Socle technique et éditorial cohérent | HTTP 200, un H1, titres/descriptions distincts, canonical propres, robots autorisant l’exploration, liens internes accessibles, sitemap cohérent, contenu disponible dans le HTML initial |
| SMO | Métadonnées présentes, visuel à corriger | Champs Open Graph requis, descriptions de partage et cartes X présents ; URL absolues cohérentes ; PNG réel de 1200 × 630, 64 137 octets ; domaine affiché dans le visuel incohérent |
| GEO | Contenu exploitable et structuré, efficacité non mesurable localement | Réponses directes, auteur identifié, services distincts, cas reliés à leurs sources, résultats livrés distingués des projections, JSON-LD cohérent avec le texte |

**Mesures par page :**

| Page | Title (caractères) | Description (caractères) | FAQ visible/JSON-LD | HTML (octets) |
| --- | ---: | ---: | ---: | ---: |
| Audit IA | 65 | 147 | 8 réponses identiques | 36 416 |
| Agents IA | 55 | 148 | 8 réponses identiques | 40 169 |
| Automatisation | 57 | 149 | 8 réponses identiques | 40 682 |

Les longueurs sont des mesures descriptives, pas des seuils de classement. Les octets HTML ne constituent pas une mesure de vitesse ou des Core Web Vitals. Aucun score SEO/GEO arbitraire n’est attribué.

**Points à traiter, par priorité :**

1. **Avant publication — omission introduite dans ce lot :** `assets/offer-details.css`, chargé par Agents IA et Automatisation, est absent de `deploy/public-allowlist.txt`. Le script `deploy/deploy.sh` ne copie que les éléments de cette liste : le nouveau style ne serait donc pas livré par ce chemin de déploiement. Ajouter le fichier avant de préparer une release. Fonctionne actuellement en local parce que le serveur sert directement le dossier de travail.
2. **SMO — défaut préexistant :** `assets/og-default.png` affiche `ALTOS.FR` alors que les canonical pointent vers `www.altos-experts.fr`. Corriger le domaine visible. Le même visuel généraliste sert les trois offres ; des visuels par offre seraient un perfectionnement facultatif. Les `og:image:alt` décrivent actuellement les offres plutôt que le contenu exact de cette image commune ; `twitter:image:alt` est absent.
3. **Présentation — défaut introduit dans ce lot :** dans `assets/audit-page.css`, `.audit-other-proofs` prévoit deux colonnes au-dessus de 900 px, mais la règle `.proof-grid` située après, de même spécificité, rétablit trois colonnes. Deux cartes occupent ainsi une grille prévue pour trois. Corriger l’ordre ou la spécificité ; constat tiré de la cascade CSS, pas d’une capture navigateur.
4. **Cohérence commerciale — défaut préexistant de la page liée :** le CTA de `cas-usage.html` promet encore une feuille de route lors des 30 minutes. Ce texte doit être aligné sur le premier échange gratuit confirmé par l’utilisateur. Les trois pages offres ne font pas cette promesse.
5. **Preuves — approfondissement documentaire :** les gains historiques des missions restent affichés sur la page des cas. Les 70 % du recrutement ne disposent pas ici d’un relevé brut de mesure ; pour les bilans, la source mentionne deux bilans tandis que la page publique parle d’un bilan complet. Les nouveaux blocs n’utilisent pas ces chiffres, mais leurs destinations liées restent à clarifier. Ne pas remplacer par un chiffre inventé.

**Observations secondaires :** les titres du pied de page partagé passent de H2 à H4, alors que le corps éditorial suit H1/H2/H3 ; amélioration sémantique possible, non bloquante pour le référencement. Les trois graphes JSON-LD se parsèrent correctement, sans référence interne non résolue. Le champ `Organization.logo` utilise l’image promotionnelle générale : un véritable logo constituerait une représentation plus précise. Ce contrôle n’est pas une certification par un validateur externe Schema.org.

**Références officielles consultées :** les champs fondamentaux de partage sont décrits dans le [protocole Open Graph](https://ogp.me/). Google confirme que les [fonctionnalités IA de recherche](https://developers.google.com/search/docs/appearance/ai-features) reposent sur les fondamentaux SEO et ne requièrent pas de balisage GEO spécial ; leur apparition n’est pas garantie. Les FAQ restent utiles au lecteur et leurs données correspondent au contenu, mais les résultats enrichis FAQ ont été supprimés de Google depuis le 7 mai 2026, selon le [journal officiel des mises à jour](https://developers.google.com/search/updates). Ne pas vendre leur balisage comme un moyen d’obtenir ces résultats enrichis.

**Limites :** aucune observation du rendu complet ordinateur/mobile, aucun test de vitesse navigateur, aucune ouverture du calendrier externe, aucune prévisualisation réelle LinkedIn/Facebook/X. Les plateformes ne peuvent pas récupérer cette version sur localhost. Les robots locaux autorisent Googlebot, Bingbot, OAI-SearchBot et PerplexityBot, mais cela ne prouve ni l’accès en production via l’hébergeur ni l’indexation. Aucun classement, clic supplémentaire ou citation IA ne peut être mesuré sur ces modifications non publiées.

### Analyse initiale conservée

## Données et limites de la comparaison

L’[export Search Console conservé](../../../output/reprise-altos-2026-11-13/altos-experts.fr-Performance-on-Search-2026-11-13.zip) couvre le **11 août au 10 novembre 2026**, soit 92 jours : 1 455 impressions et 18 clics. Les tableaux ont été relus et leurs totaux contrôlés. Les [données extraites](../../../output/seo-ciblage-2026-11-16/donnees-search-console.json) conservent les lignes sources et l’empreinte du ZIP.

| Page | Impressions | Clics | CTR exporté | Position moyenne |
| --- | ---: | ---: | ---: | ---: |
| Audit IA | 720 | 2 | 0,28 % | 77,08 |
| Agents IA | 339 | 1 | 0,29 % | 45,14 |
| Automatisation | 83 | 0 | 0 % | 61,89 |

Ces positions sont des moyennes historiques, pas des classements actuels. Le tableau des 79 recherches visibles ne restitue que 2 des 18 clics. Les tableaux « Pages » et « Requêtes » sont séparés : **l’export ne permet pas d’affirmer quelle page apparaît pour chaque recherche**, ni de démontrer une concurrence entre deux pages ALTOS. Les associations proposées ci-dessous sont des choix éditoriaux, à vérifier ensuite avec un filtre page + requête dans Search Console.

Les recherches web du 16 novembre portent sur `audit ia pme`, `diagnostic ia tpe`, `agent ia pme` et `automatisation processus pme`, complétées par des recherches de prestations et de présence régionale. Le [journal des recherches principales](../../../output/seo-ciblage-2026-11-16/recherches.json) conserve les URL retournées. Les pages comparées proviennent de ces résultats. L’outil ne fournit pas un relevé certifié de positions Google France localisé en Occitanie : aucun rang, volume mensuel ou niveau chiffré de difficulté n’est attribué aux concurrents.

## Recherches à affecter aux pages

| Page cible proposée | Recherche observée | Impressions | Position | Usage dans le contenu |
| --- | --- | ---: | ---: | --- |
| Audit IA | audit ia pme | 64 | 84,42 | Intention commerciale principale |
| Audit IA | audit intelligence artificielle pme | 19 | 90,32 | Variante naturelle dans la définition |
| Audit IA | audit ia entreprise | 26 | 98,58 | Variante secondaire, en conservant le public TPE/PME |
| Audit IA | diagnostic ia tpe | 109 | 64,86 | Expliquer le diagnostic accompagné et orienter vers le test si c’est l’attente |
| Audit IA | diagnostic ia pme | 53 | 94,75 | Même distinction entre échange, test et prestation |
| Micro-audit, lors de son lot | test ia tpe | 59 | 80,02 | Auto-évaluation en ligne, distincte de l’audit accompagné |
| Micro-audit, lors de son lot | test ia pme | 31 | 94,97 | Même intention de test |
| Agents IA | agent ia pme | 196 | 44,89 | Intention principale |
| Agents IA | agent ia pour pme | 28 | 66,57 | Variante à couvrir naturellement |
| Agents IA | pilotage des agents ia | 36 | 42,39 | Section supervision, coûts et maintenance |
| Agents IA | agent ia tpe | 4 | 75,25 | Conserver l’adaptation aux petites structures |
| Automatisation | automatisation tâches pme | 30 | 85,40 | Exemples de tâches et gains par processus |
| Automatisation | automatisation processus pme | 10 | 25,70 | Intention principale de la page |
| Automatisation | automatisation intelligente processus pme | 3 | 74,33 | Différence entre règles et IA |

La position 25,70 sur « automatisation processus pme » mérite un suivi, mais repose sur dix impressions : elle ne justifie pas à elle seule de bouleverser l’ordre convenu. Les recherches à une impression, comme « développement agent ia pme », ne permettent pas de conclure à une opportunité de classement solide.

**Questions complémentaires à traiter, sans volume démontré par cet export :** prix d’un audit, coût mensuel d’un agent, maintenance, documents à préparer, intégration aux outils existants. Leur intérêt repose sur la décision d’achat et sur les pages comparées, pas sur un volume de recherche mesuré.

Ne pas créer de nouvelles pages quasi identiques « diagnostic IA », « audit IA PME » et « audit IA TPE ». Les variantes peuvent être traitées dans les pages existantes. La requête « agence Airtable Montpellier » apparaît 18 fois, mais ne suffit pas à justifier une nouvelle offre ou une implantation à Montpellier.

## Ce que montrent les pages concurrentes

Les observations portent sur la présentation des offres. Elles ne valident pas les performances, chiffres clients, certifications ou promesses des prestataires, et ne prouvent pas pourquoi Google les classe.

| Page examinée | Élément concret observé | Conséquence proposée pour ALTOS |
| --- | --- | --- |
| [Waai, audit IA](https://www.waai.co/audit) | Plusieurs niveaux d’accompagnement, chacun avec durée, prix et restitution ; contenu du rapport détaillé | Rendre immédiatement lisible la différence entre premier échange et audit, puis montrer un livrable |
| [Robinswood, audit](https://robinswood.io/en/audit-ia-pme-eti) | Périmètre centré sur un flux critique, prérequis, décision attendue et lien vers un exemple de livrable ; la page ouverte a redirigé vers l’anglais | Expliquer pour qui l’audit est adapté, ce qu’il examine et la décision qu’il permet |
| [IArama](https://iarama.fr/) | Auto-diagnostic gratuit, score et aperçu des résultats | « Diagnostic » peut signifier test en ligne ; distinguer ce parcours de la prestation accompagnée |
| [Vizionaire, agents IA](https://vizionaire.eu/agent-ia-pme/) | Coût initial et coûts récurrents séparés, délai, maintenance, démonstration explicitement fictive | Détailler la prestation livrée et son fonctionnement dans la durée ; identifier le statut de toute démonstration |
| [Xavier Bostem, agents IA](https://www.xavierbostem.com/agent-ia-entreprise/) | Missions décrites avec des tâches concrètes, cadrage puis mise en place et suivi | Partir d’une mission compréhensible avant d’expliquer l’architecture |
| [Talos, automatisation](https://agencetalos.fr/solutions/automatisation-des-processus/) | Parcours de devis illustré, tâches regroupées par besoin, intégration et suivi explicités | Dérouler un flux avant/après et expliquer ce qui est remis au client |
| [ogweb, guide automatisation](https://ogweb.fr/publications/automatisation-processus-metier-tpe-pme/) | Article organisé autour du choix d’un premier processus et d’un workflow complet | Ajouter une aide courte à la priorisation dans la page commerciale, sans la transformer en article généraliste |

La recherche « automatisation processus pme » renvoie aussi des guides. Conserver une explication utile et des exemples est donc pertinent. Pour les agents, l’échantillon mélange annuaires et prestataires : ALTOS doit rendre explicite son accompagnement sur mesure, sans devenir un catalogue de logiciels.

## Première page à retravailler Audit IA

Fichier : [audit-ia-tpe-pme.html](../../audit-ia-tpe-pme.html). Requête principale : **audit IA PME**, avec variantes TPE et diagnostic accompagné.

### Ce qui est déjà présent

Définition, six problèmes métiers, méthode en cinq étapes, quatre familles de livrables, priorisation, cas d’audit, FAQ et auteur identifié. Les livrables ne sont donc pas absents : ils sont décrits, mais aucun extrait de restitution n’est montré dans la page. L’Aude et l’Occitanie sont déjà mentionnées dans le périmètre.

### Modifications proposées dans l’ordre

1. **Clarifier les formats près de l’introduction.** Présenter les trois entrées confirmées : quiz gratuit, premier diagnostic gratuit de 30 minutes, audit complet payant de cinq jours. Corriger la seule référence à une journée dans la note du quiz. Le rendez-vous reste l’action principale de la page offre.
2. **Rendre un livrable visible.** Renommer la section existante « Ce que vous recevez à la fin de l’audit IA ». Ajouter une petite restitution anonymisée issue d’un cas déjà publié : tâche observée, volume, scénario envisagé, gain projeté, dépendances et critère de mesure. Un exemple pédagogique doit être étiqueté comme tel ; le PDF du micro-audit ne doit pas être présenté comme le livrable de l’audit accompagné.
3. **Préciser le périmètre et la préparation.** Indiquer les interlocuteurs nécessaires, exemples de documents utiles et accès à discuter. Expliquer ce qui relève de l’étude et ce qui relève d’une mise en œuvre ultérieure.
4. **Préciser seulement le caractère payant de l’audit.** Aucun montant, forfait ou grille tarifaire dans ce lot. Une présentation du budget reste facultative et relève de la décision commerciale, pas d’une obligation SEO.
5. **Compléter les preuves.** Conserver les cas d’audit et leur statut de projections ; ajouter un lien vers une mission livrée montrant le passage du diagnostic à la réalisation, sans attribuer au seul audit le résultat du déploiement.
6. **Préciser l’intervention régionale.** Remonter une phrase factuelle sur l’implantation dans l’Aude et l’intervention en Occitanie, avec modalités sur place/à distance à confirmer pour le bloc détaillé. Garder la portée nationale de l’URL.

### Proposition de texte

- **Title :** Audit IA TPE et PME : diagnostic et feuille de route | ALTOS
- **H1 :** Audit IA pour TPE et PME : identifiez vos priorités d’automatisation.
- **Description :** Audit IA pour TPE et PME : analyse des processus, cas d’usage priorisés et feuille de route. ALTOS, basé dans l’Aude, intervient en Occitanie et en France.
- **Introduction :** « Quelles tâches de votre entreprise méritent d’être automatisées, avec quels outils et dans quel ordre ? ALTOS analyse vos processus et vos données pour construire une feuille de route adaptée à vos contraintes. Vous disposez de cas d’usage priorisés, de leurs prérequis et de critères pour mesurer les résultats. »

Les sections existantes « Méthode » et « Arbitrage » restent utiles. La FAQ précise la durée de cinq jours, la gratuité du rendez-vous de 30 minutes et la différence avec le quiz gratuit. Une question sur le budget n’est pas retenue dans ce premier lot. Toute réponse modifiée devra rester identique dans le texte visible et le JSON-LD.

## Deuxième page Agents IA

Fichier : [agents-ia-pme.html](../../agents-ia-pme.html). Requête principale : **agent IA PME**. Intention secondaire : pilotage des agents.

### Ce qui est déjà présent

Six usages, distinction chatbot/assistant/automatisation/agent, méthode de conception, permissions, validations, évaluation continue, FAQ et références institutionnelles. Le prototype en 7 à 14 jours est déjà distingué de la production dans la FAQ. Ces éléments doivent être conservés, sans ajouter une nouvelle couche de définitions.

### Modifications proposées dans l’ordre

1. **Commencer par les missions.** Faire apparaître dès l’introduction qualification des demandes, recherche documentaire et préparation de réponses, avec une phrase indiquant qu’ALTOS cadre et construit la solution. Déplacer les précautions détaillées dans les sections déjà prévues.
2. **Montrer un cas livré.** Réutiliser le cabinet de recrutement décrit dans les [sources du projet](../../cas-usage/04-cabinet-recrutement.md) et sur la page des cas. Dérouler : offres d’emploi collectées, qualification des opportunités par critères, centralisation Airtable, contrôle par l’équipe. Il s’agit de prospection d’opportunités pour le cabinet, pas de sélection automatique de candidats. Le gain de 70 % est publié sur le sourcing et tri initial ; conserver ce périmètre et confirmer sa mesure avant une nouvelle mise en avant.
3. **Décrire le contenu du projet.** Ajouter « Ce que comprend un premier projet d’agent IA » : mission, connexions, exemples de test, interface de contrôle, documentation et prise en main. Décrire les livrables réellement proposés ; ne pas inventer un forfait standard.
4. **Développer le pilotage au quotidien.** Compléter la section de contrôle : responsable de suivi, reprise après erreur, évolution des règles et mesure de la qualité. Distinguer cette organisation de la seule sécurité des accès, déjà bien expliquée.
5. **Expliquer les coûts.** Séparer cadrage/construction, hébergement, consommation des modèles et maintenance. Préciser dans le futur texte ce qui est inclus et ce qui dépend du volume, sans promettre un hébergement, une propriété du code ou un contrat de support non confirmés.

### Proposition de texte

- **Title :** Agent IA pour PME : cas concrets et déploiement | ALTOS
- **H1 :** Agents IA pour TPE et PME : des missions concrètes dans vos outils.
- **Description :** Qualification des demandes, recherche documentaire, réponses préparées : ALTOS conçoit des agents IA pour TPE et PME, avec contrôle humain et suivi.
- **Introduction :** « Un agent IA peut qualifier une demande, rechercher une information dans vos documents ou préparer une réponse à partir de vos données. ALTOS définit la mission, les outils accessibles et les validations nécessaires, puis construit un prototype à tester avec votre équipe. »

Ajouter à la FAQ « Quels coûts faut-il prévoir ? » et « Qui supervise l’agent après sa mise en service ? ». Conserver la distinction prototype/production à proximité de la promesse de délai, et pas seulement en bas de page.

## Troisième page Automatisation

Fichier : [automatisation-processus-pme.html](../../automatisation-processus-pme.html). Requête principale : **automatisation processus PME**, variante « automatisation tâches PME ».

### Ce qui est déjà présent

Le H1 et l’introduction sont déjà centrés sur le besoin. La page couvre tâches, outils existants, règles/IA, méthode, fiabilité, délai et mesure du retour. Le maillage vers les cas et les articles existe. Il faut enrichir la démonstration et la prestation, sans réécrire la page entière.

### Modifications proposées dans l’ordre

1. **Ajouter un flux avant/après.** Réutiliser les [bilans des services à la personne](../../cas-usage/01-services-personne.md) : collecte des données, préparation du bilan, génération et validation. Le résultat publié est de cinq heures à quinze minutes par bilan complet ; conserver son unité, la tâche concernée et la validation humaine. Ne pas reprendre automatiquement les projections de ROI annuel.
2. **Ajouter une grille courte de choix du premier processus.** Fréquence, temps manuel, stabilité des règles, données disponibles, erreurs et gravité d’un échec. L’objectif est d’aider le dirigeant à choisir un premier sujet, sans créer un nouveau simulateur.
3. **Détailler les intégrations.** Proposer un tableau « outil existant / échange nécessaire / limite à vérifier » : messagerie, fichiers, CRM, ERP. n8n et Make sont déjà cités ; ne pas ajouter une liste de marques sans cas ou capacité réelle.
4. **Préciser la remise et l’exploitation.** Compléter la méthode existante avec documentation, prise en main, surveillance et maintenance à définir contractuellement. Ajouter la distinction coût de mise en place/coût d’exploitation.
5. **Renforcer les preuves déjà accessibles.** Ajouter les missions livrées utiles aux côtés des projections SAV et commandes. Le cas de la foncière illustre l’assistance aux comptes rendus ; ne pas le présenter comme un agent autonome si ce n’est pas le dispositif déployé.

### Proposition de texte

- **Title et H1 :** conserver les formulations actuelles, déjà adaptées à l’intention.
- **Description proposée :** Automatisez les tâches répétitives de votre PME : saisies, relances, documents et reporting. ALTOS relie vos outils et conserve les contrôles utiles.
- **Nouveaux titres de section :** « Un bilan avant et après automatisation », « Quel processus automatiser en premier ? », « Mise en place, exploitation et maintenance : que prévoir ? »

Conserver la question existante sur la mesure du retour ; l’enrichir avec les indicateurs du cas choisi plutôt que répéter une promesse générale de gain de temps.

## Preuves et liens internes à organiser

| Source | Destination ou action | Statut |
| --- | --- | --- |
| Audit IA, exemple de restitution | Cas patrimoine, froid commercial ou chocolatier selon l’extrait retenu | Liens déjà présents ; approfondir l’exemple plutôt que les dupliquer |
| Agents IA, mission livrée | Cabinet de recrutement dans cas-usage.html | Ajouter une ancre descriptive à cette mission : aucune ancre spécifique n’existe actuellement |
| Automatisation, mission livrée | Services à la personne dans cas-usage.html | Même besoin d’ancre ; les fichiers Markdown de travail ne sont pas des pages publiques à lier |
| Missions livrées de cas-usage.html | Page offre pertinente | Ajouter un lien contextuel là où il aide à comprendre la prestation |
| Articles du Journal | Offres concernées | Maillage déjà en place : ajuster seulement si un passage nouveau le justifie |
| Trois pages offres | Future page Occitanie | Ajouter après sa création ; aucun lien vers une page inexistante |

La [page régionale d’Oriq](https://oriq.fr/audit-ia-entreprise/) explicite l’intervention depuis Toulouse ; [Holycow](https://holycow.pro/consultant-ia-occitanie/) distingue son implantation dans le Gers des zones desservies. Cela conforte l’intérêt de décrire précisément l’ancrage et les modalités d’ALTOS. Ce constat ne mesure pas la demande locale et ne justifie pas des pages répétées par ville. Les recherches « consultant IA Occitanie » et « audit IA Occitanie » restent des cibles régionales proposées, sans volume démontré par l’export disponible.

## Ordre de réalisation et décisions restantes

1. Relire la proposition préparée pour Audit IA : trois formats confirmés, cinq jours payants, exemple de restitution et prise de rendez-vous gratuite, sans affichage de prix.
2. Préparer Agents IA : mission livrée, contenu du projet, coûts et supervision.
3. Préparer Automatisation : flux avant/après, priorisation, intégrations et exploitation.
4. Réaliser les ajustements communs : ancres des missions, FAQ et données structurées cohérentes, dates de modification exactes. Intégrer les corrections mineures du rapport technique au lot approprié.
5. Publier les lots selon le processus du projet, puis passer à la page Occitanie. La présente analyse n’est pas un déploiement.

**Décisions confirmées pour le premier lot :** durée de cinq jours pour l’audit complet payant ; rendez-vous de 30 minutes et quiz gratuits ; aucun prix à afficher. Ne pas redemander ces informations. Les textes ne promettent pas cinq jours consécutifs ou un délai calendaire spécifique.

Les engagements supplémentaires de livraison, formation, maintenance et coûts récurrents restent à préciser seulement s’ils sont proposés dans un lot ultérieur. Ils ne bloquent pas la rédaction du lot Audit IA retenu.

La rédaction des autres parties peut avancer avec les contenus existants. Les chiffres des cas seront conservés avec leur périmètre ; toute nouvelle présentation comme résultat mesuré devra s’appuyer sur une mesure vérifiable. Ne pas reprendre les conditions de financement ou certifications concurrentes comme si ALTOS en bénéficiait.

## Mesure après publication

Conserver les chiffres de cet export comme historique, puis enregistrer une référence plus récente à la date de chaque publication si Search Console est disponible. Comparer des périodes de même durée, en suivant séparément pages, requêtes prioritaires et recherches régionales. Filtrer par page puis par requête pour vérifier l’association recherchée, sans fusionner artificiellement les tableaux actuels.

Lire d’abord l’évolution des impressions et positions, puis celle des clics et de la pertinence des demandes. Un CTR faible à une position moyenne éloignée ne prouve pas que le titre est seul responsable. Aucun objectif chiffré de trafic ni délai de gain n’est garanti par ce plan. Les contacts qualifiés restent l’objectif commercial final ; la mesure détaillée et la refonte du micro-audit restent dans leur lot ultérieur.

**État actualisé : trois pages publiées en 0.4.13, contrôles statiques et HTTP de production terminés. Contrôle visuel restant. Suivre les pages dans Search Console selon le protocole archivé. Le lot Occitanie ci-dessous est maintenant intégré localement, sans publication.**

## Lot Occitanie — intégration locale

Page préparée le 16 novembre : [consultant-ia-occitanie.html](../../consultant-ia-occitanie.html). Intention principale proposée : « consultant IA Occitanie » ; variantes secondaires « consultant IA Aude » et « accompagnement IA TPE PME Occitanie ». Ces cibles ne sont pas des volumes ni des positions mesurés. La page répond au choix d’un interlocuteur régional ; les méthodes et livrables détaillés restent dans les pages nationales des offres.

Sources internes utilisées :

- [Accueil](../../index.html), définition et FAQ d’intervention : ALTOS basé à Montferrand, Aude ; missions sur site ou à distance en Occitanie et en France.
- [Mentions légales](../../mentions-legales.html) : implantation 11320 Montferrand et identité Nicolas Darcos. Aucune autre adresse, agence régionale, disponibilité de déplacement ou condition tarifaire inventée.
- [Cas d’installation frigorifique dans le Tarn](../../cas-usage/installation-frigorifique-tarn.html) : audit en 2025, 16 salariés, Google Form et suivi manuel. Il s’agit d’un audit avec projections, pas d’une nouvelle preuve de résultats déployés. Les autres missions livrées sont citées sans leur attribuer une localisation non documentée.
- Formats confirmés : quiz gratuit, diagnostic de contact gratuit de 30 minutes, audit complet payant de cinq jours. Les modalités de déplacement, calendrier et maintenance sont à convenir.

Intégration : contenu régional propre, title/description/canonical et Open Graph/X alignés, WebPage/Service/BreadcrumbList et quatre FAQ concordant avec le texte visible. Service limité à la zone Occitanie sur cette page ; identité de l’organisation conservée. Navigation, pied de page, boutons et styles communs réutilisés. Aucun prix, avis client ou promesse de progression SEO ajouté.

Maillage : liens depuis l’accueil et chacune des trois offres ; lien réciproque avec le cas du Tarn. Page ajoutée à `deploy/public-allowlist.txt` et à la liste de synchronisation des composants. Sitemap local : 21 URL. Dates de modification des pages concernées alignées au 16 novembre. Ce maillage modifiera aussi les pages suivies depuis la release 0.4.13 : dater sa publication séparément pour interpréter les prochaines mesures.

Vérifications locales : six pages concernées en HTTP 200, 279 occurrences de liens/ressources et ancres contrôlées, HTML équilibré, identifiants uniques et un H1 par page. FAQ visibles et JSON-LD identiques (quatre sur Occitanie, huit sur chaque offre). Nouvelle page : title de 50 caractères, description de 156 caractères. Composants partagés synchronisés. Le serveur de prévisualisation sert les fichiers modifiés.

Restant : relecture visuelle ordinateur/mobile et parcours de rendez-vous, puis publication selon la procédure du projet. L’hôte navigateur est encore indisponible lors de cette session ; les vérifications HTTP et de code ne valident pas le rendu. Prévisualisation : `http://127.0.0.1:8087/consultant-ia-occitanie.html`. Aucun déploiement ni bump de version applicative effectué pour ce lot.

Après publication : relever la date de mise en ligne, contrôler l’indexabilité de la nouvelle URL et suivre impressions/clics/recherches régionales dans Search Console. Conserver le suivi des trois offres et ne pas attribuer automatiquement une variation à une seule modification. Les exports manquants et les cinq exclusions Search Console restent à compléter séparément.
