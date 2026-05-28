#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0020_events.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN ('events', 'event_registrations')
  `;
  const uniq = await sql<{ conname: string }[]>`
    SELECT conname FROM pg_constraint WHERE conname = 'event_registrations_event_user_unique'
  `;
  console.log('\nVerification:');
  console.log(`  table events                  ${tables.some(t => t.tablename === 'events') ? '✓' : '✗ MISSING'}`);
  console.log(`  table event_registrations     ${tables.some(t => t.tablename === 'event_registrations') ? '✓' : '✗ MISSING'}`);
  console.log(`  unique(event_id, user_id)     ${uniq.length > 0 ? '✓' : '✗ MISSING'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
