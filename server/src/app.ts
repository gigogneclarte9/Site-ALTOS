import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import rateLimit from '@fastify/rate-limit';
import Fastify, { type FastifyInstance } from 'fastify';
import { config, isProduction } from './config.js';
import { registerAdminRoutes } from './routes/admin.js';
import { registerDocumentRoutes } from './routes/documents.js';
import { registerHealthRoutes } from './routes/health.js';
import { registerMicroAuditRoutes } from './routes/micro-audits.js';

type BuildAppOptions = {
  logger?: boolean;
};

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  if (isProduction && config.adminSessionSecret === 'dev-only-change-me-admin-session-secret') {
    throw new Error('ADMIN_SESSION_SECRET must be configured in production');
  }

  const app = Fastify({
    logger:
      options.logger === false
        ? false
        : isProduction
          ? true
          : {
              transport: {
                target: 'pino-pretty',
                options: { colorize: true },
              },
            },
  });

  await app.register(cors, {
    origin: config.corsOrigins.length > 0 ? config.corsOrigins : false,
    methods: ['GET', 'POST'],
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await app.register(formbody);

  await app.register(registerHealthRoutes, { prefix: '/api' });
  await app.register(registerMicroAuditRoutes, { prefix: '/api' });
  await app.register(registerDocumentRoutes, { prefix: '/api' });
  await app.register(registerAdminRoutes);

  return app;
}
