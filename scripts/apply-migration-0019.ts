#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0019_content_assignment.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const cols = await sql<{ column_name: string }[]>`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'media_library' AND column_name IN ('assigned_to', 'assigned_at')
  `;
  console.log('\nVerification:');
  console.log(`  media_library.assigned_to   ${cols.some(c => c.column_name === 'assigned_to') ? '✓' : '✗ MISSING'}`);
  console.log(`  media_library.assigned_at   ${cols.some(c => c.column_name === 'assigned_at') ? '✓' : '✗ MISSING'}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
