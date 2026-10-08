import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { generateMicroAuditPdf } from '../services/micro-audit-pdf.js';
import { evaluateMicroAuditAnswers, getMicroAuditQuestionIds } from '../services/micro-audit-scoring.js';

const scenarios = [
  [0, 0, 0, 0, 3, 0, 3, 3, 4, 0],
  [3, 3, 1, 1, 3, 1, 1, 0, 0, 2],
  [0, 0, 3, 3, 3, 0, 3, 3, 2, 1],
  [1, 1, 0, 0, 0, 1, 2, 3, 4, 0],
  [0, 0, 0, 0, 3, 0, 0, 3, 1, 1],
  [0, 1, 0, 1, 3, 0, 3, 0, 0, 1],
];

for (const [index, options] of scenarios.entries()) {
  const scoring = evaluateMicroAuditAnswers(getMicroAuditQuestionIds().map((questionId, i) => ({
    questionId, optionIndex: options[i],
  })));
  const pdf = await generateMicroAuditPdf({
    auditId: `pdf-regression-${index}`,
    outputDir: path.resolve('tmp/pdf-regression'),
    body: {
      contact: { firstName: 'Exemple', lastName: `Profil-${index}`, email: 'exemple@example.com' },
      ...scoring,
    },
  });
  const bytes = await readFile(pdf.storagePath);
  const content = bytes.toString('latin1');
  assert.equal(bytes.length, pdf.sizeBytes);
  assert.equal((content.match(/\/Type \/Page\b/g) || []).length, 2, `Scenario ${index}: two pages`);
  assert.ok(content.includes('hello@altos-experts.fr'));
  assert.ok(content.includes('mailto:hello@altos-experts.fr'));
  assert.ok(!/bonjour@altos\.fr/i.test(content));
  console.log(`PASS PDF scenario ${index}: ${pdf.storagePath}`);
}
