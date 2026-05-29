#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0022_engagement_push_stories_sponsorships.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN (
      'content_shares', 'watch_session_meta', 'push_subscriptions',
      'success_stories', 'sponsorship_applications'
    )
  `;
  const indexes = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname IN (
      'content_shares_content_idx',
      'watch_session_meta_content_idx',
      'watch_session_meta_device_idx',
      'push_subscriptions_user_idx',
      'push_subscriptions_endpoint_idx'
    )
  `;
  const has = (name: string) => tables.some(t => t.tablename === name) ? '✓' : '✗ MISSING';
  const hasIdx = (name: string) => indexes.some(i => i.indexname === name) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  table content_shares                  ${has('content_shares')}`);
  console.log(`  table watch_session_meta              ${has('watch_session_meta')}`);
  console.log(`  table push_subscriptions              ${has('push_subscriptions')}`);
  console.log(`  table success_stories                 ${has('success_stories')}`);
  console.log(`  table sponsorship_applications        ${has('sponsorship_applications')}`);
  console.log(`  index content_shares_content_idx      ${hasIdx('content_shares_content_idx')}`);
  console.log(`  index watch_session_meta_content_idx  ${hasIdx('watch_session_meta_content_idx')}`);
  console.log(`  index watch_session_meta_device_idx   ${hasIdx('watch_session_meta_device_idx')}`);
  console.log(`  index push_subscriptions_user_idx     ${hasIdx('push_subscriptions_user_idx')}`);
  console.log(`  index push_subscriptions_endpoint_idx ${hasIdx('push_subscriptions_endpoint_idx')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
