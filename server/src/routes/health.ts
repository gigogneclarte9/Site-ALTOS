import type { FastifyInstance } from 'fastify';
import { hasDatabase, pingDatabase } from '../db/pool.js';
import { appVersion } from '../version.js';

export async function registerHealthRoutes(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    const database = await pingDatabase();

    return {
      status: database.ok || !hasDatabase() ? 'ok' : 'degraded',
      version: appVersion,
      databaseConfigured: hasDatabase(),
      database,
      timestamp: new Date().toISOString(),
    };
  });
}
