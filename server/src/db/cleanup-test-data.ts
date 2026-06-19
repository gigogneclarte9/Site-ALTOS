import { unlink } from 'node:fs/promises';
import { getPool, hasDatabase } from './pool.js';

const testSources = ['smoke_test', 'http_test', 'micro_audit_test'];

async function main(): Promise<void> {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is required to clean test data');
  }

  const client = await getPool().connect();

  try {
    await client.query('begin');

    const documentResult = await client.query<{ id: string; storage_path: string }>(
      `
      select d.id, d.storage_path
      from documents d
      left join leads l on l.id = d.lead_id
      where l.source = any($1)
        or l.email like '%@example.com'
        or l.email like '%@altos.local'
      `,
      [testSources],
    );

    await client.query(
      `
      delete from documents d
      using leads l
      where d.lead_id = l.id
        and (
          l.source = any($1)
          or l.email like '%@example.com'
          or l.email like '%@altos.local'
        )
      `,
      [testSources],
    );

    const leadResult = await client.query(
      `
      delete from leads
      where source = any($1)
        or email like '%@example.com'
        or email like '%@altos.local'
      `,
      [testSources],
    );

    await client.query('commit');

    let deletedFiles = 0;
    for (const document of documentResult.rows) {
      try {
        await unlink(document.storage_path);
        deletedFiles += 1;
      } catch {
        // Local cleanup is best-effort: the database is the source of truth.
      }
    }

    console.log(
      `Cleaned local test data: ${leadResult.rowCount || 0} leads, ${documentResult.rowCount} documents, ${deletedFiles} files`,
    );
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
    await getPool().end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
