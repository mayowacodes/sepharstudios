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

const filename = '0033_batch_features.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const cols = await sql<{ table_name: string; column_name: string }[]>`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE
      (table_name = 'payouts' AND column_name = 'held_until')
      OR (table_name = 'content_thumbnail_variants' AND column_name = 'promoted_at')
  `;
  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN (
      'payout_disputes', 'tax_forms', 'tax_1099_forms'
    )
  `;
  const indexes = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname IN (
      'payout_disputes_status_idx', 'payout_disputes_payout_idx',
      'tax_forms_creator_idx', 'tax_forms_status_idx',
      'tax_1099_forms_creator_idx'
    )
  `;
  const hasCol = (table: string, col: string) =>
    cols.some(c => c.table_name === table && c.column_name === col) ? '✓' : '✗ MISSING';
  const hasTable = (name: string) => tables.some(t => t.tablename === name) ? '✓' : '✗ MISSING';
  const hasIdx = (name: string) => indexes.some(i => i.indexname === name) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  payouts.held_until                          ${hasCol('payouts', 'held_until')}`);
  console.log(`  content_thumbnail_variants.promoted_at      ${hasCol('content_thumbnail_variants', 'promoted_at')}`);
  console.log(`  table payout_disputes                       ${hasTable('payout_disputes')}`);
  console.log(`  table tax_forms                             ${hasTable('tax_forms')}`);
  console.log(`  table tax_1099_forms                        ${hasTable('tax_1099_forms')}`);
  console.log(`  index payout_disputes_status_idx            ${hasIdx('payout_disputes_status_idx')}`);
  console.log(`  index payout_disputes_payout_idx            ${hasIdx('payout_disputes_payout_idx')}`);
  console.log(`  index tax_forms_creator_idx                 ${hasIdx('tax_forms_creator_idx')}`);
  console.log(`  index tax_forms_status_idx                  ${hasIdx('tax_forms_status_idx')}`);
  console.log(`  index tax_1099_forms_creator_idx            ${hasIdx('tax_1099_forms_creator_idx')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
