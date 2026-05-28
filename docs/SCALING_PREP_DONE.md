# Scaling Prep — What Was Done

> **TL;DR:** The web app is now replica-safe and backed by Redis for ephemeral state. You can run `replicas: 3` in Dokploy or move to Fly.io whenever you like; no in-memory state will misbehave across pods. Sister doc: [scaling-runbook.md](./scaling-runbook.md) covers the *future* steps for Postgres/MinIO/PaaS migration when you're ready. Deferred items live in [NEXT_ROUND.md](./NEXT_ROUND.md).

## Round 2 update — Redis migration

The Postgres-backed OTP and rate-limit stores from round 1 have been migrated to Redis (Dokploy-managed instance at `redis://default:***@213.136.92.11:4076`). Reasons:

- **Microsecond latency** vs ~1ms Postgres round-trip — matters on the AI rate-limit hot path.
- **Built-in TTL** removes the nightly cleanup cron.
- **Lua-script atomicity** for the rate-limit token bucket — one round-trip instead of an `INSERT ... ON CONFLICT` upsert.
- **Doesn't add write load to the primary DB**.

The Postgres `phone_otps` and `rate_limit_buckets` tables are kept in place as a rollback insurance policy — see NEXT_ROUND.md for the cleanup migration when you're confident in Redis.

Also added in this round (see git diff for full details):
- **`/api/files` auth** — was completely open; now requires sign-in for POST, admin for GET/PUT/DELETE.
- **OTP 60s cooldown** — anti-spam on `/api/subscriptions/send-otp` via Redis SET NX EX. Returns 429 with `Retry-After`.
- **Watch-progress race fix** — completion transition is now atomic (`UPDATE … WHERE NOT is_completed`), preventing double-claims of achievements/rewards.
- **Paystack webhook validation** — JSON.parse is guarded, missing fields per event type are now logged and skipped instead of crashing the handler.
- **Payment verify metadata validation** — replaced an unsafe `as unknown as` cast with explicit shape checks.
- **Carousel reactivity** — three props (`orientation`, `opts`, `plugins`) now reactive via `$effect`.
- **`requireAdmin` deduplicated** — shared helper in `$lib/server/admin-auth.ts`, applied to 16 admin API endpoints.
- **Drizzle journal rebuilt** — `_journal.json` now covers all 12 migrations; `scripts/backfill-migration-history.ts` populates `__drizzle_migrations` for fresh databases.
- **Profile type** — `'kid' → 'kids'` to match runtime + DB.
- **`/api/health`** — now probes DB **and Redis** and MinIO.
- **A11y, NODE_ENV, tailwind cleanup** — see git diff.

---

## Goal of this work

Make the application code multi-replica-safe **without adding new infrastructure**. Specifically:

- No Kubernetes.
- No Redis.
- Use the Postgres you already have to back the three pieces of state that used to live in process memory.
- Give the load balancer a real readiness signal.
- Write down what to do next so future-you doesn't have to rediscover it.

## The 5 changes

### 1. OTP store → Postgres
**Before:** `apps/web/src/lib/server/otp.ts` kept OTPs in a module-level `Map`. Two replicas broke verification randomly.
**After:** OTPs live in the new `phone_otps` table. Public API kept the same — `createOtp`, `verifyOtp`, `getPhoneHash` — but the first two are now `async`. Three call sites updated to `await`.

Files touched:
- [apps/web/src/lib/server/otp.ts](../apps/web/src/lib/server/otp.ts) — rewritten
- [apps/web/src/routes/api/subscriptions/send-otp/+server.ts](../apps/web/src/routes/api/subscriptions/send-otp/+server.ts) — `await createOtp`
- [apps/web/src/routes/api/subscriptions/start-trial/+server.ts](../apps/web/src/routes/api/subscriptions/start-trial/+server.ts) — `await verifyOtp`
- [apps/web/src/routes/api/payment/initialize/+server.ts](../apps/web/src/routes/api/payment/initialize/+server.ts) — `await verifyOtp`

Cleanup helper exported: `purgeExpiredOtps()`. Wire to a nightly cron job (e.g. via n8n) — runs `DELETE FROM phone_otps WHERE expires_at < now()`.

### 2. Rate-limit buckets → Postgres
**Before:** `apps/web/src/lib/server/rate-limit.ts` (the one we built two rounds ago) kept buckets in a module-level `Map`. With N replicas, the effective cap was N× the configured value.
**After:** Buckets live in the new `rate_limit_buckets` table. The whole token-refill-and-take operation is one `INSERT ... ON CONFLICT DO UPDATE` with row-level locking — atomic across replicas.

The public API surface (`enforceRateLimit`, `take`, `AI_CHAT_LIMIT`, `AI_AGENT_LIMIT`, `AI_SEARCH_LIMIT`) is unchanged but is now `async`. The seven AI endpoint call sites updated to `await`:

- [apps/web/src/routes/api/ai/companion/+server.ts](../apps/web/src/routes/api/ai/companion/+server.ts)
- [apps/web/src/routes/api/ai/tag/+server.ts](../apps/web/src/routes/api/ai/tag/+server.ts)
- [apps/web/src/routes/api/ai/moderate/+server.ts](../apps/web/src/routes/api/ai/moderate/+server.ts)
- [apps/web/src/routes/api/ai/nft/+server.ts](../apps/web/src/routes/api/ai/nft/+server.ts)
- [apps/web/src/routes/api/ai/creator-insights/+server.ts](../apps/web/src/routes/api/ai/creator-insights/+server.ts) (×2 — GET and POST)
- [apps/web/src/routes/api/ai/search/+server.ts](../apps/web/src/routes/api/ai/search/+server.ts)
- [apps/web/src/routes/api/ai/token-score/+server.ts](../apps/web/src/routes/api/ai/token-score/+server.ts)

Cleanup helper exported: `purgeStaleRateLimitBuckets()`. Wire to a nightly cron — runs `DELETE FROM rate_limit_buckets WHERE last_refill < now() - interval '30 minutes'`.

**Performance note:** One indexed Postgres write per AI call. Negligible at current load. If/when this becomes hot (~1000 AI calls/sec), swap the storage internals for Redis — the call sites do not change.

### 3. AI settings in-memory cache dropped
**Before:** `apps/web/src/lib/server/ai-settings.ts` cached `AIConfig` in process memory for 60 seconds. Multi-replica = up to 60 seconds of inconsistency after an admin changed the LLM model.
**After:** Cache removed. Every `getAIConfig()` call reads one row from `admin_settings` (sub-millisecond). The `bustAIConfigCache()` function is kept as a no-op for backwards compatibility.

Files touched:
- [apps/web/src/lib/server/ai-settings.ts](../apps/web/src/lib/server/ai-settings.ts) — cache deleted, public API unchanged.

### 4. Real `/api/health` endpoint
**Before:** Dockerfile health check did `fetch('/')` every 30 seconds — a full SSR render that proves nothing about DB or MinIO connectivity.
**After:** New endpoint runs a `SELECT 1` against Postgres + a HEAD on the MinIO `/minio/health/ready` URL. Returns `200 { status: 'ok', db, minio, uptimeSec }` when healthy, `503 { status: 'degraded', ... }` when not. Dockerfile updated to point its `HEALTHCHECK` at this.

Files touched:
- [apps/web/src/routes/api/health/+server.ts](../apps/web/src/routes/api/health/+server.ts) — new
- [Dockerfile](../Dockerfile) — updated `HEALTHCHECK` URL, timeout, start period

### 5. Scaling runbook written
- [docs/scaling-runbook.md](./scaling-runbook.md) — future-facing playbook covering:
  - When to scale (capacity ladder)
  - Stage 1: multi-replica on Dokploy + MinIO/Postgres externalisation choices
  - Stage 2: Fly.io migration
  - Stage 3: Kubernetes (only if you really need it)
  - Debugging order when things break at scale

## Database changes

New schema definitions in [apps/web/src/lib/db/schema/sepharstudios.ts](../apps/web/src/lib/db/schema/sepharstudios.ts):

```ts
phoneOtps         → phone_otps (phone_hash PK, otp, expires_at + index)
rateLimitBuckets  → rate_limit_buckets (key PK, tokens, last_refill + index)
```

New migration: [drizzle/0011_scaling_prep_stores.sql](../drizzle/0011_scaling_prep_stores.sql)

**To apply:** `bun drizzle-kit migrate` in the `apps/web` directory (against either dev or prod DB as needed).

## What we deliberately did NOT do

- ❌ Add Redis. Postgres handles the volume at this stage.
- ❌ Touch better-auth — its Drizzle adapter already shares sessions across replicas.
- ❌ Externalise MinIO or migrate Postgres. Those are in [scaling-runbook.md](./scaling-runbook.md) for the day you actually need them.
- ❌ Add Kubernetes manifests. The app is replica-safe; the deployment platform stays Dokploy until proven otherwise.

## Type-check status

`bun x svelte-check` passes with **0 errors** after all changes.

## Verification checklist (run after `bun drizzle-kit migrate`)

1. **Schema applied:** check that `phone_otps` and `rate_limit_buckets` exist in the dev DB with the expected indexes.
2. **Single-pod regression:** start the OTP flow on `/auth/register` or `/checkout`. OTP should still issue + verify normally.
3. **Health endpoint:** `curl http://localhost:3000/api/health` returns `200` with `db.ok = true` and `minio.ok = true`.
4. **Health failure mode:** stop the local Postgres container. Hit `/api/health` again — should be `503` with `db.ok = false`. Restart Postgres, hit again — back to `200`.
5. **Multi-pod simulation:** `docker compose up --scale sepharstudios=3`. Repeat the OTP flow with curl forced to round-robin — verification should succeed regardless of which replica issued the OTP. The `rate_limit_buckets` row count should not multiply with pod count.
6. **AI settings propagation:** with 3 replicas running, change the chat model in `/admin/settings`. Within one round-trip, every replica should report the new model (previously 60s window).

## Deployment

All changes are source files + a SQL migration. No new container, no new env vars.

1. Run `bun drizzle-kit migrate` against the production DB (idempotent — uses `CREATE TABLE IF NOT EXISTS`).
2. Build and push `manimasaun/sepharstudios:latest`.
3. Redeploy on Dokploy.

When you decide to actually scale, the runbook covers the rest.
