import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import type { FastifyInstance } from 'fastify';
import { getPool, hasDatabase } from '../db/pool.js';

type DocumentParams = {
  id: string;
};

type DocumentRow = {
  original_filename: string | null;
  storage_path: string;
  mime_type: string;
  size_bytes: string | null;
};

const documentParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' },
  },
} as const;

function sanitizeFilename(filename: string | null): string {
  return (filename || 'document.pdf').replace(/["\\\r\n]/g, '_');
}

export async function registerDocumentRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Params: DocumentParams }>(
    '/documents/:id/download',
    {
      schema: {
        params: documentParamsSchema,
      },
    },
    async (request, reply) => {
      if (!hasDatabase()) {
        return reply.code(503).send({
          error: 'database_not_configured',
          message: 'DATABASE_URL must be configured before downloading documents.',
        });
      }

      const result = await getPool().query<DocumentRow>(
        `
        select original_filename, storage_path, mime_type, size_bytes
        from documents
        where id = $1
          and kind = 'micro_audit_pdf'
          and is_public = false
        limit 1
        `,
        [request.params.id],
      );

      const document = result.rows[0];
      if (!document) {
        return reply.code(404).send({
          error: 'document_not_found',
          message: 'Document not found.',
        });
      }

      try {
        await access(document.storage_path);
        const fileStats = await stat(document.storage_path);
        const filename = sanitizeFilename(document.original_filename);

        reply
          .type(document.mime_type)
          .header('Content-Length', String(fileStats.size))
          .header('Content-Disposition', `attachment; filename="${filename}"`);

        return reply.send(createReadStream(document.storage_path));
      } catch (error) {
        request.log.error({ error, documentId: request.params.id }, 'Document file is missing');
        return reply.code(404).send({
          error: 'document_file_not_found',
          message: 'Document file not found.',
        });
      }
    },
  );
}
