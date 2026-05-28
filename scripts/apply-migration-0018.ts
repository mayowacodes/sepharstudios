#!/usr/bin/env bun
/**
 * Applier for migration 0018: creator_followers table.
 * Idempotent — safe to re-run.
 *
 *   $env:DATABASE_URL = 'postgresql://…'
 *   bun run scripts/apply-migration-0018.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0018_creator_followers.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const t = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename = 'creator_followers'
  `;
  const c = await sql<{ conname: string }[]>`
    SELECT conname FROM pg_constraint WHERE conname = 'creator_followers_creator_user_unique'
  `;
  console.log('\nVerification:');
  console.log(`  table creator_followers       ${t.length > 0 ? '✓' : '✗ MISSING'}`);
  console.log(`  unique (creator_id, user_id)  ${c.length > 0 ? '✓' : '✗ MISSING'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
