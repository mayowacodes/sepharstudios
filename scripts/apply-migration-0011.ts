#!/usr/bin/env bun
/**
 * One-off applier for drizzle/0011_scaling_prep_stores.sql.
 *
 * Why this exists: the project's drizzle/meta/_journal.json is out of sync
 * with both the SQL files in drizzle/ and the actual database state (the
 * journal stops at 0006, but the DB has 0000–0010 already applied manually).
 * Running `bun drizzle-kit migrate` therefore tries to replay 0000 from
 * scratch and crashes on `relation "files" already exists`.
 *
 * Until the journal is rebuilt, apply individual migration SQL files with this
 * script. The 0011 SQL is fully idempotent (CREATE TABLE IF NOT EXISTS), so
 * re-running this is safe.
 *
 * Run from project root:
 *   bun run scripts/apply-migration-0011.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Export it or copy from apps/web/.env');
  process.exit(1);
}

const sqlPath = resolve(import.meta.dir, '..', 'drizzle', '0011_scaling_prep_stores.sql');
const sqlText = readFileSync(sqlPath, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`Applying ${sqlPath} …`);
  await sql.unsafe(sqlText);
  console.log('✓ phone_otps and rate_limit_buckets are ready');

  // Sanity check
  const rows = await sql<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables
    WHERE table_name IN ('phone_otps', 'rate_limit_buckets')
    ORDER BY table_name
  `;
  console.log('Verified tables in DB:', rows.map((r) => r.table_name).join(', '));
} catch (err) {
  console.error('Migration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
