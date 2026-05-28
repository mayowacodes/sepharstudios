#!/usr/bin/env bun
/**
 * Applier for migration 0017: newsletter_subscriptions table + unique constraint.
 * Idempotent — safe to re-run.
 *
 *   $env:DATABASE_URL = 'postgresql://…'
 *   bun run scripts/apply-migration-0017.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0017_newsletter_subscriptions.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const t = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename = 'newsletter_subscriptions'
  `;
  const c = await sql<{ conname: string }[]>`
    SELECT conname FROM pg_constraint WHERE conname = 'newsletter_subscriptions_email_audience_unique'
  `;
  console.log('\nVerification:');
  console.log(`  table newsletter_subscriptions  ${t.length > 0 ? '✓' : '✗ MISSING'}`);
  console.log(`  unique constraint               ${c.length > 0 ? '✓' : '✗ MISSING'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
