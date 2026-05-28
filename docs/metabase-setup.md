# Metabase setup runbook

> Metabase is provisioned on Dokploy but not yet deployed. When you're ready (typically when a non-engineer asks "how many creators signed up last week?"), this doc walks through the steps end-to-end.

## 1. Deploy Metabase on Dokploy

Use the official `metabase/metabase` image. Dokploy already has it provisioned — click **Deploy** in the Metabase service.

Recommended env vars:

```
MB_DB_TYPE=postgres
MB_DB_DBNAME=metabase
MB_DB_PORT=6060
MB_DB_USER=mayowa
MB_DB_PASSWORD=...     # same as main Postgres
MB_DB_HOST=213.136.92.11
MB_SITE_URL=https://metabase.sepharstudios.com
```

Add a Traefik label so it gets HTTPS:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.metabase.rule=Host(`metabase.sepharstudios.com`)"
  - "traefik.http.routers.metabase.entrypoints=websecure"
  - "traefik.http.routers.metabase.tls.certresolver=letsencrypt"
  - "traefik.http.services.metabase.loadbalancer.server.port=3000"
```

DNS: add an `A` record for `metabase.sepharstudios.com` pointing at the same VPS IP.

## 2. Create a read-only Postgres role

**Critical:** Metabase should never have write access to production data. Connect to the production Postgres and run:

```sql
-- Create the role
CREATE ROLE metabase_ro LOGIN PASSWORD 'pick-something-strong-and-store-in-1password';

-- Allow it to connect to the app database
GRANT CONNECT ON DATABASE sepharstudios TO metabase_ro;

-- Allow it to use the public schema
GRANT USAGE ON SCHEMA public TO metabase_ro;

-- Grant SELECT on every existing table
GRANT SELECT ON ALL TABLES IN SCHEMA public TO metabase_ro;

-- Future-proof: any new tables we add (e.g., notifications) automatically grant
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO metabase_ro;

-- Same for any sequences (Metabase needs these to introspect tables)
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO metabase_ro;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON SEQUENCES TO metabase_ro;
```

Verify:

```sql
SET ROLE metabase_ro;
SELECT count(*) FROM "user";  -- should work
INSERT INTO "user" (id, name) VALUES ('x', 'y');  -- should FAIL with permission denied
RESET ROLE;
```

## 3. Connect Metabase to the data warehouse

1. Open `https://metabase.sepharstudios.com` and complete the initial admin-account setup.
2. Skip the sample data prompt.
3. Add database connection:
   - **Database type:** PostgreSQL
   - **Name:** Sephar Studios (prod)
   - **Host:** `213.136.92.11`
   - **Port:** `6060`
   - **Database name:** `sepharstudios`
   - **Username:** `metabase_ro`
   - **Password:** (from step 2)
   - **Schemas:** `public`
   - **SSL:** off (in-VPC traffic — turn on once Postgres moves to a managed provider)

## 4. Starter dashboards to build

1. **Subscriber growth** — line chart on `paystack_subscriptions` grouped by `created_at` (week), broken down by `plan`.
2. **Content publish velocity** — bar chart on `media_library WHERE is_active = true` grouped by `created_at` (week).
3. **Top creators by views and revenue** — joins `creators`, `media_library`, `transactions` (when settlement is wired).
4. **STC ledger movement** — sum of `transactions WHERE currency = 'STC' AND type = 'earn'` broken down by `status` and date.
5. **Daily active viewers** — distinct `user_id` from `media_watch_progress` per day.
6. **AI rate-limit pressure** *(later, when Redis ledgers exist)* — drawn from logs, not from the DB.

## 5. Sharing

- For internal stakeholders: add them as Metabase users with **View only** permission on the dashboards collection.
- For external (e.g. investors): use Metabase's "Public link" feature on individual dashboards (read-only, no auth). Be careful — public links don't honour row-level access; only use them on dashboards that don't reveal user-level data.

## 6. When you migrate Postgres to managed

When the main DB moves (Supabase / Neon / RDS — see `docs/scaling-runbook.md`), the steps are:

1. Replicate `metabase_ro` on the new instance.
2. Update Metabase's connection string in the Database settings UI (no Metabase redeploy needed).
3. Optionally point Metabase's own internal DB (`MB_DB_HOST`) at a small managed Postgres so Metabase itself is HA.

## 7. Decommissioning Directus + Grafana

Per `docs/NEXT_ROUND.md`, both of these were marked drop-recommendations:

- **Directus** duplicates the custom admin section. Stop the service in Dokploy; archive any config you want to keep.
- **Grafana** has no metric source today (no Prometheus). Either deploy a Prometheus exporter and commit to ops monitoring, or stop the service. Uptime Kuma already covers "is the site up?" alerting.

Both are click-ops in Dokploy — nothing to do in this repo.
