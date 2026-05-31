#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0026_payouts_stripe_connect.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const cols = await sql<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'creators' AND column_name IN (
      'stripe_account_id', 'stripe_account_status', 'stripe_payouts_enabled',
      'stripe_charges_enabled', 'stripe_country', 'payout_processor',
      'preferred_payout_currency'
    )
  `;
  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN ('payouts')
  `;
  const indexes = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname IN (
      'payouts_creator_idx', 'payouts_status_idx'
    )
  `;
  const hasCol = (name: string) => cols.some(c => c.column_name === name) ? '✓' : '✗ MISSING';
  const hasTable = (name: string) => tables.some(t => t.tablename === name) ? '✓' : '✗ MISSING';
  const hasIdx = (name: string) => indexes.some(i => i.indexname === name) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  creators.stripe_account_id            ${hasCol('stripe_account_id')}`);
  console.log(`  creators.stripe_account_status        ${hasCol('stripe_account_status')}`);
  console.log(`  creators.stripe_payouts_enabled       ${hasCol('stripe_payouts_enabled')}`);
  console.log(`  creators.stripe_charges_enabled       ${hasCol('stripe_charges_enabled')}`);
  console.log(`  creators.stripe_country               ${hasCol('stripe_country')}`);
  console.log(`  creators.payout_processor             ${hasCol('payout_processor')}`);
  console.log(`  creators.preferred_payout_currency    ${hasCol('preferred_payout_currency')}`);
  console.log(`  table payouts                         ${hasTable('payouts')}`);
  console.log(`  index payouts_creator_idx             ${hasIdx('payouts_creator_idx')}`);
  console.log(`  index payouts_status_idx              ${hasIdx('payouts_status_idx')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
