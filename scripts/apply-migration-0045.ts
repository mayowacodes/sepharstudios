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

const filename = '0045_ai_cost_ledger.sql';
// Node-portable form. `import.meta.dir` is Bun-only and breaks under plain
// node/tsx, which is how these scripts get run in CI.
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

const EXPECTED_TABLES = ['ai_cost_ledger', 'ai_budget_periods'];
const EXPECTED_COLUMNS: Array<[string, string]> = [
  ['ai_cost_ledger', 'estimated_micro_usd'],
  ['ai_cost_ledger', 'actual_micro_usd'],
  ['ai_budget_periods', 'limit_micro_usd']
];

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ANY(${EXPECTED_TABLES})
  `;
  const cols = await sql<{ table_name: string; column_name: string }[]>`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = ANY(${EXPECTED_TABLES})
  `;
  const cap = await sql<{ limit_micro_usd: string }[]>`
    SELECT limit_micro_usd FROM ai_budget_periods
    WHERE scope = 'platform' AND scope_id = 'platform'
  `;

  console.log('\nVerification:');
  let ok = true;

  for (const t of EXPECTED_TABLES) {
    const present = tables.some((r) => r.table_name === t);
    if (!present) ok = false;
    console.log(`  table ${t.padEnd(20)} ${present ? '✓' : '✗ MISSING'}`);
  }
  for (const [t, c] of EXPECTED_COLUMNS) {
    const present = cols.some((r) => r.table_name === t && r.column_name === c);
    if (!present) ok = false;
    console.log(`  column ${`${t}.${c}`.padEnd(40)} ${present ? '✓' : '✗ MISSING'}`);
  }

  const hasCap = cap.length > 0 && cap[0].limit_micro_usd !== null;
  if (!hasCap) ok = false;
  console.log(`  platform monthly cap seeded${' '.repeat(13)} ${hasCap ? `✓ ($${Number(cap[0]?.limit_micro_usd ?? 0) / 1e6})` : '✗ MISSING'}`);

  if (!ok) {
    console.error('\nVerification failed — some objects are missing.');
    process.exitCode = 1;
  }
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
