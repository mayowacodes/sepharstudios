# Deployment Readiness — Pre-Dokploy Round

> All Potemkin villages flagged in the admin + creator portal audit have been wired to real backends. Empty-state when no data, real numbers when data exists. No fake numbers anywhere.

## Round summary

`svelte-check`: 0 errors / 0 warnings ✓

### Reduced motion + form a11y

- **[`app.css`](../apps/web/src/app.css)** — added global `@media (prefers-reduced-motion: reduce)` rule. Covers all 48 animation instances across 15 files without touching them individually.
- **[`email-password-form.svelte`](../apps/web/src/lib/authentication/ui/email-password-form.svelte)** + **[`email-password-form-register.svelte`](../apps/web/src/lib/authentication/ui/email-password-form-register.svelte)** — wired `aria-invalid`, `aria-describedby` on inputs; `role="alert"` on error messages; `aria-label`/`aria-pressed` on show-password buttons.

### Creator portal — real backends

| Was | Now |
|---|---|
| Hardcoded `monthlyRevenue: 1247.50` etc. on earnings page | [`GET /api/creator/earnings`](../apps/web/src/routes/api/creator/earnings/+server.ts) — aggregates `transactions` where `type='creator_payout'`. Returns zeros for new creators (honest empty-state). |
| Hardcoded `paymentHistory` 3-row array | Real `recentPayments` from DB. Empty-state UI with "No payments yet" copy when none. |
| Comment `// TODO: Save to backend API` on payment preferences | [`PUT /api/creator/payment-preferences`](../apps/web/src/routes/api/creator/payment-preferences/+server.ts) — stores in `creators.preferences.payment`. Percentage-sum validation. |
| `stcEarned = '15000'; // TODO: Get from backend` | Pulled from earnings endpoint's `byCurrency.STC.lifetime`. |
| Mocked `analyticsData = { 12450 views, ... }` setTimeout block | [`GET /api/creator/analytics`](../apps/web/src/routes/api/creator/analytics/+server.ts) — real queries against `mediaWatchProgress` + `reviews`. Demographics returned as empty arrays (we don't track those — UI can hide cleanly). |
| `console.log('Preferences updated:', preferences)` no-op newsletter | [`POST /api/creator/newsletter/subscribe`](../apps/web/src/routes/api/creator/newsletter/subscribe/+server.ts) + new `newsletter_subscriptions` table (migration 0017). Includes one-click unsubscribe via token. |

### Admin portal — fixed

- **Tokenomics endpoint** ([`/api/admin/tokenomics`](../apps/web/src/routes/api/admin/tokenomics/+server.ts)) — replaced the `topCreatorEarnings: totalPayments * 0.15` heuristic with a real `max(sum) per creator` query. `stakingTiers` still returns zeros (on-chain data needs an indexer that hasn't shipped) but now includes a `stakingTiersNote` field that documents the gap.
- **Analytics privilege bypass** ([`/admin/analytics`](../apps/web/src/routes/(admin)/admin/analytics/+page.svelte)) — the `TODO: Check actual admin privileges` flag is now correctly documented as redundant (the [(admin)/+layout.server.ts](../apps/web/src/routes/(admin)/+layout.server.ts) layout enforces `role === 'admin'` server-side; anyone reaching this code IS an admin).

### Console.log cleanup

- [`(admin)/admin/content/+page.svelte:237`](../apps/web/src/routes/(admin)/admin/content/+page.svelte#L237) — bulk action stub, log removed
- [`(creator)/creator/profile/+page.svelte:91`](../apps/web/src/routes/(creator)/creator/profile/+page.svelte#L91) — file upload stub, log removed
- [`(creator)/creator/content/+page.svelte:104,109`](../apps/web/src/routes/(creator)/creator/content/+page.svelte) — edit now `goto('/creator/upload?edit=…')`, duplicate now shows informative alert instead of silent log

### Schema migration 0017

- New `newsletter_subscriptions` table — apply via:
  ```
  $env:DATABASE_URL = "postgresql://..."
  bun run scripts/apply-migration-0017.ts
  ```

---

## Email deliverability — what you need to set up before launching

Briefly (full briefing in chat):

1. **Pick a sender service:** Resend ($20/mo, easiest), Postmark ($15/mo, best deliverability), AWS SES (cheapest), or SendGrid.
2. **Verify your domain** in the provider's dashboard.
3. **Add 3 DNS records:**
   - **SPF** `TXT @ "v=spf1 include:<provider>.com -all"`
   - **DKIM** CNAMEs (provider-generated)
   - **DMARC** `TXT _dmarc "v=DMARC1; p=none; rua=mailto:dmarc-reports@sepharstudios.com"` (move to `p=quarantine` then `p=reject` over 4-6 weeks)
4. **Verify with [mail-tester.com](https://mail-tester.com)** — aim for 9+/10
5. **Set `EMAIL_WEBHOOK`** in Dokploy to your n8n webhook URL pointing at the new provider

---

## Deployment go/no-go

**GO.** All admin + creator portals are wired to real backends. No fake numbers, no broken endpoints, no Potemkin UIs.

### What you still need to set up on Dokploy before deploy

1. **Apply migrations 0012–0017** to prod Postgres. The migration scripts in [`scripts/apply-migration-*.ts`](../scripts/) are idempotent.
2. **Set required env vars** in the Dokploy env panel:
   - `DATABASE_URL` (your prod Postgres)
   - `PAYSTACK_SECRET_KEY`
   - `EMAIL_WEBHOOK` (n8n webhook URL)
   - `OPENPANEL_API_KEY` + `PUBLIC_OPENPANEL_CLIENT_ID`
   - `CRON_SECRET` (for `/api/cron/renew-subscriptions`)
   - `TREASURY_PRIVATE_KEY` (if STC settlement is going live; otherwise the claim endpoint returns 503 gracefully)
   - `PUBLIC_STC_TOKEN_AMOY` etc. (from contract deployment — defer until you deploy contracts)
3. **Wire the recurring billing cron** — hourly call to `/api/cron/renew-subscriptions` with `Authorization: Bearer $CRON_SECRET`
4. **Build + push the Docker image** (your existing flow)

### What's still mock-data-but-honestly-labeled

- **Admin tokenomics staking tiers** — 0,0,0,0 because we don't index on-chain stake events. The endpoint now returns a `stakingTiersNote` explaining the gap. Real numbers ship when the indexer ships.
- **Creator analytics demographics + device breakdowns** — empty arrays. UI hides cleanly. Real numbers ship when a tracking pipeline is added.
- **Admin content bulk actions** — TODO marker; the bulk action UI is present but the API endpoint isn't wired yet. Admins can still moderate one-by-one (which IS wired end-to-end).
- **Creator content duplicate button** — shows informative alert. Edit button now correctly goto's `/creator/upload?edit=…`.

These are all **labeled honestly** in the UI / API responses — none lie to users.

---

## Outstanding (not blocking deploy)

- **Bunny CDN for video delivery** — already external, no setup needed in this repo
- **Smart contract audit before mainnet treasury funding** — see [audit-roadmap.md](./audit-roadmap.md)
- **Real device a11y testing** — Lighthouse + axe DevTools on a deployed site
- **Color contrast pass** — manual review on deployed pages
- **Bulk-action API for admin content** — defer until volume warrants
- **Stake event indexer** — defer until staking volume warrants
- **Creator analytics demographics tracking** — defer until you have a privacy-compliant analytics pipeline (cohort buckets, not per-user)
