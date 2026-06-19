import { evaluateMicroAuditAnswers } from '../services/micro-audit-scoring.js';

const cases = [
  {
    name: 'low friction',
    answers: [0, 0, 0, 0, 3, 0, 3, 3, 4, 0],
    expected: {
      level: 'low',
      total: 1,
      firstRecommendation: "Cadrage léger d'opportunités ciblées",
    },
  },
  {
    name: 'admin friction',
    answers: [3, 3, 1, 1, 3, 1, 1, 0, 0, 2],
    expected: {
      level: 'high',
      topAxis: 'admin',
      firstRecommendation: 'Automatiser les tâches admin & doubles saisies',
    },
  },
  {
    name: 'data friction',
    answers: [0, 0, 3, 3, 3, 0, 3, 3, 0, 1],
    expected: {
      topAxis: 'data',
      firstRecommendation: 'Centraliser & visualiser les données clés',
    },
  },
  {
    name: 'commercial friction',
    answers: [0, 0, 0, 0, 0, 3, 3, 3, 1, 1],
    expected: {
      topAxis: 'commercial',
      firstRecommendation: 'Agent IA de qualification commerciale',
    },
  },
  {
    name: 'ia maturity weak',
    answers: [0, 1, 0, 1, 3, 0, 3, 0, 0, 1],
    expected: {
      includesRecommendation: "Acculturation IA + premier cas d'usage",
    },
  },
];

const questionIds = [
  'admin_hours',
  'data_resaisie',
  'data_central',
  'dashboard',
  'prospect',
  'content',
  'docs',
  'ia_maturity',
  'blocker',
  'pain',
];

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

function toSubmittedAnswers(optionIndexes: number[]) {
  return optionIndexes.map((optionIndex, index) => ({
    questionId: questionIds[index],
    optionIndex,
  }));
}

function main(): void {
  const signatures = new Set<string>();

  cases.forEach((testCase) => {
    const result = evaluateMicroAuditAnswers(toSubmittedAnswers(testCase.answers));
    const titles = result.recommendations.map((recommendation) => recommendation.title);
    signatures.add(titles.join('|'));

    if (testCase.expected.level) {
      assert(
        result.score.level === testCase.expected.level,
        `${testCase.name}: expected level ${testCase.expected.level}, got ${result.score.level}`,
      );
    }

    if (typeof testCase.expected.total === 'number') {
      assert(
        result.score.total === testCase.expected.total,
        `${testCase.name}: expected total ${testCase.expected.total}, got ${result.score.total}`,
      );
    }

    if (testCase.expected.topAxis) {
      assert(
        result.score.topAxis === testCase.expected.topAxis,
        `${testCase.name}: expected topAxis ${testCase.expected.topAxis}, got ${result.score.topAxis}`,
      );
    }

    if (testCase.expected.firstRecommendation) {
      assert(
        result.recommendations[0]?.title === testCase.expected.firstRecommendation,
        `${testCase.name}: expected first recommendation "${testCase.expected.firstRecommendation}", got "${result.recommendations[0]?.title}"`,
      );
    }

    if (testCase.expected.includesRecommendation) {
      assert(
        titles.includes(testCase.expected.includesRecommendation),
        `${testCase.name}: expected recommendations to include "${testCase.expected.includesRecommendation}", got ${titles.join(', ')}`,
      );
    }
  });

  assert(signatures.size >= 4, `Expected differentiated recommendations, got ${signatures.size}`);
  console.log(`Micro-audit scoring test OK: ${cases.length} cases, ${signatures.size} signatures`);
}

main();
