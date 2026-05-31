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

const filename = '0034_live_pricing_subtitles.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const cols = await sql<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'content_subtitle_tracks' AND column_name = 'auto_generated'
  `;
  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN ('live_streams', 'content_pricing')
  `;
  const idx = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname IN (
      'live_streams_creator_idx', 'live_streams_status_idx', 'content_pricing_content_region_idx'
    )
  `;
  const hasCol = (n: string) => cols.some(c => c.column_name === n) ? '✓' : '✗ MISSING';
  const hasTable = (n: string) => tables.some(t => t.tablename === n) ? '✓' : '✗ MISSING';
  const hasIdx = (n: string) => idx.some(i => i.indexname === n) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  content_subtitle_tracks.auto_generated   ${hasCol('auto_generated')}`);
  console.log(`  table live_streams                        ${hasTable('live_streams')}`);
  console.log(`  table content_pricing                     ${hasTable('content_pricing')}`);
  console.log(`  index live_streams_creator_idx            ${hasIdx('live_streams_creator_idx')}`);
  console.log(`  index live_streams_status_idx             ${hasIdx('live_streams_status_idx')}`);
  console.log(`  index content_pricing_content_region_idx  ${hasIdx('content_pricing_content_region_idx')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
