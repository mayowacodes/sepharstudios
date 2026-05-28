#!/usr/bin/env bun
/**
 * One-off applier for migration 0014: adds the FK
 *   notifications.user_id -> user.id ON DELETE CASCADE
 *
 * The SQL is idempotent (DO block checks pg_constraint), so re-running is safe.
 *
 * Run from project root:
 *   $env:DATABASE_URL = 'postgresql://…'   # PowerShell
 *   bun run scripts/apply-migration-0014.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Copy it from apps/web/.env or DOKPLOY_ENV.txt.');
  process.exit(1);
}

const filename = '0014_notifications_user_fk.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const rows = await sql<{ conname: string }[]>`
    SELECT conname FROM pg_constraint
    WHERE conname = 'notifications_user_id_user_id_fk'
  `;

  console.log('\nVerification:');
  console.log(`  notifications.user_id FK : ${rows.length > 0 ? '✓ present' : '✗ MISSING'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
