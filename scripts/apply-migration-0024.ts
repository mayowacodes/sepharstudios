#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0024_creator_studio_expansion.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const cols = await sql<{ table_name: string; column_name: string }[]>`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE (table_name = 'media_library' AND column_name IN ('poster_landscape_url', 'poster_square_url', 'logo_title_url', 'visibility', 'scheduled_publish_at'))
  `;
  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename = 'content_subtitle_tracks'
  `;
  const indexes = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname = 'content_subtitle_tracks_content_idx'
  `;
  const hasCol = (t: string, c: string) => cols.some(r => r.table_name === t && r.column_name === c) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  media_library.poster_landscape_url       ${hasCol('media_library', 'poster_landscape_url')}`);
  console.log(`  media_library.poster_square_url          ${hasCol('media_library', 'poster_square_url')}`);
  console.log(`  media_library.logo_title_url             ${hasCol('media_library', 'logo_title_url')}`);
  console.log(`  media_library.visibility                 ${hasCol('media_library', 'visibility')}`);
  console.log(`  media_library.scheduled_publish_at       ${hasCol('media_library', 'scheduled_publish_at')}`);
  console.log(`  table content_subtitle_tracks            ${tables.length > 0 ? '✓' : '✗ MISSING'}`);
  console.log(`  index content_subtitle_tracks_content_idx ${indexes.length > 0 ? '✓' : '✗ MISSING'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
