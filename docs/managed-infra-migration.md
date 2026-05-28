# Managed Infrastructure Migration

> Companion to [`docs/scaling-runbook.md`](./scaling-runbook.md) (strategic capacity ladder). This doc is the **action list** for moving Postgres + MinIO off the single-VPS Dokploy stack and onto managed providers. Execute when Stage 1 of the runbook triggers, not before.

## Why this matters

The current stack runs both Postgres and MinIO on a single VPS at `213.136.92.11`. The day that box dies — drive failure, network partition, accidental `docker volume rm` — the app goes down and the data goes with it. Managed providers solve three problems at once:

1. **Durability:** automated backups, point-in-time recovery, multi-AZ replicas.
2. **Scalability:** vertical resize without rebooting the app, connection pooling for replicas.
3. **Operational burden:** patching, security updates, monitoring — not your job.

Neither migration requires application code changes. Drizzle works against any Postgres; the `minio` SDK is S3-compatible.

---

## Part 1 — Postgres → managed provider

### Provider choice

| Provider | Best when | Notes |
|---|---|---|
| **Supabase** | You want PgBouncer + dashboard included | Free tier exists; ~$25/mo for production |
| **Neon** | You want serverless + branching for staging | Free tier generous; great for low-traffic |
| **Railway Postgres** | You're already considering Railway for everything | Simple pricing, ~$20/mo |
| **AWS RDS** | You need SOC2/HIPAA paperwork or already in AWS | More setup, more control, ~$50+/mo |
| **DigitalOcean Managed Postgres** | You want boring + cheap | ~$15/mo, no surprises |

**Recommendation for first move: Supabase.** Easiest migration, baked-in pooler (avoid Drizzle connection exhaustion when scaling replicas), and you can re-use their dashboard until Metabase is up.

### Step 1 — Install prerequisites

`pg_dump` is required. Install PostgreSQL client tools (matching prod's major version):

```powershell
winget install PostgreSQL.PostgreSQL.17
# add to PATH for current session (or restart shell):
$env:Path += ";C:\Program Files\PostgreSQL\17\bin"
pg_dump --version   # verify
```

(Match the major version to whatever the prod server runs. Check via Dokploy or `SELECT version();` over an existing connection.)

### Step 2 — Dump the current prod database

```powershell
# from project root
$env:DATABASE_URL = "postgresql://<user>:<pass>@213.136.92.11:6060/sepharstudios"
.\scripts\dump-prod-postgres.ps1
# writes sepharstudios-YYYYMMDD-HHmm.sql in the current directory
```

The script wraps `pg_dump --no-owner --no-acl --format=plain` so the dump restores cleanly into any new instance. Expect 10–500 MB depending on `transactions` + `notifications` table size.

> **Tip**: Run during low traffic. A `pg_dump` against a live DB takes a consistent snapshot but holds shared locks for the duration. Aim for a window where no large reads (analytics, admin dashboards) are running.

### Step 3 — Provision the managed instance

Provider-specific, but the gist is the same everywhere:

1. Create a new Postgres instance. Match or exceed the current major version.
2. Whitelist your IP for the initial restore. Whitelist Dokploy's outbound IP for the app cutover.
3. Copy the connection string. It'll look like:
   ```
   postgresql://<user>:<pass>@<host>.supabase.co:5432/postgres
   ```
4. Save it as `NEW_DATABASE_URL` — don't overwrite the old `DATABASE_URL` yet.

### Step 4 — Restore the dump

```powershell
$env:NEW_DATABASE_URL = "postgresql://<user>:<pass>@<host>.supabase.co:5432/postgres"
psql $env:NEW_DATABASE_URL -f sepharstudios-YYYYMMDD-HHmm.sql
```

Expect lots of `CREATE TABLE` / `COPY` output. Some `NOTICE` lines about extensions or owners are normal. **Hard failures** (red `ERROR:` lines) need investigation — copy-paste them and resolve before moving on.

### Step 5 — Confirm schema parity

The dump captures the data, but Drizzle's migration journal is the source of truth for schema. Verify nothing's drifted:

```powershell
cd apps/web
$env:DATABASE_URL = $env:NEW_DATABASE_URL    # swap for the verification only
bun x drizzle-kit migrate
```

If everything's already applied, drizzle-kit reports "No migrations to apply." If it tries to run any migrations, **stop** — that means the dump came from a DB that was missing recent migrations, which is a bug to investigate.

### Step 6 — Spot-check critical tables

```powershell
psql $env:NEW_DATABASE_URL -c "SELECT count(*) FROM `"user`";"
psql $env:NEW_DATABASE_URL -c "SELECT count(*) FROM media_library;"
psql $env:NEW_DATABASE_URL -c "SELECT count(*) FROM transactions;"
psql $env:NEW_DATABASE_URL -c "SELECT count(*) FROM notifications;"
```

Compare to the same counts against the old DB. They should match exactly.

### Step 7 — Cut over

1. In Dokploy: update `DATABASE_URL` env var to the new managed instance's connection string.
2. Click **Redeploy**.
3. Watch the app logs — first ~30s of startup should show successful DB queries (`/api/health` returns 200).
4. Smoke-test: sign in, load the home feed, play a video. If watch-progress writes succeed (check the `transactions` table on the new DB), you're done.

### Step 8 — Keep the old DB warm for 24h

Don't tear down the old instance yet. If something turns up over the next day (a query the new provider doesn't like, a connection pool issue, etc.), you can flip `DATABASE_URL` back in 30 seconds. After 24h of clean operation, decommission the old instance.

### If you can't install `psql`

Same trick as we used for migrations: use a Bun script with the `postgres` npm package. For a full schema+data restore this is slower than `psql` (no native binary copy support), but it works:

```typescript
// scripts/restore-dump.ts — quick adaptation if pg_dump install isn't possible
import { readFileSync } from 'node:fs';
import postgres from 'postgres';

const sql = postgres(process.env.NEW_DATABASE_URL!, { max: 1 });
const dump = readFileSync(process.argv[2], 'utf-8');

// Postgres-js can't run an entire dump in one go; split on `;` at statement boundaries.
// For small dumps this is fine; for >100MB dumps install psql.
const statements = dump.split(/;\s*\n/).filter(s => s.trim());
for (const stmt of statements) {
  try { await sql.unsafe(stmt); } catch (e) { console.error('Failed:', stmt.slice(0, 80), e); }
}
await sql.end();
```

This is genuinely worse than `psql` (worse error reporting, slower, can break on dollar-quoted bodies). Use only if installing PG client tools is impossible.

---

## Part 2 — MinIO → S3-compatible managed storage

### Provider choice

| Provider | Best when | Cost |
|---|---|---|
| **Cloudflare R2** | Already using Cloudflare; zero egress fees | $0.015/GB-month + $0 egress |
| **Backblaze B2** | Cheapest raw storage | $0.006/GB-month + ~$0.01/GB egress |
| **Wasabi** | Predictable flat-rate, no egress fees | $6.99/TB-month minimum |
| **AWS S3** | Already in AWS | $0.023/GB + egress |

**Recommendation: Cloudflare R2.** Zero egress means no surprise bills when Bunny CDN refreshes its cache, and your dev iteration is free.

### Step 1 — Install `mc` (MinIO Client)

```powershell
# Option 1 — direct download (Windows)
Invoke-WebRequest -Uri https://dl.min.io/client/mc/release/windows-amd64/mc.exe -OutFile $env:USERPROFILE\mc.exe
# add to PATH for current session:
$env:Path += ";$env:USERPROFILE"
mc --version
```

(For WSL/Linux: `curl https://dl.min.io/client/mc/release/linux-amd64/mc -o mc && chmod +x mc && sudo mv mc /usr/local/bin/`)

### Step 2 — Create the target bucket on the managed provider

Provider UIs vary, but you want:

1. Create a bucket named `sepharstudios-storage` (or whatever you'll use — match `MINIO_BUCKET` env var).
2. Generate an access key / secret key with read+write permissions on that bucket.
3. Note the endpoint URL — e.g. `https://<account_id>.r2.cloudflarestorage.com` for R2.

### Step 3 — Run the mirror script

The repo ships `scripts/mirror-minio-to-s3.sh`. It uses bash, so run via WSL or git-bash:

```bash
# from project root, in WSL or git-bash
export MINIO_ROOT_PASSWORD="<from DOKPLOY_ENV.txt>"
export TARGET_ENDPOINT="https://<account_id>.r2.cloudflarestorage.com"
export TARGET_ACCESS_KEY="<r2 access key>"
export TARGET_SECRET_KEY="<r2 secret key>"

bash scripts/mirror-minio-to-s3.sh
```

The script:
1. Sets up `mc` aliases for source (prod MinIO) and target (R2/B2/Wasabi).
2. Creates the target bucket if it doesn't exist.
3. Runs `mc mirror --overwrite --preserve` — copies all objects, preserves timestamps, idempotent.

Mirror is **non-destructive** on the target. You can re-run it any time to catch newly-uploaded objects.

### Step 4 — Verify object counts match

```bash
mc ls --recursive prod-minio/sepharstudios-storage    | wc -l
mc ls --recursive new-storage/sepharstudios-storage   | wc -l
```

Numbers should be identical. If the target has fewer objects, re-run the mirror — `mc mirror` skips already-copied objects so re-runs are fast.

### Step 5 — Update Dokploy env vars

In the Dokploy env panel, replace the `MINIO_*` block:

```bash
MINIO_ENDPOINT=<account_id>.r2.cloudflarestorage.com    # NO https:// prefix
MINIO_PORT=443
MINIO_USE_SSL=true
MINIO_ACCESS_KEY=<r2 access key>
MINIO_SECRET_KEY=<r2 secret key>
MINIO_BUCKET=sepharstudios-storage
```

> **Important**: `MINIO_ENDPOINT` is the *hostname only* — no scheme, no path. The `minio` SDK constructs the URL from `MINIO_USE_SSL` + `MINIO_ENDPOINT` + `MINIO_PORT`.

### Step 6 — Redeploy + smoke-test

1. Click **Redeploy** in Dokploy.
2. Hit `/api/health` — should return 200 with `minio: ok`.
3. Upload a test file via `/api/files` (or any creator-side upload flow). Confirm:
   - The HTTP response is 200 and includes the file URL.
   - The object appears in the R2 bucket via R2's dashboard.
   - You can GET it back via the URL the API returned.

### Step 7 — One last full sync, then cutover

Right before declaring done, run the mirror script one more time to catch any objects uploaded between the initial mirror (Step 3) and the cutover (Step 5). Because the app now writes to R2, this final sync only needs to catch the writes that happened in the gap window.

### Step 8 — Keep the old MinIO running for 24h

Same logic as Postgres — leave it warm in case you need to roll back. After 24h of clean operation, you can decommission the MinIO container + delete its volume.

---

## Rollback

Both migrations are designed for fast rollback:

### Postgres rollback

```
# In Dokploy env panel:
DATABASE_URL=<old connection string>
# Click Redeploy.
```

Any writes that happened to the new DB *after cutover* are lost. If the old DB was still running during the window, no data loss. If you noticed the issue within minutes, the loss window is minutes.

### MinIO rollback

```
# In Dokploy env panel:
MINIO_ENDPOINT=<old host>
MINIO_PORT=<old port>
MINIO_USE_SSL=<old setting>
MINIO_ACCESS_KEY=<old key>
MINIO_SECRET_KEY=<old secret>
# Click Redeploy.
```

Any objects uploaded to the new storage *after cutover* won't be visible. Mirror them back with `mc mirror new-storage/<bucket> prod-minio/<bucket>` once you've decided to abandon the rollback.

---

## Combined checklist

### Postgres
- [ ] `pg_dump` installed and on PATH.
- [ ] `DATABASE_URL` set in PowerShell session.
- [ ] `.\scripts\dump-prod-postgres.ps1` produces a `.sql` file.
- [ ] Managed instance provisioned. `NEW_DATABASE_URL` captured.
- [ ] `psql $NEW_DATABASE_URL -f <dump>.sql` succeeds with no hard errors.
- [ ] `bun x drizzle-kit migrate` reports "No migrations to apply."
- [ ] Row counts match between old and new on key tables.
- [ ] Dokploy `DATABASE_URL` updated and app redeployed.
- [ ] `/api/health` returns 200.
- [ ] Smoke test: sign-in, watch progress writes, claim flow (if treasury is configured).
- [ ] Old DB kept warm 24h, then decommissioned.

### MinIO
- [ ] `mc` (MinIO Client) installed and on PATH.
- [ ] Target bucket exists on the managed provider; access/secret keys generated.
- [ ] Source/target env vars exported.
- [ ] `bash scripts/mirror-minio-to-s3.sh` completes without errors.
- [ ] Object counts match between old and new buckets.
- [ ] Dokploy `MINIO_*` env vars updated; `MINIO_ENDPOINT` is hostname-only.
- [ ] App redeployed; `/api/health` reports `minio: ok`.
- [ ] Upload smoke test succeeds end-to-end.
- [ ] Final mirror sync run after cutover to catch gap-window writes.
- [ ] Old MinIO container kept running 24h, then decommissioned.

---

## What to do *after* both migrations

1. Update [`docs/scaling-runbook.md`](./scaling-runbook.md) § Current state to reflect the new providers.
2. Add the new provider's incident page to your monitoring (status.supabase.com, status.cloudflare.com, etc.).
3. Confirm automated backups are enabled on the managed Postgres. Default is usually 7-day retention — bump to 30 if your provider allows.
4. Configure billing alerts. Both R2 and managed Postgres have tier breakpoints where costs jump; you want a heads-up before hitting them.
