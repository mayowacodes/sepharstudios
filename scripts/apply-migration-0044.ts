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

const filename = '0044_ads_platform.sql';
// Node-portable form. `import.meta.dir` is Bun-only and breaks under plain
// node/tsx, which is how these scripts get run in CI.
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

const EXPECTED_TABLES = [
  'ad_advertisers',
  'ad_campaigns',
  'ad_creatives',
  'ad_breaks',
  'ad_content_settings',
  'ad_impressions',
  'ad_campaign_daily'
];

// The three columns the rest of the feature cannot function without:
// duration decides pause-vs-duck before the ad element exists, kids_safe gates
// the audience rule, and decision_id is the HMAC-verified dedup key.
const EXPECTED_COLUMNS: Array<[string, string]> = [
  ['ad_creatives', 'duration_seconds'],
  ['ad_campaigns', 'kids_safe'],
  ['ad_impressions', 'decision_id']
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
  const fn = await sql<{ proname: string }[]>`
    SELECT proname FROM pg_proc WHERE proname = 'ad_status_rank'
  `;
  const house = await sql<{ slug: string }[]>`
    SELECT slug FROM ad_advertisers WHERE slug = 'sephar-house'
  `;

  console.log('\nVerification:');
  let ok = true;

  for (const t of EXPECTED_TABLES) {
    const present = tables.some((r) => r.table_name === t);
    if (!present) ok = false;
    console.log(`  table ${t.padEnd(22)} ${present ? '✓' : '✗ MISSING'}`);
  }

  for (const [t, c] of EXPECTED_COLUMNS) {
    const present = cols.some((r) => r.table_name === t && r.column_name === c);
    if (!present) ok = false;
    console.log(`  column ${`${t}.${c}`.padEnd(37)} ${present ? '✓' : '✗ MISSING'}`);
  }

  const hasFn = fn.length > 0;
  if (!hasFn) ok = false;
  console.log(`  function ad_status_rank()${' '.repeat(14)} ${hasFn ? '✓' : '✗ MISSING'}`);

  const hasHouse = house.length > 0;
  if (!hasHouse) ok = false;
  console.log(`  seed advertiser sephar-house${' '.repeat(11)} ${hasHouse ? '✓' : '✗ MISSING'}`);

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
