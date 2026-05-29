# Cron endpoint setup

Sephar Studios runs four scheduled jobs as HTTP POST endpoints under `/api/cron/*`. They're stateless, idempotent, and gated by a shared `CRON_SECRET` bearer token. You wire them up in whatever scheduler your host gives you (Dokploy Cron, EasyCron, GitHub Actions, a managed `pg_cron`, etc.).

Never invoke from a browser — anyone with the secret can move money.

## Endpoints

| Endpoint | Recommended schedule | What it does |
| --- | --- | --- |
| `POST /api/cron/renew-subscriptions` | every hour (`5 * * * *`) | Re-charges saved Paystack authorizations whose `next_charge_at` has elapsed. Dunning on failure (3 strikes → paused). |
| `POST /api/cron/creator-payouts` | monthly, 1st at 00:05 UTC (`5 0 1 * *`) | Aggregates the last 30 days of completed watches and writes per-creator payout rows (fiat/USDC pending + STC via treasury when configured). |
| `POST /api/cron/staking-indexer` | every 5 min (`*/5 * * * *`) | Polls `STCStaking.totalStaked()` / `totalStakers()` from the chain and snapshots them so the admin tokenomics page reads real numbers, not zeros. |
| `POST /api/cron/event-status-sweep` | every 5 min (`*/5 * * * *`) | Promotes scheduled events to `live` when `starts_at <= now()` and to `completed` once `endsAt <= now()`. Sends 1-hour-before reminders to registrants. |
| `POST /api/cron/settlement-reconcile` | every 10 min (`*/10 * * * *`) | Reconciles `transactions` rows that hold a `tx_hash` but never had their status flipped — checks the on-chain receipt and marks `completed` / `failed`. Pending rows without a `tx_hash` are left alone (those are owed-but-not-yet-sent). |
| `POST /api/cron/meilisearch-reindex` | every 30 min (`*/30 * * * *`) | Re-pushes all published `media_library`, `episodes`, and verified `creators` rows to Meilisearch in batches of 500. Skips cleanly when Meilisearch isn't configured. |
| `POST /api/cron/newsletter-weekly-digest` | weekly, Mon 09:00 UTC (`0 9 * * 1`) | Sends a digest of the last 7 days' new content to active newsletter subscribers. Signed-in users must have `weeklyDigest=true` in their notification preferences; anonymous subscribers always receive it. |

Add or remove jobs in `apps/web/src/routes/api/cron/*` — every directory there is a job.

## Env

```env
CRON_SECRET=<long random string, generate with `openssl rand -hex 32`>
CRON_BOUNTY_PER_COMPLETION_CENTS=25  # creator-payouts only; defaults to 25 ($0.25)
```

Set these in Dokploy → Environment → Production (or whichever scope deploys the worker). The web app reads them via `$env/dynamic/private`.

## Auth

Every cron endpoint expects an `Authorization: Bearer <CRON_SECRET>` header. Missing or wrong → 401. Missing server-side `CRON_SECRET` → 500. There is no IP allow-list — the bearer is the entire access control.

## Dokploy setup (UI)

Dokploy ships with a Crons feature per project. For each job:

1. Open the project → **Crons** → **Add Cron**.
2. **Name**: `renew-subscriptions` (etc).
3. **Schedule** (cron syntax, UTC): copy from the table above.
4. **Command**:

   ```bash
   curl -fsS -X POST https://sepharstudios.com/api/cron/renew-subscriptions \
        -H "Authorization: Bearer $CRON_SECRET" \
        --max-time 540
   ```

   Use `--max-time 540` (9 minutes) so a stuck request can't pile up — every cron is batch-bounded and finishes well under that.
5. **Environment**: enable "Inherit project env" so `$CRON_SECRET` resolves.
6. Save → enable → run once manually to confirm 200 OK before walking away.

Repeat for `creator-payouts`, `staking-indexer`, `event-status-sweep`.

## GitHub Actions alternative

If you prefer a single workflow file over four Dokploy cron rows, here's the equivalent (commit at `.github/workflows/cron.yml`). `CRON_SECRET` lives in repo → Settings → Secrets → Actions.

```yaml
name: Production cron jobs
on:
  schedule:
    - cron: '5 * * * *'      # renew-subscriptions
    - cron: '5 0 1 * *'      # creator-payouts
    - cron: '*/5 * * * *'    # staking-indexer + event-status-sweep
jobs:
  dispatch:
    runs-on: ubuntu-latest
    steps:
      - name: Renew subscriptions
        if: github.event.schedule == '5 * * * *'
        run: |
          curl -fsS -X POST https://sepharstudios.com/api/cron/renew-subscriptions \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
      - name: Creator payouts
        if: github.event.schedule == '5 0 1 * *'
        run: |
          curl -fsS -X POST https://sepharstudios.com/api/cron/creator-payouts \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
      - name: 5-min sweep
        if: github.event.schedule == '*/5 * * * *'
        run: |
          curl -fsS -X POST https://sepharstudios.com/api/cron/staking-indexer \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" &
          curl -fsS -X POST https://sepharstudios.com/api/cron/event-status-sweep \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" &
          wait
```

GitHub's free tier guarantees only "within 10 minutes" delivery — fine for everything here except `renew-subscriptions` if you want tight billing windows. Dokploy is better for that one.

## Manual test

```bash
# From your laptop, against staging or prod
export CRON_SECRET='<paste from your env>'
curl -sS -X POST https://sepharstudios.com/api/cron/renew-subscriptions \
     -H "Authorization: Bearer $CRON_SECRET" | jq .

# Expected for a quiet hour (nothing due):
# { "ok": true, "runAt": "2026-…", "processed": 0, "charged": 0, "failed": 0, "paused": 0, "errors": [] }
```

If you get `"CRON_SECRET not configured on server"`, the env var isn't loaded into the SvelteKit Node process — fix the env scope in Dokploy and redeploy.

## Observability

Every endpoint returns a JSON summary (`processed`, `charged`, `failed`, `paused`, or job-specific counters). Pipe Dokploy's cron logs to Loki / Better Stack / wherever, then alert on:

- HTTP non-2xx (job didn't run or auth wrong).
- `failed > 0` for any sustained window on `renew-subscriptions` (Paystack outage or our auth-code drift).
- `errors[]` non-empty on `creator-payouts` (treasury misconfig).

The renewal job is safe to re-run — if a subscription was already charged this hour, `next_charge_at` has moved forward and the same row won't requalify. The payout job is also re-run-safe — it idempotently scopes by month-window and skips creators with a payout already recorded.
