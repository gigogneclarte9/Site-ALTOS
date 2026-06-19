export const MICRO_AUDIT_SCORING_VERSION = '2026-06-19.v1';

export type MicroAuditAxis =
  | 'admin'
  | 'data'
  | 'commercial'
  | 'documents'
  | 'ia'
  | 'pain'
  | 'blocker';

export type MicroAuditLevel = 'low' | 'moderate' | 'high' | 'critical';

export type SubmittedMicroAuditAnswer = {
  questionId: string;
  optionIndex: number;
};

export type ScoredMicroAuditAnswer = {
  questionId: string;
  optionIndex: number;
  score: number;
  label: string;
  axis: MicroAuditAxis;
};

export type MicroAuditQuickWin = {
  title: string;
  desc: string;
  stack: string;
  gain: string;
  reason: string;
};

export type MicroAuditScore = {
  total: number;
  max: 30;
  axes: Record<MicroAuditAxis, number>;
  topAxis: Extract<MicroAuditAxis, 'admin' | 'data' | 'commercial' | 'documents'>;
  level: MicroAuditLevel;
  profileName: string;
  scoringVersion: string;
};

export type MicroAuditScoringResult = {
  answers: ScoredMicroAuditAnswer[];
  score: MicroAuditScore;
  recommendations: MicroAuditQuickWin[];
  roi: {
    label: string;
    hoursPerWeek: number;
    level: MicroAuditLevel;
  };
};

type QuestionOption = {
  label: string;
  score: number;
};

type QuestionDefinition = {
  id: string;
  axis: MicroAuditAxis;
  options: QuestionOption[];
};

const questions: QuestionDefinition[] = [
  {
    id: 'admin_hours',
    axis: 'admin',
    options: [
      { label: 'Moins de 5 h', score: 0 },
      { label: 'Entre 5 et 15 h', score: 1 },
      { label: 'Entre 15 et 30 h', score: 2 },
      { label: 'Plus de 30 h', score: 3 },
    ],
  },
  {
    id: 'data_resaisie',
    axis: 'admin',
    options: [
      { label: 'Jamais ou presque', score: 0 },
      { label: 'Occasionnellement', score: 1 },
      { label: 'Toutes les semaines', score: 2 },
      { label: 'Tous les jours', score: 3 },
    ],
  },
  {
    id: 'data_central',
    axis: 'data',
    options: [
      { label: 'Oui, tout est dans un CRM unique', score: 0 },
      { label: 'Réparties entre 2-3 outils connectés', score: 1 },
      { label: 'Surtout Excel et boîtes mail', score: 2 },
      { label: 'Aucun outil dédié', score: 3 },
    ],
  },
  {
    id: 'dashboard',
    axis: 'data',
    options: [
      { label: 'Oui, à jour en continu', score: 0 },
      { label: 'Construit à la main chaque mois', score: 1 },
      { label: 'Reporting ponctuel à la demande', score: 2 },
      { label: 'Aucun — je pilote au feeling', score: 3 },
    ],
  },
  {
    id: 'prospect',
    axis: 'commercial',
    options: [
      { label: 'Sourcing & qualification 100 % manuels', score: 3 },
      { label: 'Un mix manuel + quelques outils', score: 2 },
      { label: 'Une partie est automatisée', score: 1 },
      { label: 'Pipeline largement automatisé', score: 0 },
    ],
  },
  {
    id: 'content',
    axis: 'commercial',
    options: [
      { label: 'On publie régulièrement, process huilé', score: 0 },
      { label: 'Quand on a le temps — irrégulier', score: 2 },
      { label: "Un freelance ou une agence s'en occupe", score: 1 },
      { label: 'On ne publie pas / plus', score: 3 },
    ],
  },
  {
    id: 'docs',
    axis: 'documents',
    options: [
      { label: 'À la main par les équipes', score: 3 },
      { label: 'Avec quelques modèles Word', score: 2 },
      { label: 'Avec une transcription IA ou Notion AI', score: 1 },
      { label: 'Workflow IA dédié déjà en place', score: 0 },
    ],
  },
  {
    id: 'ia_maturity',
    axis: 'ia',
    options: [
      { label: 'Jamais testé', score: 3 },
      { label: 'Quelques essais individuels', score: 2 },
      { label: 'Déployé sur un cas précis', score: 1 },
      { label: "Plusieurs cas d'usage en production", score: 0 },
    ],
  },
  {
    id: 'blocker',
    axis: 'blocker',
    options: [
      { label: "Le temps : on n'arrive pas à s'y mettre", score: 3 },
      { label: 'La compétence : personne en interne', score: 3 },
      { label: 'Le coût : on hésite à investir', score: 2 },
      { label: "L'utilité : pas sûr du ROI", score: 2 },
      { label: 'Le RGPD / la sécurité des données', score: 1 },
    ],
  },
  {
    id: 'pain',
    axis: 'pain',
    options: [
      { label: 'Faible — on tient bien', score: 0 },
      { label: 'Modéré — gérable', score: 1 },
      { label: 'Important — ça pèse', score: 2 },
      { label: 'Critique — étouffement quotidien', score: 3 },
    ],
  },
];

const questionById = new Map(questions.map((question) => [question.id, question]));

const actionableAxes = ['admin', 'data', 'commercial', 'documents'] as const;

const profileNames: Record<(typeof actionableAxes)[number], string> = {
  admin: "Écrasé par l'administratif",
  data: "Pilotage à l'aveugle",
  commercial: 'Moteur commercial à friction',
  documents: 'Surcharge documentaire',
};

const quickWins: Record<string, Omit<MicroAuditQuickWin, 'reason'>> = {
  admin: {
    title: 'Automatiser les tâches admin & doubles saisies',
    desc: 'Connecter vos outils (CRM, compta, planning) via n8n pour supprimer les ressaisies. Cible : relances devis, exports comptables, suivi de planning, rapprochement bancaire.',
    stack: 'n8n · Airtable · Looker Studio',
    gain: '8–12 h / mois récupérées',
  },
  data: {
    title: 'Centraliser & visualiser les données clés',
    desc: "Mise en place d'un hub de données (Supabase, Airtable ou Sheets connecté) et d'un tableau de bord temps réel sur CA, marge, trésorerie et indicateurs métier critiques.",
    stack: 'Airtable / Supabase · Looker Studio · n8n',
    gain: 'Décisions x2 plus rapides',
  },
  commercial: {
    title: 'Agent IA de qualification commerciale',
    desc: 'Scraping ciblé + scoring sémantique des prospects, enrichissement automatique, alertes Telegram / Slack. Le commercial reçoit des opportunités qualifiées, plus du sourcing à faire.',
    stack: 'Apify · n8n · ChatGPT · Airtable',
    gain: '−60 à −70 % temps sourcing',
  },
  documents: {
    title: 'Studio IA pour comptes rendus & synthèses',
    desc: 'Transcription automatique des réunions, génération de comptes rendus structurés, analyse rapide de documents complexes (devis, contrats, PLU, RGPD).',
    stack: 'Noota · Gemini Gems · n8n · OpenAI',
    gain: '1h → 15 min par CR',
  },
  ia: {
    title: "Acculturation IA + premier cas d'usage",
    desc: "Atelier de cadrage 1 jour + déploiement d'un premier assistant IA métier (mails, rédaction, recherche interne). Transfert d'autonomie complet à l'équipe.",
    stack: 'ChatGPT Team · Claude · Gems · prompts métier',
    gain: 'Maturité IA en 4 semaines',
  },
  content: {
    title: 'Studio social no-code (multi-canal)',
    desc: "Interface de génération + planification de contenus Meta / LinkedIn / Newsletter. Une personne non technique pilote toute la production hebdomadaire.",
    stack: 'Lovable · Claude / GPT · Buffer / Meta API',
    gain: '30 min → 3 min par publication',
  },
  lowAudit: {
    title: "Cadrage léger d'opportunités ciblées",
    desc: "Votre niveau de friction semble contenu. L'enjeu prioritaire est de verifier rapidement un ou deux irritants recurrentiels avant de lancer un chantier plus large.",
    stack: 'Audit flash · cartographie processus · priorisation ROI',
    gain: '1 à 2 leviers à confirmer',
  },
  lowData: {
    title: 'Consolider le pilotage existant',
    desc: 'Vos bases semblent plutôt stables. Un contrôle ponctuel des indicateurs, exports et tableaux de bord peut sécuriser les points de dépendance manuelle restants.',
    stack: 'Tableaux existants · contrôle qualité · documentation',
    gain: 'Pilotage plus robuste',
  },
  lowIa: {
    title: 'Tester un assistant IA sans refonte',
    desc: "Démarrer par un usage limité et réversible : rédaction, synthèse ou recherche interne. Objectif : gagner en confort sans transformer l'organisation.",
    stack: 'ChatGPT Team · prompts métier · charte usage',
    gain: 'Premier usage cadré',
  },
  roi: {
    title: 'Cadrer le ROI avant automatisation',
    desc: "Si le frein principal porte sur le coût ou l'utilité, la première étape consiste à chiffrer le temps perdu, le coût d'erreur et le seuil de rentabilité attendu.",
    stack: 'Business case · matrice impact/effort · feuille de route',
    gain: 'Décision plus nette',
  },
  security: {
    title: 'Sécuriser les données avant IA',
    desc: "Si le RGPD ou la sécurité bloque, cadrer d'abord les données manipulées, les accès, les sous-traitants et les règles de validation humaine.",
    stack: 'Cartographie données · RGPD · gouvernance IA',
    gain: 'Risque maîtrisé',
  },
  enablement: {
    title: "Transfert d'autonomie équipe",
    desc: "Quand le frein est la compétence interne, le bon démarrage est une mission courte avec prise en main guidée, documentation et premiers réflexes IA/no-code.",
    stack: 'Atelier équipe · playbook · cas pilote',
    gain: 'Equipe autonome plus vite',
  },
};

function emptyAxes(): Record<MicroAuditAxis, number> {
  return {
    admin: 0,
    data: 0,
    commercial: 0,
    documents: 0,
    ia: 0,
    pain: 0,
    blocker: 0,
  };
}

function levelFromTotal(total: number): MicroAuditLevel {
  if (total <= 6) return 'low';
  if (total <= 13) return 'moderate';
  if (total <= 21) return 'high';
  return 'critical';
}

function roiFromTotal(total: number, level: MicroAuditLevel): { label: string; hoursPerWeek: number } {
  if (level === 'low') {
    return { label: '+50 à +150 %', hoursPerWeek: Math.max(1, Math.round(total * 0.5)) };
  }
  if (level === 'critical') {
    return { label: '+400 à +700 %', hoursPerWeek: Math.round(total * 0.8) };
  }
  if (level === 'high') {
    return { label: '+250 à +450 %', hoursPerWeek: Math.round(total * 0.8) };
  }
  return { label: '+150 à +300 %', hoursPerWeek: Math.round(total * 0.8) };
}

function selectTopAxis(axes: Record<MicroAuditAxis, number>): MicroAuditScore['topAxis'] {
  let topAxis: MicroAuditScore['topAxis'] = 'admin';
  let topValue = -1;

  actionableAxes.forEach((axis) => {
    if (axes[axis] > topValue) {
      topAxis = axis;
      topValue = axes[axis];
    }
  });

  return topAxis;
}

function withReason(key: keyof typeof quickWins, reason: string): MicroAuditQuickWin {
  return { ...quickWins[key], reason };
}

function addUnique(
  recommendations: MicroAuditQuickWin[],
  key: keyof typeof quickWins,
  reason: string,
): void {
  const quickWin = quickWins[key];
  if (!recommendations.some((item) => item.title === quickWin.title)) {
    recommendations.push(withReason(key, reason));
  }
}

function optionIndexFor(answers: ScoredMicroAuditAnswer[], questionId: string): number {
  return answers.find((answer) => answer.questionId === questionId)?.optionIndex ?? -1;
}

function scoreFor(answers: ScoredMicroAuditAnswer[], questionId: string): number {
  return answers.find((answer) => answer.questionId === questionId)?.score ?? 0;
}

function chooseRecommendations({
  answers,
  axes,
  level,
  topAxis,
}: {
  answers: ScoredMicroAuditAnswer[];
  axes: Record<MicroAuditAxis, number>;
  level: MicroAuditLevel;
  topAxis: MicroAuditScore['topAxis'];
}): MicroAuditQuickWin[] {
  const recommendations: MicroAuditQuickWin[] = [];

  if (level === 'low') {
    addUnique(recommendations, 'lowAudit', 'Score global faible : privilégier une verification ciblée plutôt qu’un chantier complet.');
    addUnique(recommendations, axes.data > 0 ? 'lowData' : topAxis, 'Signal faible : consolider l’existant avant d’automatiser plus largement.');
    addUnique(recommendations, scoreFor(answers, 'ia_maturity') >= 2 ? 'lowIa' : 'roi', 'Troisième levier choisi pour ouvrir une discussion prudente et non intrusive.');
    return recommendations.slice(0, 3);
  }

  addUnique(recommendations, topAxis, `Axe prioritaire : ${topAxis} ressort avec le score actionnable le plus fort.`);

  if (scoreFor(answers, 'content') >= 2) {
    addUnique(recommendations, 'content', 'Production de contenu irrégulière ou arrêtée.');
  }

  const secondaryAxes = actionableAxes
    .filter((axis) => axis !== topAxis && axes[axis] >= 2)
    .sort((a, b) => axes[b] - axes[a]);

  secondaryAxes.forEach((axis) => {
    if (recommendations.length < 3) {
      addUnique(recommendations, axis, `Signal secondaire significatif sur l’axe ${axis}.`);
    }
  });

  if (recommendations.length < 3 && scoreFor(answers, 'ia_maturity') >= 2) {
    addUnique(recommendations, 'ia', 'Maturité IA faible : besoin d’acculturation ou de premier cas pilote.');
  }

  const blockerIndex = optionIndexFor(answers, 'blocker');
  if (recommendations.length < 3) {
    if (blockerIndex === 1) {
      addUnique(recommendations, 'enablement', 'Frein principal : compétence interne.');
    } else if (blockerIndex === 2 || blockerIndex === 3) {
      addUnique(recommendations, 'roi', 'Frein principal : coût ou incertitude sur le ROI.');
    } else if (blockerIndex === 4) {
      addUnique(recommendations, 'security', 'Frein principal : RGPD ou sécurité des données.');
    }
  }

  actionableAxes
    .filter((axis) => axis !== topAxis)
    .sort((a, b) => axes[b] - axes[a])
    .forEach((axis) => {
      if (recommendations.length < 3) {
        addUnique(recommendations, axis, `Complément retenu pour équilibrer le bilan sur l’axe ${axis}.`);
      }
    });

  if (recommendations.length < 3) addUnique(recommendations, 'ia', 'Levier transversal pour activer les quick wins.');
  if (recommendations.length < 3) addUnique(recommendations, 'roi', 'Cadrage utile avant priorisation.');

  return recommendations.slice(0, 3);
}

export function evaluateMicroAuditAnswers(
  submittedAnswers: SubmittedMicroAuditAnswer[],
): MicroAuditScoringResult {
  if (submittedAnswers.length !== questions.length) {
    throw new Error(`Expected ${questions.length} answers, got ${submittedAnswers.length}`);
  }

  const seen = new Set<string>();
  const answersByQuestion = new Map(submittedAnswers.map((answer) => [answer.questionId, answer]));
  const axes = emptyAxes();

  const answers = questions.map((question) => {
    const submittedAnswer = answersByQuestion.get(question.id);
    if (!submittedAnswer) {
      throw new Error(`Missing answer for question ${question.id}`);
    }
    if (seen.has(question.id)) {
      throw new Error(`Duplicate answer for question ${question.id}`);
    }
    seen.add(question.id);

    const option = question.options[submittedAnswer.optionIndex];
    if (!option) {
      throw new Error(`Invalid option index for question ${question.id}`);
    }

    axes[question.axis] += option.score;

    return {
      questionId: question.id,
      optionIndex: submittedAnswer.optionIndex,
      score: option.score,
      label: option.label,
      axis: question.axis,
    };
  });

  submittedAnswers.forEach((answer) => {
    if (!questionById.has(answer.questionId)) {
      throw new Error(`Unknown question ${answer.questionId}`);
    }
  });

  const total = answers.reduce((sum, answer) => sum + answer.score, 0);
  const level = levelFromTotal(total);
  const topAxis = selectTopAxis(axes);
  const profileName =
    level === 'low' ? 'Opportunités ciblées, frictions contenues' : profileNames[topAxis];
  const roi = roiFromTotal(total, level);
  const recommendations = chooseRecommendations({ answers, axes, level, topAxis });

  return {
    answers,
    score: {
      total,
      max: 30,
      axes,
      topAxis,
      level,
      profileName,
      scoringVersion: MICRO_AUDIT_SCORING_VERSION,
    },
    recommendations,
    roi: {
      ...roi,
      level,
    },
  };
}

export function getMicroAuditQuestionIds(): string[] {
  return questions.map((question) => question.id);
}
