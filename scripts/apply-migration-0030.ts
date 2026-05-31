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

const filename = '0030_copilot_layer2.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN (
      'copilot_conversations', 'copilot_messages', 'ai_action_log'
    )
  `;
  const hasTable = (name: string) => tables.some(t => t.tablename === name) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  table copilot_conversations    ${hasTable('copilot_conversations')}`);
  console.log(`  table copilot_messages         ${hasTable('copilot_messages')}`);
  console.log(`  table ai_action_log            ${hasTable('ai_action_log')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
