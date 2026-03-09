# Sephar Studios — Full Feature Build Plan

> **How to use this file**
> - Check off `[ ]` items as they are completed → `[x]`
> - Add comments below any item using `> your comment here`
> - Add new items freely — just follow the existing format
> - Last updated: March 2026

---

## Context

The platform is functional at the infrastructure level (auth, DB, web3, HLS, MinIO) but most user-facing features are UI shells with hardcoded data. This plan covers the complete feature build-out, restructuring subscription pricing, adding Paystack payment, and building all missing engagement, kids, and technical features.

**Stack**: Svelte 5 + SvelteKit · PostgreSQL + Drizzle ORM · Better Auth · MinIO · HLS.js (installed) · Ollama (local LLM) · Redis · SMTP email (configured) · Paystack (to add) · Wagmi/Viem (Web3)

---

## Smart Contract Critical Fixes (Do These First)

These must be fixed before or alongside contract redeployment. All changes are in `packages/contracts/contracts/`.

### Fix 1 — Founder Vesting Lock (CRITICAL — trust/rug-pull risk)

**Problem**: The entire 300M STC platform allocation has zero time-lock. Investors will flag this as a rug-pull risk.

**Fix**: Deploy OpenZeppelin `VestingWallet` — 6-month cliff, 48-month linear release (~6.25M STC/month after cliff).

- [ ] Create `packages/contracts/contracts/FounderVesting.sol` using OpenZeppelin VestingWallet
- [ ] Update `packages/contracts/scripts/deploy.ts` — deploy FounderVesting after StudioToken, transfer 300M to it instead of platform treasury
- [ ] Confirm beneficiary address is a multisig wallet (not a single EOA)

---

### Fix 2 — Referral Cap (CRITICAL — pool drain risk)

**Problem**: 10 STC per referral with no monthly limit. A bot could drain the entire rewards pool.

**Fix**: Cap at 5 referrals/user/month in `StudioToken.sol`.

- [ ] Add `monthlyReferralCount` and `lastReferralMonth` mappings to `StudioToken.sol`
- [ ] Add `maxMonthlyReferrals = 5` (owner-adjustable)
- [ ] Update `rewardReferral()` function to enforce the cap
- [ ] Write test for referral cap in `packages/contracts/test/`

---

### Fix 3 — STC Revenue Split Disclosure (IMPORTANT — creator relations)

**Problem**: When users pay with STC tokens, `mintSubscriptionWithSTC()` does NOT call `distributeRevenue()` — creators receive $0. This is intentional (loyalty redemption mechanic, like airline miles) but creators must know.

**Fix**: Document it — no contract change needed.

- [ ] Update `apps/web/src/routes/(creator)/creator/agreement/+page.svelte` — add explicit clause that STC redemptions do not trigger revenue splits
- [ ] Add UI callout on `apps/web/src/routes/(app)/plans/+page.svelte` explaining the two payment methods

---

### Fix 4 — Add `addToStake()` Function (MODERATE — retention risk)

**Problem**: Staking tier is frozen at the time of stake. Users cannot add to an existing stake to upgrade tiers without waiting for full lock expiry.

**Fix**: Add `addToStake(uint256 additionalAmount)` to `StudioToken.sol` that tops up the stake and recalculates the discount tier.

- [ ] Add `addToStake()` to `StudioToken.sol`
- [ ] Ensure it calls `_calculateTier(stake.amount, stake.lockPeriod)` and emits `StakeAdded` event
- [ ] Update `apps/web/src/routes/(app)/token/+page.svelte` — add "Top Up Stake" button (visible when user has active stake + unstaked STC balance)
- [ ] Write test for tier recalculation on top-up

---

### Fix 5 — Phase-Based STC Subscription Amount (MODERATE — treasury risk)

**Problem**: 200 STC at launch (STC ≈ $0.001) = $0.20 for a $10 subscription. Platform loses value.

**Fix**: Deploy with `stcSubscriptionAmount = 500e18`. Reduce as token price rises using the existing `updateSTCSubscriptionAmount()` function (no redeploy needed).

| Phase | STC Price | Set Amount To | User Pays | Platform Gets |
|---|---|---|---|---|
| Launch | Below $0.02 | **500 STC** | ~$5 at $0.01 | $5 — fair discount |
| Growth | $0.02–$0.05 | **300 STC** | ~$6–$15 | Near full price |
| Mature | Above $0.05 | **200 STC** | ~$10+ | Full parity |

- [ ] Change initial `stcSubscriptionAmount` from `200e18` to `500e18` in `StudioToken.sol` constructor
- [ ] Update plans page to show current STC amount dynamically (already reads from chain) + add phase tooltip

---

### Contract Pricing Update

- [ ] Update `SepharSubscription.sol` tier prices: Basic → 300 cents, Premium → 1000 cents, Creator → 1500 cents
- [ ] Redeploy all contracts to Amoy testnet
- [ ] Copy new addresses from `packages/contracts/deployments/amoy-80002.json` → `apps/web/src/lib/web3/config.ts`

---

## Sprint 1 — Subscription Restructure & Payment

### 1.1 New Pricing (Basic $3 · Premium $10 · Creator $15)

Creator tier = upload + watch on one account. Separate watch-only = Basic/Premium.

- [ ] Update `apps/web/src/routes/(app)/plans/+page.svelte` — new prices + staking discount tables
- [ ] Update `SUBSCRIPTION_TIERS.md` — new prices
- [ ] Update homepage Web3 section with new prices

---

### 1.2 Paystack Integration

- [ ] Install `@paystack/inline-js` (frontend popup)
- [ ] Add env vars: `PAYSTACK_SECRET_KEY`, `PAYSTACK_PUBLIC_KEY`, `PUBLIC_PAYSTACK_PUBLIC_KEY`
- [ ] Create `apps/web/src/lib/payment/paystack.ts` — `initializeTransaction()`, `verifyTransaction()`, `createCustomer()`, `chargeAuthorization()`
- [ ] Create `apps/web/src/routes/api/payment/initialize/+server.ts`
- [ ] Create `apps/web/src/routes/api/payment/verify/+server.ts`
- [ ] Create `apps/web/src/routes/api/payment/webhook/+server.ts` — handle `charge.success`, `subscription.disable`

---

### 1.3 Free 3-Month Trial System

All tiers get 3 months free. Card required. Notifications at 7 days, 3 days, 1 day before charge.

**Anti-abuse** (3 layers):
1. Paystack card fingerprint — store `authorization.signature`, block same card on new account
2. Phone OTP — one phone number = one trial ever
3. Device fingerprint — `@fingerprintjs/fingerprintjs` (free tier)

- [ ] Create DB schema file `apps/web/src/lib/db/schema/subscriptions.ts` with tables:
  - `subscriptions` (id, userId, plan, status, trial dates, card signature, phone hash, device fingerprint)
  - `familyAddons` (id, subscriptionId, userId, maxProfiles, pricePerMonth, status)
  - `ppvPurchases` (id, userId, contentId, amountPaid, paystackRef)
  - `trialBlacklist` (id, cardSignature, phoneHash, deviceFingerprint, reason)
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/routes/(app)/checkout/+page.svelte` — unified checkout (select plan → enter card → start trial)
- [ ] Create `apps/web/src/routes/api/subscriptions/start-trial/+server.ts` — anti-abuse checks + create Paystack customer
- [ ] Create `apps/web/src/routes/api/subscriptions/cancel/+server.ts`
- [ ] Create `apps/web/src/routes/api/subscriptions/status/+server.ts`
- [ ] Create `apps/web/src/lib/components/billing/TrialBanner.svelte` — trial countdown in dashboard header
- [ ] Install `nodemailer` and upgrade `apps/web/src/lib/authentication/server.ts` → `apps/web/src/lib/server/email.ts`
- [ ] Add trial expiry email (7 day, 3 day, 1 day, charge day notifications)

---

### 1.4 Pay-Per-View (PPV) System

Basic users see a paywall on PPV content. Creator suggests price, admin sets final price.

- [ ] Add `ppvContent` table to schema (contentId, suggestedPrice, finalPrice, isActive, adminApprovedAt)
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/routes/api/ppv/purchase/+server.ts` — Paystack PPV payment
- [ ] Create `apps/web/src/routes/api/ppv/check-access/+server.ts` — subscription + PPV purchase check
- [ ] Create `apps/web/src/lib/components/widgets/PPVPaywall.svelte` — paywall overlay for Basic users
- [ ] Update `apps/web/src/routes/(admin)/admin/content/+page.svelte` — set PPV flag + final price
- [ ] Update `apps/web/src/lib/components/creator/upload/BasicInfoStep.svelte` — add PPV price suggestion field

---

### 1.5 Family Add-on

+$5/month on any plan. Unlocks up to 8 profiles + full parental controls.

- [ ] Update `apps/web/src/routes/(app)/plans/+page.svelte` — add Family Add-on toggle under each plan
- [ ] Create `apps/web/src/routes/api/subscriptions/add-family/+server.ts` — Paystack recurring charge for add-on
- [ ] Update `apps/web/src/routes/(protected)/profile/+page.svelte` — show "Manage Family" section if add-on active

---

## Sprint 2 — Profiles & Parental Controls

### 2.1 Persistent Family Profiles (up to 8)

Currently: UI shell with 4 hardcoded profiles, no DB persistence.

- [ ] Add `profiles` table to schema (id, userId, name, type, avatarColor, avatarEmoji, pin, isKidsMode, isDefault)
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/routes/(protected)/profiles/+page.server.ts` — load/create/update/delete profiles
- [ ] Update `apps/web/src/routes/(protected)/profiles/+page.svelte` — connect to real DB, enforce 2-profile limit (8 with family add-on)
- [ ] Create `apps/web/src/routes/api/profiles/+server.ts` — CRUD API
- [ ] Update `apps/web/src/lib/components/profile/AddProfileModal.svelte` — persist to DB
- [ ] Update `apps/web/src/lib/components/profile/EditProfileModal.svelte` — persist to DB
- [ ] Store `activeProfileId` in session/cookie when user picks "Who's Watching?"

---

### 2.2 Full Parental Controls

- [ ] Add fields to `profiles` table: `contentRating` (G/PG/PG13/R/all), `safeModeEnabled`, `pinSetAt`
- [ ] Add `parentalReports` table (parentProfileId, childProfileId, reportDate, contentWatched jsonb)
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/lib/components/kids/ParentalPinModal.svelte` — PIN entry when switching to adult profile from kids
- [ ] Create `apps/web/src/lib/components/kids/SafeExplorationMode.svelte` — blocks adult routes in kids mode
- [ ] Create `apps/web/src/routes/(protected)/parental-controls/+page.svelte` — set PIN, content rating, view reports
- [ ] Create `apps/web/src/routes/api/profiles/[id]/pin/+server.ts` — set/verify PIN
- [ ] Create `apps/web/src/routes/api/parental/report/+server.ts` — generate viewing report

---

## Sprint 3 — Content Features

### 3.1 Continue Watching (Functional)

Currently: Hardcoded 2 items, no position tracking.

- [ ] Add `watchHistory` table (userId, profileId, contentId, contentType, positionSeconds, durationSeconds, completionPercent, isCompleted)
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/routes/api/watch/progress/+server.ts` — POST save position (call every 30s during playback)
- [ ] Create `apps/web/src/routes/api/watch/history/+server.ts` — GET continue watching list for profile
- [ ] Update `apps/web/src/lib/components/sections/dashboard/RecentlyWatched.svelte` — connect to real API with resume position
- [ ] Update video player to call progress endpoint on `timeupdate`

---

### 3.2 Custom Playlists / Watchlists

- [ ] Add `playlists` and `playlistItems` tables to schema
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/routes/(protected)/watchlist/+page.svelte` — "My List" page
- [ ] Create `apps/web/src/routes/api/playlists/+server.ts` — CRUD
- [ ] Create `apps/web/src/routes/api/playlists/[id]/items/+server.ts` — add/remove items
- [ ] Update `apps/web/src/lib/components/widgets/MediaCard.svelte` — "+ My List" button calls real API
- [ ] Update header nav `/my-list` link to point to new page

---

### 3.3 Reviews & Ratings

- [ ] Add `reviews` and `reviewHelpful` tables to schema (rating 1–5, reviewText, isApproved)
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/lib/components/widgets/ReviewSection.svelte` — star rating + text form + review list
- [ ] Create `apps/web/src/routes/api/reviews/+server.ts` — POST new review, GET reviews for content
- [ ] Create `apps/web/src/routes/api/reviews/[id]/helpful/+server.ts`
- [ ] Connect `apps/web/src/routes/(admin)/admin/review/+page.svelte` to real DB for moderation
- [ ] Integrate `ReviewSection` into movie detail page

---

### 3.4 Email Notifications for New Releases

- [ ] Install `nodemailer`
- [ ] Create `apps/web/src/lib/server/email.ts` — SMTP email via nodemailer using `.env` SMTP config
- [ ] Create `apps/web/src/lib/server/notifications.ts` — `sendNewReleaseNotification()`, `sendTrialExpiryReminder()`, `sendPaymentReceipt()`
- [ ] Add `notificationPreferences` table to schema
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/routes/api/notifications/preferences/+server.ts`
- [ ] Create/extend `apps/web/src/routes/(protected)/settings/+page.svelte` — notification toggles

---

## Sprint 4 — AI, Kids & Engagement

### 4.1 AI-Driven Recommendations

Uses Ollama (already in stack). Watch history + profile type → ranked content suggestions.

- [ ] Create `apps/web/src/lib/server/recommendations.ts` — build context from watch history, call Ollama, return ranked content IDs
- [ ] Create `apps/web/src/routes/api/recommendations/+server.ts`
- [ ] Update `apps/web/src/lib/components/sections/dashboard/Recommendations.svelte` — connect to real API
- [ ] Add "Because you watched..." section to dashboard homepage

---

### 4.2 Interactive Bible Quizzes (AI-Powered, Kids)

Uses Ollama to generate quiz questions from `bibleReference` field on `MediaItem`.

- [ ] Add `quizSessions` and `bibleStoryProgress` tables to schema
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/routes/api/kids/quiz/generate/+server.ts` — calls Ollama, returns 5 questions
- [ ] Create `apps/web/src/routes/api/kids/quiz/submit/+server.ts` — scores quiz, awards STC milestone
- [ ] Create `apps/web/src/lib/components/kids/BibleQuizCard.svelte` — animated kids quiz
- [ ] Create `apps/web/src/lib/components/kids/BibleStoryViewer.svelte` — paginated story viewer with TTS
- [ ] Create `apps/web/src/routes/kids/kiddies/bible-quiz/+page.svelte`
- [ ] Update `apps/web/src/routes/kids/kiddies/+page.svelte` — add Continue Watching row at top
- [ ] Update `apps/web/src/routes/kids/teens/+page.svelte` — same

---

### 4.3 Streaks & Achievements

Simple system: "you just watched this, conclude this, watch this next."

- [ ] Add `streaks`, `achievements`, and `userAchievements` tables to schema
- [ ] Run Drizzle migration
- [ ] Seed `achievements` table with initial achievement definitions:
  - `first_watch` (10 STC), `streak_7` (20 STC), `streak_30` (50 STC)
  - `series_complete` (15 STC), `night_owl` (5 STC), `early_bird` (5 STC)
  - `faith_explorer` (25 STC), `referral_1` (10 STC)
- [ ] Create `apps/web/src/lib/server/achievements.ts` — `checkAndAwardAchievements(userId, profileId, event)`
- [ ] Create `apps/web/src/routes/api/achievements/+server.ts`
- [ ] Create `apps/web/src/lib/components/widgets/AchievementToast.svelte` — animated popup on achievement unlock
- [ ] Create `apps/web/src/lib/components/widgets/StreakDisplay.svelte` — flame icon + streak count
- [ ] Create `apps/web/src/routes/(protected)/achievements/+page.svelte`

---

### 4.4 Personal Milestones (STC-Linked)

| Milestone | Trigger | Reward |
|---|---|---|
| First 100 STC earned | Balance hits 100 | Badge |
| First 500 STC earned | Balance hits 500 | Badge + 25 bonus STC |
| Staked for first time | On-chain stake event | Badge |
| First free month via STC | `mintSubscriptionWithSTC` called | Badge |
| 1-year member | Account anniversary | Badge + 50 STC |
| 1,000 hours watched | Watch history total | Special badge |

- [ ] Add `userMilestones` table to schema
- [ ] Run Drizzle migration
- [ ] Create `apps/web/src/lib/server/milestones.ts` — milestone evaluation logic
- [ ] Create `apps/web/src/routes/api/milestones/+server.ts`
- [ ] Create `apps/web/src/routes/(protected)/milestones/+page.svelte` — progress bars per milestone

---

## Sprint 5 — Technical Infrastructure

### 5.1 Adaptive Streaming (HLS)

HLS.js v1.6.13 is already installed. Encoder pipeline already exists at `/api/encoder/*`.

- [ ] Create/update `apps/web/src/lib/components/widgets/VideoPlayer.svelte`:
  - HLS.js integration with ABR (auto quality based on bandwidth)
  - Manual quality picker (360p / 720p / 1080p / 4K)
  - Playback speed controls
  - Subtitle/caption support
  - Progress reporting (calls `/api/watch/progress` every 30s)
- [ ] Ensure encoder pipeline outputs HLS segments + multi-quality master playlist

---

### 5.2 Offline Downloads (Functional)

Service Worker + Cache API approach. Premium and Creator tiers only.

- [ ] Create `apps/web/static/sw.js` — Service Worker that caches HLS segments on download
- [ ] Create `apps/web/src/lib/utils/download-manager.ts` — `downloadContent(contentId)` queues segments for SW caching, stores metadata in IndexedDB
- [ ] Update `apps/web/src/lib/components/sections/dashboard/Downloads.svelte` — connect to IndexedDB, real delete, show download progress + storage used
- [ ] Create `apps/web/src/routes/api/downloads/manifest/[id]/+server.ts` — signed HLS manifest URL (auth-gated, time-limited)
- [ ] Gate downloads behind Premium/Creator tier check

---

### 5.3 PWA + Install Prompt

- [ ] Create `apps/web/static/manifest.json` — PWA manifest (name, icons, theme_color `#0b0c10`, display: standalone)
- [ ] Update `apps/web/src/app.html` — link manifest, add `<meta name="theme-color">`, add `apple-touch-icon`
- [ ] Create `apps/web/src/lib/components/widgets/PWAInstallPrompt.svelte` — listens for `beforeinstallprompt`, shows "Install App" banner
- [ ] Add "Install App" link in header or footer that triggers prompt
- [ ] Test install on Android Chrome + iOS Safari (Add to Home Screen)

---

### 5.4 Mobile Optimization

- [ ] Audit all key pages for touch targets (minimum 44×44px), font sizes, scroll behavior
- [ ] Ensure video player controls are touch-friendly (large tap targets, swipe gestures)
- [ ] Consider bottom navigation bar for mobile views on main app pages

---

### 5.5 Device Support Page

- [ ] Create `apps/web/src/routes/(app)/device-support/+page.svelte`:
  - Supported browsers + versions table
  - Supported devices (Smart TV, Tablet, Mobile, Desktop)
  - Minimum requirements
  - Step-by-step PWA install guide
  - Troubleshooting FAQ (streaming issues, downloads, wallet connection)
- [ ] Add link in footer under Support section

---

## Staking Tier Reference

### Two Ways to Pay

| Method | Creator payout? | Buyback fires? |
|---|---|---|
| Cash (USDC or card via Paystack) | ✅ 30% to creators | ✅ 8% burns STC |
| STC Tokens (loyalty redemption) | ❌ $0 to creators | ❌ No burn |

### Staking Discount Tiers

| Tier | Discount | How to reach | Example on $10/mo |
|---|---|---|---|
| Tier 1 | 10% off | Lock 1,000+ STC for 90 days–1 year | Pay $9 |
| Tier 2 | 20% off | Lock 1,000+ STC for 2 years OR 3,500+ STC for 90d–1yr | Pay $8 |
| Tier 3 | 35% off | Lock 3,500+ STC for 2 years OR 10,000+ STC for 90d–1yr | Pay $6.50 |
| Tier 4 | 50% off | Lock 10,000+ STC for 2 years OR 35,000+ STC anytime | Pay $5 |

> Tier 1 is reachable in ~200 days of watching at the 5 STC/day cap — no purchase needed.
> `addToStake()` (Fix 4 above) lets users upgrade tiers without waiting for lock expiry.

---

## Database Migration Order

Run Drizzle migrations in this order:

1. `subscriptions`
2. `familyAddons`
3. `trialBlacklist`
4. `ppvContent` + `ppvPurchases`
5. `profiles` (extend existing if table already exists)
6. `watchHistory`
7. `playlists` + `playlistItems`
8. `reviews` + `reviewHelpful`
9. `notificationPreferences`
10. `streaks`
11. `achievements` + `userAchievements`
12. `userMilestones`
13. `quizSessions` + `bibleStoryProgress`
14. `parentalReports`

All files go in: `apps/web/src/lib/db/schema/`

---

## Key Files Reference

| Area | File |
|---|---|
| Subscription contract | `packages/contracts/contracts/SepharSubscription.sol` |
| Token contract | `packages/contracts/contracts/StudioToken.sol` |
| Founder vesting | `packages/contracts/contracts/FounderVesting.sol` (new) |
| Deploy script | `packages/contracts/scripts/deploy.ts` |
| Web3 config | `apps/web/src/lib/web3/config.ts` |
| Plans page | `apps/web/src/routes/(app)/plans/+page.svelte` |
| Token/swap page | `apps/web/src/routes/(app)/token/+page.svelte` |
| Auth config | `apps/web/src/lib/auth.ts` |
| DB schema dir | `apps/web/src/lib/db/schema/` |
| Email service | `apps/web/src/lib/authentication/server.ts` (to be upgraded) |
| Header nav | `apps/web/src/lib/components/sections/header.svelte` |
| Footer | `apps/web/src/lib/components/sections/footer.svelte` |
| Media card | `apps/web/src/lib/components/widgets/MediaCard.svelte` |
| Dashboard | `apps/web/src/routes/(protected)/dashboard/+page.svelte` |
| Kids age gate | `apps/web/src/lib/components/kids/ProfileAgeGate.svelte` |
| Profiles UI | `apps/web/src/routes/(protected)/profiles/+page.svelte` |
| Downloads UI | `apps/web/src/lib/components/sections/dashboard/Downloads.svelte` |
| Recommendations | `apps/web/src/lib/components/sections/dashboard/Recommendations.svelte` |
| Admin content | `apps/web/src/routes/(admin)/admin/content/+page.svelte` |
| Creator upload | `apps/web/src/lib/components/creator/upload/BasicInfoStep.svelte` |
| Creator agreement | `apps/web/src/routes/(creator)/creator/agreement/+page.svelte` |
| Hooks server | `apps/web/src/hooks.server.ts` |

---

## Verification Checklist

- [ ] **Sprint 1**: Checkout → Paystack sandbox → trial starts → email received → PPV paywall shows on Basic account → same card blocked on second signup
- [ ] **Sprint 2**: Create 8 profiles on family add-on → set PIN → kids safe mode blocks adult routes → parental report shows child activity
- [ ] **Sprint 3**: Play video → pause → reload → "Continue Watching" resumes at correct position → add to watchlist → leave review
- [ ] **Sprint 4**: Recommendations change after watch history builds → earn achievement → see streak counter → quiz generates from Bible reference
- [ ] **Sprint 5**: Throttle network in DevTools → HLS auto-drops to 360p → download content → go offline → playback works → install PWA from device support page

---

*Sephar Studios · Build Plan · March 2026*
