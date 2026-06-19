import { buildApp } from '../app.js';
import { getPool, hasDatabase } from '../db/pool.js';

type CountRow = {
  leads: string;
  micro_audits: string;
  lead_events: string;
  documents: string;
};

async function readCounts(): Promise<CountRow> {
  const result = await getPool().query<CountRow>(`
    select
      (select count(*) from leads) as leads,
      (select count(*) from micro_audits) as micro_audits,
      (select count(*) from lead_events) as lead_events,
      (select count(*) from documents) as documents
  `);

  return result.rows[0];
}

function toInt(value: string): number {
  return Number.parseInt(value, 10);
}

async function main(): Promise<void> {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is required for smoke tests');
  }

  const before = await readCounts();
  const app = await buildApp({ logger: false });

  try {
    const health = await app.inject({ method: 'GET', url: '/api/health' });
    if (health.statusCode !== 200) {
      throw new Error(`Expected /api/health 200, got ${health.statusCode}`);
    }

    const payload = {
      contact: {
        firstName: 'Smoke',
        lastName: 'Test',
        email: `smoke-${Date.now()}@example.com`,
        phone: '0102030405',
      },
      consentAccepted: true,
      consentText: 'Consentement test automatique local',
      answers: [
        {
          questionId: 'admin_hours',
          optionIndex: 3,
        },
        {
          questionId: 'data_resaisie',
          optionIndex: 3,
        },
        {
          questionId: 'data_central',
          optionIndex: 0,
        },
        {
          questionId: 'dashboard',
          optionIndex: 0,
        },
        {
          questionId: 'prospect',
          optionIndex: 3,
        },
        {
          questionId: 'content',
          optionIndex: 0,
        },
        {
          questionId: 'docs',
          optionIndex: 3,
        },
        {
          questionId: 'ia_maturity',
          optionIndex: 3,
        },
        {
          questionId: 'blocker',
          optionIndex: 4,
        },
        {
          questionId: 'pain',
          optionIndex: 1,
        },
      ],
      source: 'smoke_test',
    };

    const created = await app.inject({
      method: 'POST',
      url: '/api/micro-audits',
      payload,
    });

    if (created.statusCode !== 201) {
      throw new Error(`Expected POST /api/micro-audits 201, got ${created.statusCode}: ${created.payload}`);
    }

    const createdPayload = JSON.parse(created.payload) as {
      documentId?: string;
      pdfUrl?: string;
      result?: { total?: number; topAxis?: string; picks?: Array<{ title?: string }> };
    };
    if (!createdPayload.documentId || !createdPayload.pdfUrl) {
      throw new Error(`Expected document metadata in response, got ${created.payload}`);
    }
    if (
      createdPayload.result?.total !== 8 ||
      createdPayload.result.topAxis !== 'admin' ||
      createdPayload.result.picks?.[0]?.title !== 'Automatiser les tâches admin & doubles saisies'
    ) {
      throw new Error(`Expected server-side scoring result, got ${created.payload}`);
    }

    const downloadedPdf = await app.inject({
      method: 'GET',
      url: createdPayload.pdfUrl,
    });

    if (downloadedPdf.statusCode !== 200 || !downloadedPdf.payload.startsWith('%PDF')) {
      throw new Error(`Expected PDF download 200, got ${downloadedPdf.statusCode}`);
    }
  } finally {
    await app.close();
  }

  const after = await readCounts();
  const deltas = {
    leads: toInt(after.leads) - toInt(before.leads),
    microAudits: toInt(after.micro_audits) - toInt(before.micro_audits),
    leadEvents: toInt(after.lead_events) - toInt(before.lead_events),
    documents: toInt(after.documents) - toInt(before.documents),
  };

  if (deltas.leads !== 1 || deltas.microAudits !== 1 || deltas.leadEvents !== 1 || deltas.documents !== 1) {
    throw new Error(`Unexpected smoke test deltas: ${JSON.stringify(deltas)}`);
  }

  console.log(`Smoke test OK: ${JSON.stringify(deltas)}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (hasDatabase()) {
      await getPool().end();
    }
  });
