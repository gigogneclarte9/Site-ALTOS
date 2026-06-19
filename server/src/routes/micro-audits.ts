import { randomUUID } from 'node:crypto';
import type { FastifyInstance } from 'fastify';
import { config } from '../config.js';
import { getPool, hasDatabase } from '../db/pool.js';
import { generateMicroAuditPdf } from '../services/micro-audit-pdf.js';
import { sendMicroAuditNotification } from '../services/notifications.js';

type MicroAuditBody = {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  consentAccepted: true;
  consentText?: string;
  answers: Array<{
    questionId: string;
    optionIndex: number;
    score: number;
    label?: string;
    axis?: string;
  }>;
  score: {
    total: number;
    max?: number;
    axes?: Record<string, number>;
    topAxis?: string;
  };
  recommendations?: Array<Record<string, unknown>>;
  roi?: Record<string, unknown>;
  source?: string;
};

const microAuditBodySchema = {
  type: 'object',
  required: ['contact', 'consentAccepted', 'answers', 'score'],
  additionalProperties: false,
  properties: {
    contact: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'phone'],
      additionalProperties: false,
      properties: {
        firstName: { type: 'string', minLength: 1, maxLength: 120 },
        lastName: { type: 'string', minLength: 1, maxLength: 120 },
        email: { type: 'string', format: 'email', maxLength: 255 },
        phone: { type: 'string', minLength: 1, maxLength: 60 },
      },
    },
    consentAccepted: { type: 'boolean', enum: [true] },
    consentText: { type: 'string', maxLength: 1000 },
    answers: {
      type: 'array',
      minItems: 1,
      maxItems: 20,
      items: {
        type: 'object',
        required: ['questionId', 'optionIndex', 'score'],
        additionalProperties: false,
        properties: {
          questionId: { type: 'string', minLength: 1, maxLength: 80 },
          optionIndex: { type: 'integer', minimum: 0, maximum: 10 },
          score: { type: 'integer', minimum: 0, maximum: 3 },
          label: { type: 'string', maxLength: 500 },
          axis: { type: 'string', maxLength: 80 },
        },
      },
    },
    score: {
      type: 'object',
      required: ['total'],
      additionalProperties: false,
      properties: {
        total: { type: 'integer', minimum: 0, maximum: 30 },
        max: { type: 'integer', minimum: 1, maximum: 30 },
        axes: {
          type: 'object',
          additionalProperties: { type: 'integer', minimum: 0, maximum: 30 },
        },
        topAxis: { type: 'string', maxLength: 80 },
      },
    },
    recommendations: {
      type: 'array',
      maxItems: 10,
      items: { type: 'object', additionalProperties: true },
    },
    roi: { type: 'object', additionalProperties: true },
    source: { type: 'string', maxLength: 120 },
  },
} as const;

export async function registerMicroAuditRoutes(app: FastifyInstance): Promise<void> {
  app.post<{ Body: MicroAuditBody }>(
    '/micro-audits',
    {
      schema: {
        body: microAuditBodySchema,
        response: {
          201: {
            type: 'object',
            required: ['id', 'leadId', 'documentId', 'pdfUrl', 'status'],
            properties: {
              id: { type: 'string' },
              leadId: { type: 'string' },
              documentId: { type: 'string' },
              pdfUrl: { type: 'string' },
              status: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      if (!hasDatabase()) {
        return reply.code(503).send({
          error: 'database_not_configured',
          message: 'DATABASE_URL must be configured before storing micro-audits.',
        });
      }

      const body = request.body;
      const leadId = randomUUID();
      const auditId = randomUUID();
      const eventId = randomUUID();
      const documentId = randomUUID();
      const now = new Date();
      const pool = getPool();
      const client = await pool.connect();
      let generatedPdf:
        | Awaited<ReturnType<typeof generateMicroAuditPdf>>
        | null = null;

      try {
        await client.query('begin');

        await client.query(
          `
          insert into leads (
            id, first_name, last_name, email, phone, source,
            consent_accepted, consent_text, consent_at
          )
          values ($1, $2, $3, $4, $5, $6, true, $7, $8)
          `,
          [
            leadId,
            body.contact.firstName.trim(),
            body.contact.lastName.trim(),
            body.contact.email.trim().toLowerCase(),
            body.contact.phone.trim(),
            body.source || 'micro_audit',
            body.consentText || null,
            now,
          ],
        );

        await client.query(
          `
          insert into micro_audits (
            id, lead_id, answers, score_total, score_max, axes,
            top_axis, recommendations, roi, raw_payload
          )
          values ($1, $2, $3::jsonb, $4, $5, $6::jsonb, $7, $8::jsonb, $9::jsonb, $10::jsonb)
          `,
          [
            auditId,
            leadId,
            JSON.stringify(body.answers),
            body.score.total,
            body.score.max || 30,
            JSON.stringify(body.score.axes || {}),
            body.score.topAxis || null,
            JSON.stringify(body.recommendations || []),
            JSON.stringify(body.roi || {}),
            JSON.stringify(body),
          ],
        );

        await client.query(
          `
          insert into lead_events (id, lead_id, event_type, payload)
          values ($1, $2, $3, $4::jsonb)
          `,
          [
            eventId,
            leadId,
            'micro_audit_submitted',
            JSON.stringify({ microAuditId: auditId, source: body.source || 'micro_audit' }),
          ],
        );

        generatedPdf = await generateMicroAuditPdf({
          auditId,
          body,
          outputDir: config.documentsPrivateDir,
        });

        await client.query(
          `
          insert into documents (
            id, lead_id, micro_audit_id, kind, original_filename, storage_path,
            mime_type, size_bytes, checksum_sha256, is_public
          )
          values ($1, $2, $3, 'micro_audit_pdf', $4, $5, $6, $7, $8, false)
          `,
          [
            documentId,
            leadId,
            auditId,
            generatedPdf.filename,
            generatedPdf.storagePath,
            generatedPdf.mimeType,
            generatedPdf.sizeBytes,
            generatedPdf.checksumSha256,
          ],
        );

        await client.query('commit');

        const pdfUrl = `/api/documents/${documentId}/download`;

        sendMicroAuditNotification({
          auditId,
          leadId,
          pdfUrl,
          body,
          logger: request.log,
        }).catch((error) => {
          request.log.error({ error, auditId }, 'Failed to send micro-audit notification');
        });

        return reply.code(201).send({
          id: auditId,
          leadId,
          documentId,
          pdfUrl,
          status: 'stored',
        });
      } catch (error) {
        await client.query('rollback');
        request.log.error({ error }, 'Failed to store micro-audit');
        return reply.code(500).send({
          error: 'micro_audit_store_failed',
          message: 'Unable to store micro-audit.',
        });
      } finally {
        client.release();
      }
    },
  );
}
