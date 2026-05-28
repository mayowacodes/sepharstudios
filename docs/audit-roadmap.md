# Audit Roadmap

> Catalog of audits remaining for Sephar Studios. Two are already done (web3 in Round 5, non-web3 code in Round 6). This doc lists what's left, ordered by what blocks what.

## Done

- [x] **Web3 audit** (Round 5) — 11 findings shipped (4 P0, 2 P1, 5 P2). Headline: stc-claim race condition wrapped in `SELECT … FOR UPDATE`. See git history for full diff.
- [x] **Non-web3 code audit** (Round 6) — 6 findings shipped (3 P0, 3 P1). Headlines: `locals.auth.validate()` was phantom (entire encoder upload flow broken), playlist DELETE missing ownership check, creator approval not atomic. `svelte-check` reports 0/0.

---

## Pre-launch blockers

These must land before money or real users touch the platform.

### 1. Smart contract security audit — **mainnet blocker**

**Scope:** All Solidity contracts in [`packages/contracts/contracts/`](../packages/contracts/contracts/):
- [`StudioToken.sol`](../packages/contracts/contracts/StudioToken.sol) — 2B supply ERC-20, staking, referrals, buybacks
- [`TokenAMM.sol`](../packages/contracts/contracts/TokenAMM.sol) — STC/USDC pool, swap math
- [`CreatorPayments.sol`](../packages/contracts/contracts/CreatorPayments.sol) — per-creator payout routing
- [`SepharSubscription.sol`](../packages/contracts/contracts/SepharSubscription.sol) — subscription NFT with discount logic
- [`FounderVesting.sol`](../packages/contracts/contracts/FounderVesting.sol) — 300M lock with cliff + linear vest
- [`MockUSDC.sol`](../packages/contracts/contracts/MockUSDC.sol) — testnet only, doesn't need audit

**Why external audit, not internal:**
- 2 billion token supply at stake. A single re-entrancy or rounding bug drains a pool.
- Audit firms find classes of bugs (storage collisions, signature replay, integer overflow patterns) that internal review consistently misses.
- Without an external audit, mainstream wallets (e.g., MetaMask warnings, CoinGecko listing) treat the token as unverified.

**Options:**
| Firm | Style | Cost ballpark | Lead time |
|---|---|---|---|
| **OpenZeppelin** | White-glove, formal, slow | $30–80k | 6–10 weeks |
| **Trail of Bits** | Deep technical, written like a paper | $30–60k | 4–8 weeks |
| **Spearbit** | Pod of researchers, fast | $20–40k | 2–4 weeks |
| **Code4rena** | Contest-based, many eyes | $15–40k prize pool | 1–2 weeks |
| **Sherlock** | Coverage-first contests | $10–30k | 2–3 weeks |

**Recommendation:** Code4rena or Sherlock for the first audit (cost-efficient, broad coverage). OpenZeppelin or Trail of Bits if you need a name on the PDF for institutional partners.

**Blocker for:** funding mainnet treasury, listing STC anywhere public, marketing the token.

### 2. Privacy / GDPR audit — **legal blocker for EU users**

**Scope:** how user data is collected, stored, processed, exported, deleted.

**Checklist:**
- [ ] Cookie consent banner (granular: analytics / marketing / functional) — required in EU + UK.
- [ ] **Right to Access** endpoint: user can export everything you hold on them. Today there's no such endpoint.
- [ ] **Right to Erasure** endpoint: user can delete their account + all derived data. Today the `user.id` cascade exists for some tables (auth-related) but not the new `notifications` (fixed in Round 6), and not for `transactions`/`watchHistory`/`achievements`.
- [ ] **Data Processing Agreement (DPA)** with every third party that handles user data: Paystack, Bunny CDN, Openpanel, n8n, MinIO/R2, Supabase/managed Postgres.
- [ ] Privacy policy reviewed by counsel — must describe what's collected, why, how long retained, who shares.
- [ ] Terms of Service reviewed by counsel — must include arbitration, liability limits, content policy, age requirements.
- [ ] Age gating: streaming services typically require 13+ (COPPA), 16+ (GDPR), or 18+ depending on content. You have a kids section, which makes COPPA compliance a hard requirement.

**Who does this:** a privacy lawyer with tech experience. Budget $3–10k for an initial review, $1–2k/year for updates. Anchor firms in this space: TermsFeed (template-driven, cheap), iubenda (automated compliance tooling, ~$30/mo), or a boutique tech law firm in your jurisdiction.

**Blocker for:** EU users (fines up to 4% of global revenue), California users (CCPA), launching the kids section publicly.

### 3. Payment / PCI security audit — **financial blocker**

**Scope:** Paystack integration, webhook handling, refund flows, subscription lifecycle.

**Files to audit:**
- [`apps/web/src/routes/api/payment/webhook/+server.ts`](../apps/web/src/routes/api/payment/webhook/+server.ts) — webhook signature verification (HMAC), idempotency
- [`apps/web/src/routes/api/payment/verify/+server.ts`](../apps/web/src/routes/api/payment/verify/+server.ts) — server-side verification of client-reported success
- [`apps/web/src/routes/api/payment/refund/`](../apps/web/src/routes/api/payment/) (if it exists) — admin refund path

**Checklist:**
- [ ] Webhook signature verified against Paystack's secret before any DB write.
- [ ] Webhook handler idempotent on retry — same event ID → same result, no duplicate transactions.
- [ ] Failed-payment retry policy: how many retries, what backoff, what's the customer experience?
- [ ] Subscription cancellation: one-click in EU (legal requirement), no dark patterns.
- [ ] Card data never touches your server (Paystack handles this — verify no card fields land in your logs).
- [ ] Refund flow: who can trigger, where audited, can it be undone?

**Who does this:** a payments engineer who's shipped similar Paystack/Stripe integrations before. Budget a few hours of contractor time ($500–2000), or an external code review from a firm like NCC Group / Cure53 for full PCI-DSS work (~$10–30k).

**Blocker for:** scaling beyond initial users without subscription fraud or chargeback exposure.

---

## Pre-scale audits (next 1–3 months)

### 4. Accessibility (WCAG 2.1 AA) — **legally required in many jurisdictions for streaming**

Netflix and Hulu have been repeatedly sued under the ADA for inaccessible video players. If you're competing with them, assume the same applies.

**Scope:**
- Keyboard navigation throughout the app (no mouse-only flows).
- Screen reader labels on all interactive elements (`aria-label`, `aria-describedby`).
- Color contrast ratios: 4.5:1 for normal text, 3:1 for large text.
- Captions / subtitles on every video. Audio descriptions for accessibility-required content.
- Focus indicators visible (don't disable `:focus-visible`).
- Skip-to-content links, semantic HTML, proper heading hierarchy.
- Test with NVDA (Windows) + VoiceOver (macOS/iOS) + TalkBack (Android).

**Tools:**
- Automated: `axe DevTools` browser extension (catches ~30% of issues).
- Manual: keyboard-only navigation walk-through; screen reader walk-through.
- Paid: Deque (the company behind axe) does formal audits, ~$10–25k for a streaming app.

### 5. Performance audit

**See [`docs/performance-audit.md`](./performance-audit.md) — done in Round 7.**

### 6. Mobile UX audit

**Scope:** real-device testing across iOS Safari, Android Chrome, mid-range Android (RAM-constrained), tablets, low-bandwidth networks.

**Checklist:**
- Touch targets ≥44×44px (Apple HIG) / ≥48×48dp (Material).
- Video player gestures: tap to play/pause, double-tap to seek, pinch to zoom.
- Offline behavior: graceful failure, queued actions when reconnection happens.
- Network throttling test: 3G slow connection, intermittent packet loss.
- Battery: video playback shouldn't pin CPU at 100%.

**Who does this:** start with BrowserStack or LambdaTest for cross-device testing (~$30/mo), then real-device QA by a contractor. Budget $1–3k for a thorough pass.

---

## Pre-IPO / late-stage audits

### 7. Infrastructure audit
Backups, monitoring, alerting, DDoS protection, edge rate limiting, secrets management, disaster recovery plan. Most of what's needed is catalogued in [`docs/scaling-runbook.md`](./scaling-runbook.md) — the audit verifies "is it actually in place and tested?"

### 8. Content moderation audit
[`ai-moderation.ts`](../apps/web/src/lib/server/ai-moderation.ts) handles review moderation. Outstanding:
- Video content moderation (frame sampling + visual AI).
- User reporting flow + appeals.
- CSAM detection (PhotoDNA or similar — required by law in most jurisdictions if user-uploaded content exists).
- Copyright/DMCA takedown flow.

### 9. SEO audit
Sitemap, robots.txt, OG tags, structured data (schema.org), page-speed scores, canonical URLs, hreflang for multilingual. Matters most for creator pages and public catalog pages.

### 10. Email deliverability audit
SPF, DKIM, DMARC for the domain n8n sends from. Without these, password resets land in spam, churn jumps, support burden climbs. Mailtrap or Postmark have free deliverability check tools.

---

## Suggested order

If launching limited beta on testnet:
1. **Performance audit** (#5) — done
2. **Accessibility audit** (#4) — start in parallel with growth
3. **Mobile UX** (#6) — start in parallel with growth

If launching paid + mainnet:
1. **Smart contract audit** (#1) — start now, takes weeks
2. **Privacy audit** (#2) — start now, can run in parallel with #1
3. **Payment audit** (#3) — quick win, ~1 week of focused work
4. Then 4-6 as above

---

## Tracking

When an audit is in flight, add a row here:

| Audit | Vendor | Started | Expected close | Status |
|---|---|---|---|---|
| Web3 code | Internal (Round 5) | — | — | ✅ Done |
| Non-web3 code | Internal (Round 6) | — | — | ✅ Done |
| Performance | Internal (Round 7) | 2026-05-28 | — | 🟡 In progress |
| Smart contracts | TBD | — | — | ⏸ Not started |
| Privacy / GDPR | TBD | — | — | ⏸ Not started |
| Payment / PCI | TBD | — | — | ⏸ Not started |
| Accessibility | TBD | — | — | ⏸ Not started |
| Mobile UX | TBD | — | — | ⏸ Not started |
