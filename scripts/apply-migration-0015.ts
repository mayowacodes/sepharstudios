#!/usr/bin/env bun
/**
 * Applier for migration 0015: performance indexes on hot tables.
 *
 * Idempotent (CREATE INDEX IF NOT EXISTS), safe to re-run. CREATE INDEX
 * holds a SHARE lock on the table — concurrent writes block briefly while
 * each index builds. For large tables (>10M rows), prefer to run this off
 * peak hours, or switch to CREATE INDEX CONCURRENTLY for zero-downtime.
 *
 * Run from project root:
 *   $env:DATABASE_URL = 'postgresql://…'
 *   bun run scripts/apply-migration-0015.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set. Copy it from apps/web/.env or DOKPLOY_ENV.txt.');
  process.exit(1);
}

const filename = '0015_performance_indexes.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

const indexesToVerify = [
  'transactions_user_currency_type_status_idx',
  'transactions_created_at_idx',
  'media_watch_progress_user_content_idx',
  'media_watch_progress_profile_updated_idx',
  'media_library_type_active_idx',
  'media_library_category_idx',
  'media_library_creator_idx',
  'paystack_subscriptions_user_status_idx',
  'playlists_user_idx',
  'playlist_items_playlist_sort_idx',
  'reviews_content_approved_idx',
  'reviews_user_created_idx',
  'episodes_show_season_episode_idx'
];

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  console.log('\nVerification:');
  for (const name of indexesToVerify) {
    const rows = await sql<{ indexname: string }[]>`
      SELECT indexname FROM pg_indexes WHERE indexname = ${name}
    `;
    console.log(`  ${name.padEnd(50)} ${rows.length > 0 ? '✓' : '✗ MISSING'}`);
  }
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
