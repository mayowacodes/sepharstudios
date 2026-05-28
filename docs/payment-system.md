# Payment System

> Built in Round 8 after a payment/PCI audit surfaced that the prior code had no recurring billing, used client-controlled metadata as the source of truth, and lacked idempotency. This doc describes the architecture you have now and the ops setup required to run it.

## Plan model

| Tier | Price | Cadence | Profiles | Kids profile | Ads | Trial |
|---|---|---|---|---|---|---|
| `freemium` | $1.00 | every 2 months | 1 | No | Yes | None — billed from day 1 |
| `basic` | $4.00 | monthly | 2 | No | No | 3 months free, then auto-renew |
| `premium` | $10.00 | monthly | 8 | **Yes** | No | 3 months free, then auto-renew |
| `creator` | $10.00 | monthly | 2 | No | No | 3 months free, then auto-renew |

Source of truth: [`PLAN_PRICES_CENTS`](../apps/web/src/lib/payment/paystack.ts#L111) + [`PLAN_FEATURES`](../apps/web/src/lib/payment/paystack.ts#L127). The `/plans` UI mirrors these manually — keep them in lockstep when prices change.

`familyAddons` is **deprecated** — `premium` now includes 8 profiles natively. The table remains for backwards compatibility with existing add-on subscribers.

## How a subscription flows

```
1. User picks plan on /plans → /checkout
   ↓
2. POST /api/payment/initialize
   ├─ creates payment_intent row (server-side source of truth)
   └─ calls Paystack /transaction/initialize ($0.50 card verification)
   ↓
3. User completes Paystack checkout → callback to /api/payment/verify
   ↓
4. GET /api/payment/verify?reference=…
   ├─ looks up the payment_intent (rejects unknown / cross-user references)
   ├─ short-circuits if already 'consumed' (idempotent on refresh)
   ├─ calls Paystack /transaction/verify
   ├─ checks trial_blacklist for the card signature (unique constraint = atomic)
   ├─ transaction: insert paystack_subscriptions + trial_blacklist + consume intent
   └─ snapshot PLAN_FEATURES (maxProfiles, kidsAllowed) onto the subscription row
   ↓
5. paystack_subscriptions row exists with:
   – status='trial' (or 'active' for freemium/non-trial)
   – next_charge_at = trialEndDate (or now + renewalIntervalMonths)
   – paystack_authorization_code (for future recurring charges)
```

## Recurring billing (the part that didn't exist before)

`POST /api/cron/renew-subscriptions` is the renewal worker. **Not invoked by the web app** — must be triggered by an external cron with the `CRON_SECRET` header.

```
For each subscription where next_charge_at <= now() AND status IN ('active','trial'):
  1. Insert payment_intent (kind='renewal') for the renewal reference
  2. Call Paystack /transaction/charge_authorization with the saved card
  3. On success → extend current_period_end + next_charge_at by renewalIntervalMonths,
                  reset failed_attempts, notify user
  4. On failure → bump failed_attempts, schedule retry:
       attempt 1 fails → retry in 1 hour
       attempt 2 fails → retry in 24 hours
       attempt 3 fails → status='paused', no further retry, notify user to update card
```

### Setting up the cron

Pick one of these approaches:

#### Option A — Dokploy scheduled task (simplest)
1. In Dokploy, create a scheduled job for the SvelteKit container.
2. Schedule: `0 * * * *` (hourly).
3. Command:
   ```sh
   curl -X POST https://app.sepharstudios.com/api/cron/renew-subscriptions \
        -H "Authorization: Bearer $CRON_SECRET" \
        --silent --fail-with-body
   ```

#### Option B — External cron (EasyCron, cron-job.org)
Same HTTPS call, hourly, with the `Authorization: Bearer <secret>` header configured in the cron service's settings.

#### Option C — Bun script invoked from a system cron on the same host
For self-hosted boxes only. Skip if Dokploy already provides scheduling.

### Required env vars

```
CRON_SECRET=<64+ random chars, generated once, kept secret>
PAYSTACK_SECRET_KEY=<from Paystack dashboard>
PUBLIC_SITE_URL=https://app.sepharstudios.com
```

`CRON_SECRET` is checked via constant-time string comparison (TODO: switch to `crypto.timingSafeEqual` if you anticipate a high-volume timing-attack surface).

## Idempotency & race-condition guards

| Risk | Mitigation |
|---|---|
| Paystack retries webhook on timeout | `paystack_events` PK on `event_id` — duplicate insert = 23505 → 200 ack |
| User refreshes verify callback | `payment_intents.status='consumed'` short-circuits second call |
| Two trials from same card in parallel | `UNIQUE(card_signature)` on `trial_blacklist`; check + insert atomic via PK violation |
| Two subscription rows for same Paystack subscription | `UNIQUE(paystack_subscription_code)` |
| Client tampers with `metadata.plan` in checkout | Server validates against `payment_intents` row, not Paystack response |
| Partial state if step 4 transaction crashes halfway | `db.transaction()` wraps insert sub + insert blacklist + consume intent |

## Cancellation behavior

- `POST /api/subscriptions/cancel` — sets `status='cancelled'`, `cancelledAt=now`. Access continues until `trialEndDate`/`currentPeriodEnd`.
- UI: **one-click button**, no confirmation modal. Recoverable by resubscribing before period end. Per EU Art. 7 Directive 2011/83/EU.
- Cancellation does NOT call Paystack. There's nothing on Paystack's side to cancel — we don't use their Subscriptions API. The cron worker checks `status` before charging, so a `cancelled` row is never renewed.

## Refunds

- `POST /api/admin/refunds` — admin-only, audit row in `refunds` written before Paystack call.
- If refund covers a subscription, also marks `paystack_subscriptions.status='cancelled'` so the cron doesn't re-bill.
- User notified via `notify()`.
- `GET /api/admin/refunds` lists recent refunds.

No user-self-serve refund endpoint exists. The [Terms](../apps/web/src/routes/(app)/terms/+page.svelte) document PPV refunds within 48 hours of unwatched purchase but there's no automated path — manual review via admin.

## Webhook handlers

| Event | Action |
|---|---|
| `charge.success` | Updates `paystack_subscriptions.status='active'`. Mostly defensive — most successful charges go through verify or cron paths. |
| `subscription.disable` | Dead code in practice (we don't create Paystack Subscriptions). Left in place for forward compatibility. |
| `invoice.payment_failed` | Dead code in practice. The cron worker handles renewal failures. |

All events pass through `paystack_events` dedup before reaching the handler.

## Migration

[`drizzle/0016_payment_system.sql`](../drizzle/0016_payment_system.sql) — adds:
- `paystack_events` table (webhook dedup)
- `payment_intents` table (server-side pending record)
- `refunds` table (admin audit log)
- `paystack_subscriptions.max_profiles`, `kids_allowed`, `next_charge_at`, `failed_attempts`, `last_charge_attempt_at`
- `UNIQUE(paystack_subscription_code)`, `UNIQUE(card_signature)` constraints

Apply via:

```powershell
$env:DATABASE_URL = "postgresql://..."
bun run scripts/apply-migration-0016.ts
```

Idempotent (`IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, `pg_constraint` guards) — safe to re-run.

## Outstanding work — what's left after the round-2 follow-up

The following items from the original round were addressed in a follow-up commit:

- ✅ **Profile cap enforcement** — [`api/profiles/+server.ts`](../apps/web/src/routes/api/profiles/+server.ts) POST now reads the user's `paystackSubscriptions.maxProfiles` snapshot (with legacy `familyAddons` fallback) and rejects creates that exceed it.
- ✅ **Kids-mode access gate** — same endpoint rejects `isKidsMode: true` profiles unless the subscription has `kidsAllowed = true` (Premium only).
- ✅ **Settings page** — surfaces `next_charge_at`, the card on file, and an amber warning banner when `failed_attempts > 0`.
- ✅ **PPV saved-card path** — [`api/ppv/purchase/+server.ts`](../apps/web/src/routes/api/ppv/purchase/+server.ts) now calls `chargeAuthorization` directly when the user has a valid saved card (active/trial subscription), bypassing the Paystack checkout redirect. Falls back to checkout for paused/cancelled subs or no card.
- ✅ **Plan-change auth check** — [`api/subscriptions/change-plan/+server.ts`](../apps/web/src/routes/api/subscriptions/change-plan/+server.ts) rejects plan changes with 402 when no `paystackAuthorizationCode` exists; also snapshots the new plan's `maxProfiles`/`kidsAllowed` onto the row so entitlement checks reflect the change immediately.
- ✅ **Ads gate helper** — [`$lib/subscription/ads.ts`](../apps/web/src/lib/subscription/ads.ts) `shouldShowAds(ctx)` provides a single source of truth for the ad-eligibility decision. The ad SDK itself remains deferred — when you wire one, mount it behind this helper.

Round-3 follow-up landed:

- ✅ **PPV refund self-serve** — [`api/ppv/refund/+server.ts`](../apps/web/src/routes/api/ppv/refund/+server.ts). Enforces the Terms § 11 policy (48-hour window, no playback started). Returns specific error codes (`window_expired`, `playback_started`, `not_found`, `reference_missing`) so the client can show the right message. Writes the audit row BEFORE the Paystack call; revokes access + marks the audit row in a single transaction on success.
- ✅ **Webhook handler cleanup** — dead `subscription.disable` and `invoice.payment_failed` handlers removed from [api/payment/webhook/+server.ts](../apps/web/src/routes/api/payment/webhook/+server.ts). The remaining `charge.success` handler is now correctly described as a defensive safety net (most charges activate via the verify or cron paths).

Still pending:

1. **Wire an ad SDK** behind `shouldShowAds()`. Recommended: start with one well-tested provider (Google AdSense for display, or Spotim for video pre-rolls if you can't get AdSense approval for streaming content) rather than a header-bidding wrapper.
2. **PPV refund UI** — the endpoint exists but there's no `/settings`-side button or watch-page "Request refund" entry-point yet. Add a small modal in the user-facing UI with confirmation copy that quotes the Terms § 11 policy.

## Verification

After deploying:

1. **Apply migration 0016** — `bun run scripts/apply-migration-0016.ts` → all ✓ in the verification table.
2. **Smoke-test signup**:
   ```
   - Open /plans, pick Basic
   - Complete Paystack checkout (test mode)
   - Confirm verify endpoint returns success
   - Refresh the verify URL → expect 200 with `alreadyConsumed: true`
   - Check DB:
       SELECT plan, status, max_profiles, kids_allowed, next_charge_at, paystack_authorization_code
       FROM paystack_subscriptions WHERE user_id = '<test_user>';
   ```
3. **Smoke-test webhook dedup**:
   ```
   - Trigger the same Paystack webhook twice (Postman or `paystack webhooks test`)
   - First call: 200 with `received: true`
   - Second call: 200 with `received: true, duplicate: true`
   - paystack_events table has 1 row, not 2
   ```
4. **Smoke-test renewal cron** (in staging):
   ```
   - Manually set a sub's next_charge_at to a past timestamp
   - curl POST /api/cron/renew-subscriptions with the bearer token
   - Confirm next_charge_at advanced by renewalIntervalMonths
   - Confirm the user got a notification
   ```
5. **Smoke-test admin refund**:
   ```
   - As admin, POST /api/admin/refunds with a real test reference
   - Confirm refunds row exists with status='success'
   - Confirm the user's subscription status is now 'cancelled'
   ```
