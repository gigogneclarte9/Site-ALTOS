import pg from 'pg';
import { config } from '../config.js';

let pool: pg.Pool | undefined;

export function hasDatabase(): boolean {
  return config.databaseUrl.length > 0;
}

export function getPool(): pg.Pool {
  if (!config.databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!pool) {
    pool = new pg.Pool({
      connectionString: config.databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export async function pingDatabase(): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
  if (!hasDatabase()) {
    return { ok: false, error: 'DATABASE_URL is not configured' };
  }

  const startedAt = Date.now();

  try {
    await getPool().query('select 1');
    return { ok: true, latencyMs: Date.now() - startedAt };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
}
