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

const filename = '0035_live_chat.sql';
const path = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);
  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN ('live_chat_messages')
  `;
  const idx = await sql<{ indexname: string }[]>`
    SELECT indexname FROM pg_indexes WHERE indexname = 'live_chat_messages_stream_idx'
  `;
  const hasTable = (n: string) => tables.some(t => t.tablename === n) ? '✓' : '✗ MISSING';
  const hasIdx = (n: string) => idx.some(i => i.indexname === n) ? '✓' : '✗ MISSING';
  console.log('\nVerification:');
  console.log(`  table live_chat_messages           ${hasTable('live_chat_messages')}`);
  console.log(`  index live_chat_messages_stream_idx ${hasIdx('live_chat_messages_stream_idx')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
