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

const filename = '0037_scan_artifacts.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);
  const cols = await sql<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'media_library'
      AND column_name IN ('preview_thumbnails_vtt', 'preview_sprite_urls', 'poster_auto_url')
  `;
  const has = (n: string) => cols.some((c) => c.column_name === n) ? '✓' : '✗ MISSING';
  console.log('\nVerification:');
  console.log(`  media_library.preview_thumbnails_vtt ${has('preview_thumbnails_vtt')}`);
  console.log(`  media_library.preview_sprite_urls    ${has('preview_sprite_urls')}`);
  console.log(`  media_library.poster_auto_url        ${has('poster_auto_url')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
