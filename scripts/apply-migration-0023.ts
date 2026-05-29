#!/usr/bin/env bun
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const filename = '0023_support_forum_demographics.sql';
const path = resolve(import.meta.dir, '..', 'drizzle', filename);
const body = readFileSync(path, 'utf-8');

const sql = postgres(databaseUrl, { max: 1 });

try {
  console.log(`\nApplying ${filename} …`);
  await sql.unsafe(body);
  console.log(`✓ ${filename}`);

  const tables = await sql<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE tablename IN (
      'support_tickets', 'forum_threads', 'forum_replies', 'forum_likes'
    )
  `;
  const cols = await sql<{ table_name: string; column_name: string }[]>`
    SELECT table_name, column_name FROM information_schema.columns
    WHERE (table_name = 'sponsorship_applications' AND column_name = 'documents')
       OR (table_name = 'notification_preferences' AND column_name = 'event_reminders')
       OR (table_name = 'user' AND column_name IN ('date_of_birth', 'gender'))
  `;
  const constraints = await sql<{ conname: string }[]>`
    SELECT conname FROM pg_constraint WHERE conname IN (
      'forum_replies_parent_reply_id_fk',
      'forum_likes_target_check'
    )
  `;
  const has = (t: string) => tables.some(r => r.tablename === t) ? '✓' : '✗ MISSING';
  const hasCol = (t: string, c: string) => cols.some(r => r.table_name === t && r.column_name === c) ? '✓' : '✗ MISSING';
  const hasCon = (c: string) => constraints.some(r => r.conname === c) ? '✓' : '✗ MISSING';

  console.log('\nVerification:');
  console.log(`  table support_tickets                            ${has('support_tickets')}`);
  console.log(`  table forum_threads                              ${has('forum_threads')}`);
  console.log(`  table forum_replies                              ${has('forum_replies')}`);
  console.log(`  table forum_likes                                ${has('forum_likes')}`);
  console.log(`  forum_replies.parent_reply_id self-ref           ${hasCon('forum_replies_parent_reply_id_fk')}`);
  console.log(`  forum_likes target check                         ${hasCon('forum_likes_target_check')}`);
  console.log(`  sponsorship_applications.documents               ${hasCol('sponsorship_applications', 'documents')}`);
  console.log(`  notification_preferences.event_reminders         ${hasCol('notification_preferences', 'event_reminders')}`);
  console.log(`  user.date_of_birth                               ${hasCol('user', 'date_of_birth')}`);
  console.log(`  user.gender                                      ${hasCol('user', 'gender')}`);
} catch (err) {
  console.error('\nMigration failed:', err);
  process.exitCode = 1;
} finally {
  await sql.end();
}
