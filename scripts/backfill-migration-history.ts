#!/usr/bin/env bun
/**
 * Backfill `drizzle.__drizzle_migrations` so `bun drizzle-kit migrate` recognises
 * the migrations 0000–0011 as already-applied. The database has these tables
 * applied (we know — migration 0011 was already created with the apply-migration
 * script), but the migrations table in the `drizzle` schema does not reflect
 * that, which is why `drizzle-kit migrate` keeps trying to replay from 0000.
 *
 * Drizzle's migrator computes the `hash` column as the SHA-256 hex digest of
 * the raw SQL file contents (newline-terminated). We replicate that here and
 * insert one row per migration tag, with `created_at` = the journal's `when`.
 *
 * Idempotent — uses ON CONFLICT DO NOTHING on the hash column. Safe to re-run.
 *
 * Usage:
 *   $env:DATABASE_URL = '...'  # PowerShell
 *   bun run scripts/backfill-migration-history.ts
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import postgres from 'postgres';

interface JournalEntry {
  idx: number;
  when: number;
  tag: string;
}

interface Journal {
  entries: JournalEntry[];
}

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const drizzleDir = resolve(import.meta.dir, '..', 'drizzle');
const journal = JSON.parse(readFileSync(resolve(drizzleDir, 'meta', '_journal.json'), 'utf-8')) as Journal;

const sql = postgres(databaseUrl, { max: 1 });

try {
  // Drizzle creates the schema + table on first migrate. If it doesn't exist yet,
  // create it so the INSERT below has a target.
  await sql.unsafe(`CREATE SCHEMA IF NOT EXISTS drizzle`);
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  let inserted = 0;
  let skipped = 0;
  for (const entry of journal.entries) {
    const sqlPath = resolve(drizzleDir, `${entry.tag}.sql`);
    let body: string;
    try {
      body = readFileSync(sqlPath, 'utf-8');
    } catch {
      console.warn(`[skip] ${entry.tag}: SQL file missing at ${sqlPath}`);
      skipped++;
      continue;
    }
    const hash = createHash('sha256').update(body).digest('hex');
    const exists = await sql<{ id: number }[]>`
      SELECT id FROM drizzle.__drizzle_migrations WHERE hash = ${hash} LIMIT 1
    `;
    if (exists.length > 0) {
      console.log(`[present] ${entry.tag} (hash ${hash.slice(0, 8)}…)`);
      skipped++;
      continue;
    }
    await sql`
      INSERT INTO drizzle.__drizzle_migrations (hash, created_at)
      VALUES (${hash}, ${entry.when})
    `;
    console.log(`[inserted] ${entry.tag} (hash ${hash.slice(0, 8)}…)`);
    inserted++;
  }

  console.log(`\nDone. Inserted ${inserted}, skipped ${skipped}.`);
  console.log('You can now run `bun drizzle-kit migrate` for future migrations.');
} catch (err) {
  console.error('Backfill failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
