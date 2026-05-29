#!/usr/bin/env bun
/**
 * Apply every drizzle/*.sql migration in order, directly via the postgres
 * client (bypassing drizzle-kit's migrator which is silently failing on this
 * PG18 + Dokploy setup).
 *
 * Each .sql file is split on the standard drizzle separator
 * `--> statement-breakpoint`, then each statement runs in its own call.
 * NOTICEs are suppressed so the output is readable; ERROR halts immediately.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const drizzleDir = resolve(import.meta.dir, '..', 'drizzle');
const files = readdirSync(drizzleDir)
  .filter((f) => /^\d{4}_.+\.sql$/.test(f))
  .sort();

console.log(`Found ${files.length} migration files. Applying to:`);
console.log(`  ${databaseUrl.replace(/:[^@]+@/, ':***@')}\n`);

const sql = postgres(databaseUrl, {
  max: 1,
  onnotice: () => {} // suppress NOTICEs so we can see errors clearly
});

let failed = false;

try {
  for (const file of files) {
    const path = resolve(drizzleDir, file);
    const body = readFileSync(path, 'utf-8');

    // Drizzle separates statements with `--> statement-breakpoint`
    const statements = body
      .split(/-->\s*statement-breakpoint/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.match(/^(--.*\n?)*$/));

    process.stdout.write(`→ ${file} (${statements.length} stmts) ... `);

    try {
      for (const stmt of statements) {
        await sql.unsafe(stmt);
      }
      console.log('✓');
    } catch (err) {
      console.log('✗ FAILED');
      console.error(`\n${'━'.repeat(60)}`);
      console.error(`Migration: ${file}`);
      console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
      console.error('━'.repeat(60));
      failed = true;
      break;
    }
  }

  if (!failed) {
    console.log(`\n✓ All ${files.length} migrations applied successfully.`);
  } else {
    process.exitCode = 1;
  }
} finally {
  await sql.end();
}
