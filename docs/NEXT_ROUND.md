# Next Round — Deferred Work

> Updated after Round 6 — non-web3 audit cleanup. All 3 P0 + 3 P1 findings shipped. Highlights: encoder endpoints were calling `locals.auth.validate()` (a phantom method declared in `app.d.ts` but never implemented — entire creator upload flow was broken at runtime); playlist DELETE was missing ownership check; creator-application approval is now atomic via `db.transaction()`. `svelte-check` still reports 0 errors / 0 warnings. Remaining items below are mostly ops execution + the Comments system + treasury custody hardening.

## Round 6 — shipped

- **P0** Replaced `locals.auth.validate()` with `locals.auth.getSession()` across 6 encoder endpoints (`/api/encoder/jobs`, `/presigned`, `/jobs/[jobId]`, `/process`, `/jobs/[jobId]/playback`, `/jobs/[jobId]/commit`). Removed the phantom `validate` declaration from `app.d.ts` so this can't recur.
- **P0** Added playlist-ownership check to `DELETE /api/playlists/[id]/items` — any signed-in user could previously remove items from any playlist.
- **P0** Wrapped creator-application approval (creatorApplications update + user role bump + creators-profile upsert) in `db.transaction()` so partial failures roll back.
- **P1** Fixed notify.ts email opt-in default: now per-flag (matches schema column defaults — `newReleases`/`trialExpiry`/`paymentConfirmation` default true, `weeklyDigest`/`creatorUpdates` default false), instead of blanket "opted-in when no row exists."
- **P1** Added `creatorType` enum validation in `POST /api/creator/application` — restricted to `individual` | `organization` to match the application form.
- **P1** Added `notifications.user_id → user.id ON DELETE CASCADE` foreign key. Schema updated; new migration `drizzle/0014_notifications_user_fk.sql` backfills the constraint idempotently on existing prod data.

---

## Code-level items still pending

### Comments system
Explicitly skipped in Rounds 3 and 4. The smallest remaining feature build.

- Build a `comments` table.
- Build a `POST /api/comments` endpoint that calls `moderateComment(...)` from [apps/web/src/lib/server/ai-moderation.ts](../apps/web/src/lib/server/ai-moderation.ts) before persisting (mirrors what [apps/web/src/routes/api/reviews/+server.ts](../apps/web/src/routes/api/reviews/+server.ts) already does for reviews).
- Update the AI token-score caller in [apps/web/src/routes/api/watch/progress/+server.ts](../apps/web/src/routes/api/watch/progress/+server.ts) to set `leftComment: true` when applicable (currently hard-coded to false).
- Wire comment-submit notifications via the `notify(...)` helper.

### Treasury custody — production hardening
Round 4 shipped the testnet env-key custody approach. Before funding the mainnet treasury, swap the signing backend in [`apps/web/src/lib/server/stc-transfer.ts`](../apps/web/src/lib/server/stc-transfer.ts) to one of the production paths documented in [`docs/treasury-custody.md`](./treasury-custody.md):

- **AWS KMS / GCP KMS** (recommended for most teams) — ~$1/month, no raw key on the server.
- **Fireblocks / BitGo** — managed policy custody, ~$1000+/month, best with a finance team.
- **Gnosis Safe + KMS bot signer** — defence in depth, requires a worker.

The caller (`/api/users/me/stc-claim`) doesn't change; only the signer in `stc-transfer.ts` does.

### Settlement-retry worker
Currently if the on-chain transfer succeeds but the DB update fails, the user gets the tokens but the rows stay `pending`. A retry of `/api/users/me/stc-claim` would send the tokens again — soft duplicate.

- Add a periodic worker that scans for users with `transactions.status='pending'` + on-chain balance differences and reconciles.
- Or: add an idempotency token to the claim flow so a retry within N minutes recognises the prior tx.

Low-priority — only matters once volume is real.

---

## Ops items (not code — for you to execute)

### Apply pending schema changes

The notifications table (0012), the legacy-OTP/rate-limit drop (0013), and the notifications FK (0014) need to be applied to production:

```powershell
$env:DATABASE_URL = "postgresql://…"
bun run scripts/apply-migrations-0012-0013.ts
# then apply 0014:
psql $env:DATABASE_URL -f drizzle/0014_notifications_user_fk.sql
```

The 0014 migration is idempotent (DO-block checks `pg_constraint`) so it's safe to re-run. No code change required at runtime; the FK only affects writes (orphaned-userId inserts will fail) and cascade deletes when a user row is removed.

### Deploy STC token contract to Amoy, then set env vars
Round 4 wired the settlement code but [`PUBLIC_STC_TOKEN_AMOY`](../.env#L52) is empty. Sequence:

1. Deploy the STC token contract to Polygon Amoy testnet (your existing Hardhat / Foundry pipeline in `packages/contracts/`).
2. Copy the deployed address into Dokploy env: `PUBLIC_STC_TOKEN_AMOY=0x…`.
3. Generate a fresh treasury wallet (`viem.generatePrivateKey()` or `cast wallet new`).
4. Fund it with testnet STC + a small amount of MATIC for gas.
5. Set `TREASURY_PRIVATE_KEY` in Dokploy env.
6. Restart the app.
7. Test the claim flow on Amoy (see [`docs/treasury-custody.md`](./treasury-custody.md) § Verification).

### Execute the Postgres + MinIO migrations when ready
Scripts in place — execute when you commit to managed infra:

- `scripts/dump-prod-postgres.ps1` — dumps prod Postgres to a local `.sql`.
- `scripts/mirror-minio-to-s3.sh` — mirrors prod MinIO bucket to a managed S3-compatible target.

See [`docs/scaling-runbook.md`](./scaling-runbook.md) Stage 1 for end-to-end steps.

### Deploy Metabase
Runbook is at [`docs/metabase-setup.md`](./metabase-setup.md). The Dokploy service is already provisioned; click Deploy and follow §1–§4.

### Drop Directus + Grafana on Dokploy
Both flagged as redundant in the services audit (Round 2). Click-ops in Dokploy:

- **Directus** duplicates the custom admin section.
- **Grafana** has no metric source; covered by Uptime Kuma + Metabase.

### Set Openpanel env vars
After creating an Openpanel project, paste these into Dokploy's env vars panel:

```
PUBLIC_OPENPANEL_CLIENT_ID=<from Openpanel dashboard>
OPENPANEL_API_KEY=<from Openpanel dashboard>
```

Until both are set, `$lib/server/analytics.ts` no-ops, the client script doesn't load, and the new `sign_up` + `watch_start` events don't fire — silent but safe.

---

## Svelte 5 reactivity warnings — verified false positives (do NOT touch)

Round 3 added `<!-- svelte-ignore -->` comments to each so `svelte-check` reports 0 warnings. The justifications stay valid:

- [lib/components/team-switcher.svelte:8](../apps/web/src/lib/components/team-switcher.svelte#L8) — `teams`
- [lib/components/kids/BibleQuizCard.svelte:18-19](../apps/web/src/lib/components/kids/BibleQuizCard.svelte#L18) — `sessionId`, `questions`
- [routes/(protected)/profiles/+page.svelte:45,47](../apps/web/src/routes/(protected)/profiles/+page.svelte#L45) — `data`
- [lib/components/ui/chart-container.svelte:20](../apps/web/src/lib/components/ui/chart/chart-container.svelte#L20) — `id`
- [lib/components/ui/toggle-group.svelte:36-38](../apps/web/src/lib/components/ui/toggle-group/toggle-group.svelte#L36) — `variant`, `size`, `spacing`
- [lib/components/ui/carousel/carousel.svelte:25,29,30](../apps/web/src/lib/components/ui/carousel/carousel.svelte#L25) — synced via `$effect` blocks

---

## Owner notes

Three things left to plan a future session around:

1. **Comments system** (1-day code feature) — only remaining standalone feature.
2. **Treasury custody hardening** (multi-day) — must land before mainnet funding.
3. **Ops execution** — apply migrations, deploy contracts, deploy Metabase, drop redundant Dokploy services. All click/CLI work, no code.

The Round 4 work itself is testnet-ready as shipped — fund the Amoy treasury and you have a working claim flow.
