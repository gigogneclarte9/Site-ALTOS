import { randomUUID } from 'node:crypto';
import { getPool, hasDatabase } from '../db/pool.js';
import { hashPassword } from '../services/passwords.js';

async function main(): Promise<void> {
  if (!hasDatabase()) {
    throw new Error('DATABASE_URL is required');
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const role = process.env.ADMIN_ROLE || 'admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  const passwordHash = await hashPassword(password);
  await getPool().query(
    `
    insert into admin_users (id, email, password_hash, role)
    values ($1, $2, $3, $4)
    on conflict (email)
    do update set password_hash = excluded.password_hash, role = excluded.role, updated_at = now()
    `,
    [randomUUID(), email, passwordHash, role],
  );

  console.log(`Admin user ready: ${email}`);
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
