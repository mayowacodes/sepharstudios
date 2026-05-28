#!/usr/bin/env bun
/**
 * Applier for migration 0016: payment system hardening.
 *
 *   - paystack_events table (webhook dedup)
 *   - payment_intents table (server-side pending record)
 *   - paystack_subscriptions: max_profiles, kids_allowed, next_charge_at,
 *     failed_attempts, last_charge_attempt_at columns
 *   - Unique constraints on paystack_subscription_code + trial_blacklist.card_signature
 *   - refunds table (admin audit log)
 *
 * Idempotent (IF NOT EXISTS, ADD COLUMN IF NOT EXISTS, pg_constraint guards),
 * safe to re-run.
 *
 *   $env:DATABASE_URL = 'postgresql://…'
 *   bun run scripts/apply-migration-0016.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Copy from apps/web/.env or DOKPLOY_ENV.txt.');
  process.exit(1);
}

const filename = '0016_payment_system.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

const tablesToVerify = ['paystack_events', 'payment_intents', 'refunds'];
const columnsToVerify: Array<[string, string]> = [
  ['paystack_subscriptions', 'max_profiles'],
  ['paystack_subscriptions', 'kids_allowed'],
  ['paystack_subscriptions', 'next_charge_at'],
  ['paystack_subscriptions', 'failed_attempts'],
  ['paystack_subscriptions', 'last_charge_attempt_at']
];
const constraintsToVerify = [
  'paystack_subscriptions_paystack_subscription_code_unique',
  'trial_blacklist_card_signature_unique'
];

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  console.log('\nVerification:');
  for (const t of tablesToVerify) {
    const rows = await sql<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE tablename = ${t}
    `;
    console.log(`  table ${t.padEnd(20)} ${rows.length > 0 ? '✓' : '✗ MISSING'}`);
  }
  for (const [table, col] of columnsToVerify) {
    const rows = await sql<{ column_name: string }[]>`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = ${table} AND column_name = ${col}
    `;
    console.log(`  col   ${table}.${col.padEnd(20)} ${rows.length > 0 ? '✓' : '✗ MISSING'}`);
  }
  for (const c of constraintsToVerify) {
    const rows = await sql<{ conname: string }[]>`
      SELECT conname FROM pg_constraint WHERE conname = ${c}
    `;
    console.log(`  unique ${c.padEnd(60)} ${rows.length > 0 ? '✓' : '✗ MISSING'}`);
  }
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
