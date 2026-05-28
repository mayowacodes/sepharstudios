# Scaling Runbook — Sephar Studios

> **Status:** This document captures the future-facing decisions that aren't urgent today but will be needed when the app outgrows its single-VPS deployment. Read this *before* you scale, not during the incident.

## Current state (as of this writing)

- **Web tier:** SvelteKit + `adapter-node`, packaged via Bun, deployed as a single container on Dokploy. Traefik handles TLS + host routing for `sepharstudios.com`, `admin.sepharstudios.com`, `creators.sepharstudios.com`.
- **Postgres:** Single external instance at `213.136.92.11:6060` (Drizzle ORM).
- **MinIO:** Single container in the same compose file with a local volume.
- **Ollama:** Single container, runs gemma4 + hermes3 locally.
- **Bunny CDN:** Already external — video delivery is independent of the web tier.
- **Encoder orchestrator:** Already external at `orchestrator.sepharstudios.com`.

The app itself is **replica-safe today** (see `SCALING_PREP_DONE.md`). What's not yet replica-safe is the surrounding infrastructure.

---

## Capacity ladder

| Stage | Symptom that triggers the move | Action |
|---|---|---|
| Today | <1K MAU, single box handles it | Do nothing. Keep watching CPU + DB latency. |
| Stage 1 | Single-box CPU regularly >70%, or first paid revenue at risk if box dies | Add multi-replica (Stage 1 below). |
| Stage 2 | >10K MAU, or international audience asking for low-latency playback | Move web tier to Fly.io multi-region (Stage 2 below). |
| Stage 3 | Regulatory needs, dedicated platform engineer on payroll | Talk K8s. Not before. |

---

## Stage 1 — Multi-replica on Dokploy

### What changes infrastructure-wise

```yaml
# docker-compose.yml — bump replicas in the sepharstudios service
services:
  sepharstudios:
    deploy:
      replicas: 3
      update_config:
        order: start-first   # zero-downtime rolling deploys
        parallelism: 1
```

Traefik already round-robins because the labels are stateless. No nginx affinity / session-stickiness rules needed.

### What MUST be done first

#### A) MinIO → distributed or managed

Single-node MinIO in a compose volume **breaks** when there are multiple web replicas because each pod could see different bucket contents during deploys. Pick one:

- **Option A1: Distributed MinIO (4 nodes, erasure-coded).** Same compose file, just more services + a shared overlay network. App code does not change — the `lib/server/minio.ts` client connects to whichever endpoint env points at. Lowest cost, most ops work.
- **Option A2: Replace with managed S3-compatible storage.** Recommended choices:
  - **Backblaze B2** — cheapest, no egress fee to Cloudflare.
  - **Cloudflare R2** — zero egress, great if Bunny CDN is also fronting things.
  - **Wasabi** — flat-rate, predictable bills.
  - All three speak the S3 API. Update env vars only:
    ```
    MINIO_ENDPOINT=<provider endpoint>
    MINIO_PORT=443
    MINIO_USE_SSL=true
    MINIO_ACCESS_KEY=<provider key>
    MINIO_SECRET_KEY=<provider secret>
    MINIO_BUCKET=sepharstudios-storage
    ```
  - No source code change needed — `lib/server/minio.ts` already uses the `minio` SDK which is S3-API-compatible.

**Migration:** `mc mirror local-minio/sephar-uploads new-bucket/sephar-uploads` (1-time copy). Sanity-check object counts. Cut over env vars. Done.

#### B) Postgres → managed (eventually)

The current Postgres at `213.136.92.11` is fine until it dies. The day it dies, you'll wish you'd already migrated. Recommended targets:

- **Supabase** — easiest migration, has connection pooling baked in.
- **Neon** — branchable databases, serverless scaling.
- **Railway Postgres** — same hosting as your other Railway services if you ever move there.
- **AWS RDS / DigitalOcean Managed Postgres** — boring + proven.

**Migration steps:**
1. `.\scripts\dump-prod-postgres.ps1` — wraps `pg_dump --no-owner --no-acl` with sane defaults.
2. Provision the new managed instance.
3. `psql <new_url> < <dump-file>.sql`
4. Run `bun drizzle-kit migrate` against the new DB to confirm schema matches.
5. Update `DATABASE_URL` in Dokploy env. Roll the web tier.
6. Keep the old DB read-only for 24h as a fallback.

See `docs/metabase-setup.md` § 6 for the Metabase reconnection step if applicable.

No application code changes — Drizzle works against any Postgres.

#### C) Already done in this round (see `SCALING_PREP_DONE.md`)
- OTP store moved from in-memory Map → Postgres `phone_otps` table.
- Rate-limit buckets moved from in-memory Map → Postgres `rate_limit_buckets` table.
- AI settings 60s cache dropped — every replica reads fresh from DB.
- `/api/health` endpoint verifies DB + MinIO reachability for the LB.

---

## Stage 2 — Fly.io (or similar PaaS)

When you've outgrown Dokploy or want multi-region for performance:

### Why Fly.io specifically
- `adapter-node` runs unchanged.
- Per-region replicas with automatic geo-routing.
- Fly Postgres (or keep your managed Postgres elsewhere).
- Bunny CDN already handles video edge — Fly handles SSR edge.
- Same Docker image you already build.

### Migration outline
1. Provision Fly Postgres (or point at your existing managed Postgres if it's cloud-hosted with sub-50ms latency to Fly regions).
2. `fly launch --image manimasaun/sepharstudios:latest` in your primary region.
3. Set env vars via `fly secrets set` — same values as Dokploy.
4. Add `[[mounts]]` if you keep MinIO local; otherwise point at managed S3.
5. `fly scale count 2 --region lhr` etc. for multi-region.
6. Update DNS to point at the Fly anycast IPs.

Dokploy stays useful for the database and CI artefacts.

### Cost ballpark
~$30–80/month for two regions + small Postgres + small Redis (if added). Cheaper than DIY at this scale once you factor in your time.

---

## Stage 3 — Kubernetes

Skip unless:
- You have multi-region with multiple sovereign clouds.
- A dedicated platform engineer is on payroll.
- Compliance (HIPAA, PCI, SOC 2) demands K8s primitives.

If/when you go:
- **Managed control plane:** GKE Autopilot, EKS Fargate, DigitalOcean Kubernetes — never roll your own.
- **Storage:** managed Postgres + managed S3 (no in-cluster MinIO).
- **Secrets:** External Secrets Operator → AWS Secrets Manager / GCP Secret Manager.
- **Observability:** Prometheus + Grafana + Loki, or Datadog/New Relic if you'd rather pay.
- **Ingress:** Traefik IngressRoute or NGINX Ingress. Keep the same hostname rules already in `docker-compose.yml`.

For Ollama: move to a GPU node pool, **or just drop it** and route everything through OpenRouter. The cost crossover happens around ~10M tokens/month.

---

## What we explicitly do NOT need

- ❌ Redis. Postgres handles OTP + rate-limit fine until ~1000 AI calls/sec.
- ❌ Sticky sessions. No WebSockets/SSE in the app.
- ❌ A session store other than the existing Drizzle-backed `session` table.
- ❌ A separate Node.js worker pool. The encoder is already external.
- ❌ Service mesh, sidecars, etc. We're not at that scale yet (and may never be).

---

## When something breaks at scale — debugging order

1. **Check `/api/health` first.** If it's `degraded`, you know whether Postgres or MinIO is the problem before opening logs.
2. **Check Postgres connections.** Drizzle uses one client per process — multiple replicas multiply connection count. Bump max_connections or add PgBouncer if you see saturation.
3. **Check Bunny CDN.** Video playback issues are almost always there, not in the app.
4. **Check the rate-limit table size.** If `rate_limit_buckets` has > 100K rows, the nightly purge stopped running — wire it back up.
5. **Check OpenRouter quota.** If AI endpoints 503 in bursts, that's a billing issue, not a code issue.

---

## Owner

This runbook should be reviewed any time you:
- Add a new external service.
- Change `DATABASE_URL` or `MINIO_*` env vars.
- Add a new piece of in-memory state (don't).
- Cross 1K MAU.
