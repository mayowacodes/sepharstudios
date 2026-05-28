#!/usr/bin/env bun
/**
 * One-off applier for the migrations introduced in the items 2-6 round:
 *   0012_notifications_table.sql      — new `notifications` table
 *   0013_drop_legacy_otp_ratelimit.sql — drops legacy phone_otps + rate_limit_buckets
 *
 * Both SQL files are idempotent (CREATE TABLE IF NOT EXISTS / IF EXISTS guards),
 * so re-running this is safe.
 *
 * Run from project root:
 *   $env:DATABASE_URL = 'postgresql://…'   # PowerShell
 *   bun run scripts/apply-migrations-0012-0013.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Copy it from apps/web/.env or DOKPLOY_ENV.txt.');
  process.exit(1);
}

const drizzleDir = resolve(import.meta.dir, '..', 'drizzle');

const migrations = [
  '0012_notifications_table.sql',
  '0013_drop_legacy_otp_ratelimit.sql'
];

const sql = postgres(databaseUrl, { max: 1 });

try {
  for (const filename of migrations) {
    const path = resolve(drizzleDir, filename);
    const body = readFileSync(path, 'utf-8');
    console.log(`\nApplying ${filename} …`);
    await sql.unsafe(body);
    console.log(`✓ ${filename}`);
  }

  // Sanity check: notifications table should now exist; phone_otps / rate_limit_buckets should not.
  const rows = await sql<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables
    WHERE table_name IN ('notifications', 'phone_otps', 'rate_limit_buckets')
    ORDER BY table_name
  `;

  console.log('\nVerification:');
  const present = new Set(rows.map((r) => r.table_name));
  console.log(`  notifications        : ${present.has('notifications') ? '✓ present' : '✗ MISSING'}`);
  console.log(`  phone_otps           : ${present.has('phone_otps') ? '✗ still present' : '✓ dropped'}`);
  console.log(`  rate_limit_buckets   : ${present.has('rate_limit_buckets') ? '✗ still present' : '✓ dropped'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
