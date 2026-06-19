import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool, hasDatabase } from './pool.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(dirname, '../../migrations');

async function ensureMigrationsTable(): Promise<void> {
  await getPool().query(`
    create table if not exists schema_migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    )
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await getPool().query<{ filename: string }>(
    'select filename from schema_migrations order by filename',
  );

  return new Set(result.rows.map((row) => row.filename));
}

async function runMigration(filename: string): Promise<void> {
  const sql = await readFile(path.join(migrationsDir, filename), 'utf8');
  const client = await getPool().connect();

  try {
    await client.query('begin');
    await client.query(sql);
    await client.query('insert into schema_migrations (filename) values ($1)', [filename]);
    await client.query('commit');
    console.log(`Applied migration ${filename}`);
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  await ensureMigrationsTable();

  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b));

  const applied = await getAppliedMigrations();
  const pending = files.filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log('No pending migrations.');
    return;
  }

  for (const filename of pending) {
    await runMigration(filename);
  }
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
