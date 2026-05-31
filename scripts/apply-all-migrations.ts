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
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const drizzleDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'drizzle');
const files = readdirSync(drizzleDir)
  .filter((f) => /^\d{4}_.+\.sql$/.test(f))
  .sort();

console.log(`Found ${files.length} migration files. Applying to:`);
console.log(`  ${databaseUrl.replace(/:[^@]+@/, ':***@')}\n`);

const sql = postgres(databaseUrl, {
  max: 1,
  onnotice: () => {} // suppress NOTICEs so we can see errors clearly
});

// Error codes that mean "this object already exists" — treat as success
// so the script can be re-run safely (the older migrations 0000-0022
// were not authored with IF NOT EXISTS everywhere). Pass STRICT=1 to
// fail on these instead.
//
// Codes ref: https://www.postgresql.org/docs/current/errcodes-appendix.html
//   42P07 duplicate_table
//   42710 duplicate_object (extensions / types / indexes)
//   42P06 duplicate_schema
//   42701 duplicate_column
//   42P03 duplicate_cursor
//   42P11 duplicate_database
const IDEMPOTENT_CODES = new Set(['42P07', '42710', '42P06', '42701', '42P03', '42P11', '23505']);
const STRICT = process.env.STRICT === '1';
const fromArg = process.argv.find((a) => a.startsWith('--from='))?.split('=')[1];
const fromNum = fromArg ? parseInt(fromArg, 10) : 0;

let failed = false;
let totalSkipped = 0;
let totalApplied = 0;

try {
  for (const file of files) {
    const numMatch = file.match(/^(\d{4})_/);
    const num = numMatch ? Number(numMatch[1]) : -1;
    if (num < fromNum) {
      console.log(`-  skip  ${file} (< --from=${fromNum})`);
      continue;
    }

    const path = resolve(drizzleDir, file);
    const body = readFileSync(path, 'utf-8');

    // Drizzle separates statements with `--> statement-breakpoint`
    const statements = body
      .split(/-->\s*statement-breakpoint/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.match(/^(--.*\n?)*$/));

    let appliedInFile = 0;
    let skippedInFile = 0;
    process.stdout.write(`→ ${file} (${statements.length} stmts) ... `);

    try {
      for (const stmt of statements) {
        try {
          await sql.unsafe(stmt);
          appliedInFile += 1;
        } catch (stmtErr) {
          const code = (stmtErr as { code?: string }).code;
          if (!STRICT && code && IDEMPOTENT_CODES.has(code)) {
            skippedInFile += 1;
            continue;
          }
          throw stmtErr;
        }
      }
      totalApplied += appliedInFile;
      totalSkipped += skippedInFile;
      console.log(skippedInFile > 0
        ? `✓ ${appliedInFile} new · ${skippedInFile} already-exists`
        : '✓');
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
    console.log(`\n✓ Done. ${totalApplied} statements applied · ${totalSkipped} already existed.`);
  } else {
    process.exitCode = 1;
  }
} finally {
  await sql.end();
}
