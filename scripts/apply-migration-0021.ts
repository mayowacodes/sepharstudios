#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0021_staking_indexer_and_event_reminders.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN ('stc_stakes', 'cron_state')
  `;
  const col = await sql<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'event_registrations' AND column_name = 'reminder_sent_at'
  `;
  console.log('\nVerification:');
  console.log(`  table stc_stakes                                 ${tables.some(t => t.tablename === 'stc_stakes') ? '✓' : '✗ MISSING'}`);
  console.log(`  table cron_state                                 ${tables.some(t => t.tablename === 'cron_state') ? '✓' : '✗ MISSING'}`);
  console.log(`  event_registrations.reminder_sent_at column      ${col.length > 0 ? '✓' : '✗ MISSING'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
