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

const filename = '0027_catalog_completion.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const cols = await sql<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'media_library' AND column_name IN (
      'chapters', 'cast', 'crew', 'geo_mode', 'geo_regions'
    )
  `;
  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN ('content_thumbnail_variants')
  `;
  const indexes = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname IN (
      'content_thumbnail_variants_content_idx'
    )
  `;
  const hasCol = (name: string) => cols.some(c => c.column_name === name) ? '✓' : '✗ MISSING';
  const hasTable = (name: string) => tables.some(t => t.tablename === name) ? '✓' : '✗ MISSING';
  const hasIdx = (name: string) => indexes.some(i => i.indexname === name) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  media_library.chapters                ${hasCol('chapters')}`);
  console.log(`  media_library.cast                    ${hasCol('cast')}`);
  console.log(`  media_library.crew                    ${hasCol('crew')}`);
  console.log(`  media_library.geo_mode                ${hasCol('geo_mode')}`);
  console.log(`  media_library.geo_regions             ${hasCol('geo_regions')}`);
  console.log(`  table content_thumbnail_variants      ${hasTable('content_thumbnail_variants')}`);
  console.log(`  index content_thumbnail_variants_content_idx  ${hasIdx('content_thumbnail_variants_content_idx')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
