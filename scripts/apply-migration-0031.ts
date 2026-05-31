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

const filename = '0031_agent_runs.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN ('agent_runs')
  `;
  const indexes = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname IN (
      'agent_runs_agent_idx', 'agent_runs_status_idx'
    )
  `;
  const hasTable = (name: string) => tables.some(t => t.tablename === name) ? '✓' : '✗ MISSING';
  const hasIdx = (name: string) => indexes.some(i => i.indexname === name) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  table agent_runs              ${hasTable('agent_runs')}`);
  console.log(`  index agent_runs_agent_idx    ${hasIdx('agent_runs_agent_idx')}`);
  console.log(`  index agent_runs_status_idx   ${hasIdx('agent_runs_status_idx')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
