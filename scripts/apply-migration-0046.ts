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

const filename = '0046_playback_telemetry.sql';
// Node-portable form. `import.meta.dir` is Bun-only and breaks under plain
// node/tsx, which is how these scripts get run in CI.
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

const EXPECTED_COLUMNS = [
  'effective_bitrate_kbps',
  'stall_count',
  'stall_seconds',
  'error_count',
  'final_quality'
];

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ table_name: string }[]>`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'playback_telemetry'
  `;
  const cols = await sql<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'playback_telemetry'
  `;

  console.log('\nVerification:');
  let ok = true;

  const hasTable = tables.length > 0;
  if (!hasTable) ok = false;
  console.log(`  table playback_telemetry${' '.repeat(16)} ${hasTable ? '✓' : '✗ MISSING'}`);

  for (const c of EXPECTED_COLUMNS) {
    const present = cols.some((r) => r.column_name === c);
    if (!present) ok = false;
    console.log(`  column ${c.padEnd(32)} ${present ? '✓' : '✗ MISSING'}`);
  }

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
