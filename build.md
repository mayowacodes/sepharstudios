Sephar Studios — Full Feature Build Plan
Context
The platform is functional at the infrastructure level (auth, DB, web3, HLS, MinIO) but most user-facing features are UI shells with hardcoded data. This plan covers the complete feature build-out as specified by the owner, restructuring subscription pricing, adding Paystack payment, and building all missing engagement, kids, and technical features.

Stack confirmed: Svelte 5 + SvelteKit, PostgreSQL + Drizzle ORM, Better Auth, MinIO, HLS.js (installed), Ollama (local LLM, in .env), Redis, SMTP email (configured), Paystack (to add), Wagmi/Viem (Web3).

Phase 1 — Subscription Restructure & Payment
1.1 Pricing Changes
New tiers: Basic $3/mo · Premium $10/mo · Creator $15/mo
Files to update:

apps/web/src/routes/(app)/plans/+page.svelte — update display prices, staking discount tables
packages/contracts/contracts/SepharSubscription.sol — update tierPrices mapping (Basic=300 cents, Premium=1000 cents, Creator=1500 cents)
packages/contracts/contracts/StudioToken.sol — update STC subscription redemption cost to reflect new $3 Basic (e.g. 60 STC at $0.05/STC)
apps/web/src/lib/web3/config.ts — update price constants after redeployment
SUBSCRIPTION_TIERS.md + homepage Web3 section — update displayed prices
Creator tier clarification: Creator ($15/mo) = upload + watch on one account. Separate watch-only accounts are Basic/Premium. Creator staking benefits remain as planned (30–55% revenue share based on STC locked).

1.2 Paystack Integration
Install: @paystack/inline-js (frontend) + Paystack REST API calls server-side via fetch.

New files:

apps/web/src/lib/payment/paystack.ts — server-side: initializeTransaction(), verifyTransaction(), createCustomer(), chargeAuthorization() helper functions
apps/web/src/routes/api/payment/initialize/+server.ts — POST: create Paystack transaction, return authorization URL
apps/web/src/routes/api/payment/verify/+server.ts — POST: verify payment, activate subscription
apps/web/src/routes/api/payment/webhook/+server.ts — Paystack webhook listener (charge.success, subscription.disable)
Environment variables to add:


PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
1.3 Free 3-Month Trial System
All tiers get 3 months free. Card/wallet required to start. Users notified at: 7 days before expiry, 3 days before, 1 day before, and on charge.

Trial abuse prevention — multi-layer approach:

Paystack card fingerprinting: Store authorization.signature from Paystack in DB. On new trial signup, check if that card signature already has a completed trial in our system. Block second trials with the same card.
Phone OTP verification: Require phone number + OTP (via Paystack or Africa's Talking) before trial starts. One phone = one trial.
Device fingerprint: Collect browser fingerprint at signup using @fingerprintjs/fingerprintjs (free tier). Store hash, flag suspicious re-signups.
New DB tables (Drizzle schema):


// apps/web/src/lib/db/schema/subscriptions.ts
subscriptions: {
  id, userId, plan (basic|premium|creator), status (trial|active|cancelled|expired|paused),
  trialStartDate, trialEndDate, currentPeriodStart, currentPeriodEnd,
  paystackCustomerCode, paystackAuthorizationCode, cardSignature, cardLast4, cardBrand,
  phoneNumber (hashed), deviceFingerprint, cancelledAt, createdAt, updatedAt
}

familyAddons: {
  id, subscriptionId, userId, maxProfiles (default 8), pricePerMonth (5.00),
  status (active|cancelled), paystackAuthorizationCode, createdAt
}

ppvPurchases: {
  id, userId, contentId, contentType, amountPaid, currency (usd|usdc|stc),
  paystackRef, createdAt
}

trialBlacklist: {
  id, cardSignature, phoneHash, deviceFingerprint, reason, createdAt
}
New routes/components:

apps/web/src/routes/(app)/checkout/+page.svelte — unified checkout page (select plan → enter card → start trial)
apps/web/src/lib/components/billing/TrialBanner.svelte — shows trial status + days remaining in dashboard header
apps/web/src/routes/api/subscriptions/start-trial/+server.ts — validates anti-abuse checks, creates Paystack customer, initializes subscription
apps/web/src/routes/api/subscriptions/cancel/+server.ts — cancels at period end
apps/web/src/routes/api/subscriptions/status/+server.ts — returns current user subscription status
Email notifications (using existing SMTP + sendEmailAction() in apps/web/src/lib/authentication/server.ts):

Upgrade that function from webhook-based to direct SMTP using nodemailer
Trial expiry reminders (cron job or scheduled Paystack webhooks)
Welcome email on trial start
Payment confirmation
Cancellation confirmation
1.4 Pay-Per-View (PPV) System
Logic: Some content is marked PPV. Basic users cannot watch it for free — they see a paywall with a buy button. Premium+ users can also watch PPV (optionally — or PPV applies to everyone, just Basic loses the platform discount). PPV is per-content.

New DB tables:


ppvContent: {
  id, contentId, contentType (movie|show|episode|documentary),
  suggestedPrice (from creator), finalPrice (set by admin), currency (usd),
  isActive, adminApprovedAt, adminApprovedBy, creatorNote, createdAt
}
New files:

apps/web/src/routes/api/ppv/purchase/+server.ts — initiate PPV payment via Paystack
apps/web/src/routes/api/ppv/check-access/+server.ts — returns whether user can watch content (subscription check + PPV purchase check)
apps/web/src/lib/components/widgets/PPVPaywall.svelte — overlay shown when Basic user hits PPV content
Admin UI: apps/web/src/routes/(admin)/admin/content/+page.svelte — extend existing admin content page to set PPV flag + final price
Creator upload: apps/web/src/lib/components/creator/upload/BasicInfoStep.svelte — add "Suggest PPV price" field
1.5 Family Add-on
Price: +$5/month flat (all plans). Unlocks up to 8 profiles + full parental controls.

Changes:

apps/web/src/routes/(app)/plans/+page.svelte — add Family Add-on card/toggle under each plan
apps/web/src/routes/api/subscriptions/add-family/+server.ts — add Paystack recurring charge for add-on
apps/web/src/routes/(protected)/profile/+page.svelte — show "Manage Family" section if add-on active
Phase 2 — User Features
2.1 Persistent Family Profiles (up to 8)
Currently: UI shell with 4 hardcoded profiles, no DB persistence.

New DB table:


profiles: {
  id, userId, name, type (adult|teen|kids), avatarColor, avatarEmoji,
  pin (hashed, optional), isKidsMode (bool), isDefault, createdAt, updatedAt
}
Files to update/create:

apps/web/src/routes/(protected)/profiles/+page.svelte — connect to real DB (server load fn), enforce 2-profile limit without family add-on, 8 with
apps/web/src/routes/(protected)/profiles/+page.server.ts — NEW: load profiles, handle create/update/delete
apps/web/src/routes/api/profiles/+server.ts — CRUD endpoints for profiles
apps/web/src/lib/components/profile/AddProfileModal.svelte — persist to DB
apps/web/src/lib/components/profile/EditProfileModal.svelte — persist to DB
Profile session — when user selects "Who's Watching?", store activeProfileId in the server session (via better-auth session metadata or a separate cookie). All watch tracking, recommendations, and continue-watching are scoped to the active profile.

2.2 Full Parental Controls
Features: PIN lock on adult profiles, content restriction levels, safe exploration mode for kids, viewing reports.

New DB additions (extend profiles table):


// Add to profiles:
pin: varchar (hashed with bcrypt),
contentRating: enum (G|PG|PG13|R|all), // restriction level
safeModeEnabled: bool,
pinSetAt: timestamp
New DB table:


parentalReports: {
  id, parentProfileId, childProfileId, reportDate, totalWatchTime,
  contentWatched: jsonb, generatedAt
}
New files:

apps/web/src/lib/components/kids/ParentalPinModal.svelte — PIN entry dialog (shown when switching to adult profile from kids)
apps/web/src/lib/components/kids/SafeExplorationMode.svelte — kids-only navigation shell that blocks access to adult routes
apps/web/src/routes/(protected)/parental-controls/+page.svelte — NEW: set PIN, content rating, view reports per child profile
apps/web/src/routes/api/profiles/[id]/pin/+server.ts — set/verify PIN
apps/web/src/routes/api/parental/report/+server.ts — generate viewing report for parent
2.3 Continue Watching (Functional)
Currently: Hardcoded 2 items, no position tracking.

New DB table:


watchHistory: {
  id, userId, profileId, contentId, contentType, positionSeconds, durationSeconds,
  completionPercent, watchedAt, updatedAt, isCompleted
}
Files:

apps/web/src/routes/api/watch/progress/+server.ts — POST: save watch position (called every 30s during playback)
apps/web/src/routes/api/watch/history/+server.ts — GET: fetch continue watching list for profile
apps/web/src/lib/components/sections/dashboard/RecentlyWatched.svelte — connect to real API, show resume button with actual position
Update the video player (wherever playback happens) to call the progress endpoint on timeupdate events
2.4 Custom Playlists / Watchlists
New DB tables:


playlists: {
  id, userId, profileId, name, description, isPublic, createdAt
}
playlistItems: {
  id, playlistId, contentId, contentType, addedAt, sortOrder
}
New files:

apps/web/src/routes/(protected)/watchlist/+page.svelte — NEW: "My List" page, shows all saved content
apps/web/src/routes/api/playlists/+server.ts — CRUD for playlists
apps/web/src/routes/api/playlists/[id]/items/+server.ts — add/remove items
Update MediaCard.svelte — "+ My List" button to actually call the API
Update header nav — "/my-list" link now goes to this real page
2.5 AI-Driven Recommendations
Using Ollama (already in the stack per .env). Lightweight approach: use watch history + profile type + content metadata to build a recommendation prompt. Ollama returns ranked content IDs.

New files:

apps/web/src/lib/server/recommendations.ts — server-side: builds context from watch history, calls Ollama API, returns recommended content IDs
apps/web/src/routes/api/recommendations/+server.ts — GET: returns personalized recommendations for current profile
apps/web/src/lib/components/sections/dashboard/Recommendations.svelte — connect to real API, replace hardcoded data
Add to dashboard homepage: "Because you watched..." sections
Ollama model: Use llama3.2 or mistral (small, fast). Prompt pattern: "Given a user who watches [genres/titles], rank these content items by relevance: [content list]"

2.6 Reviews & Ratings
New DB tables:


reviews: {
  id, userId, profileId, contentId, contentType, rating (1-5), reviewText,
  isApproved (admin moderated), helpful (count), createdAt, updatedAt
}
reviewHelpful: {
  id, reviewId, userId, isHelpful (bool), createdAt
}
New files:

apps/web/src/lib/components/widgets/ReviewSection.svelte — star rating + text review form + list of reviews
apps/web/src/routes/api/reviews/+server.ts — POST new review, GET reviews for content
apps/web/src/routes/api/reviews/[id]/helpful/+server.ts — mark helpful
apps/web/src/routes/(admin)/admin/review/+page.svelte — already exists, connect to real reviews DB for moderation
Integrate into movie detail page (movies/[id].svelte)
2.7 Email Notifications for New Releases
Upgrade existing email from webhook to proper SMTP using nodemailer (install).

New DB table:


notificationPreferences: {
  id, userId, newReleases (bool), trialExpiry (bool), paymentConfirmation (bool),
  weeklyDigest (bool), creatorUpdates (bool), email (derived from user), updatedAt
}
New files:

apps/web/src/lib/server/email.ts — upgrade sendEmailAction() to use nodemailer with SMTP config from .env
apps/web/src/lib/server/notifications.ts — sendNewReleaseNotification(), sendTrialExpiryReminder(), sendPaymentReceipt()
apps/web/src/routes/api/notifications/preferences/+server.ts — GET/PUT user notification preferences
apps/web/src/routes/(protected)/settings/+page.svelte — NEW (or extend profile page): notification preferences toggle
Phase 3 — Kids Features & Gamification
3.1 Interactive Bible Stories / Quizzes (AI-Powered)
Using Ollama to generate quiz questions from Bible references already embedded in content metadata (bibleReference field on MediaItem).

New DB tables:


quizSessions: {
  id, profileId, contentId, questions: jsonb, answers: jsonb, score, completedAt
}
bibleStoryProgress: {
  id, profileId, storyId, isCompleted, lastReadPage, earnedSTC (bool)
}
New files:

apps/web/src/routes/kids/kiddies/bible-quiz/+page.svelte — NEW: kids quiz page
apps/web/src/routes/api/kids/quiz/generate/+server.ts — calls Ollama with Bible reference, returns 5 quiz questions
apps/web/src/routes/api/kids/quiz/submit/+server.ts — scores quiz, awards STC milestone if passed
apps/web/src/lib/components/kids/BibleQuizCard.svelte — animated quiz component for kids
apps/web/src/lib/components/kids/BibleStoryViewer.svelte — paginated story viewer with audio (TTS via browser API)
3.2 Kids Watch History + Continue Watching
watchHistory table (Phase 2) is profile-scoped so Kids profiles get their own separate history
apps/web/src/routes/kids/kiddies/+page.svelte — add "Continue Watching" row at top
apps/web/src/routes/kids/teens/+page.svelte — same
3.3 Streaks & Achievements
New DB tables:


streaks: {
  id, userId, profileId, currentStreak (days), longestStreak,
  lastWatchDate, streakStartDate, updatedAt
}
achievements: {
  id, code (unique string), name, description, icon, stcReward, category
}
userAchievements: {
  id, userId, profileId, achievementCode, earnedAt, stcAwarded (bool)
}
Achievement types (simple, as requested — "you just watched this, conclude this, watch this"):

first_watch — Watched first video (10 STC)
streak_7 — 7 day streak (20 STC)
streak_30 — 30 day streak (50 STC)
series_complete_{id} — Completed a series (15 STC)
night_owl — Watched after midnight (5 STC)
early_bird — Watched before 7am (5 STC)
faith_explorer — Watched content from 5 different faith themes (25 STC)
referral_1 — First referral (10 STC — already on contract)
New files:

apps/web/src/lib/server/achievements.ts — checkAndAwardAchievements(userId, profileId, event) — called after watch events
apps/web/src/routes/api/achievements/+server.ts — GET user achievements
apps/web/src/lib/components/widgets/AchievementToast.svelte — animated popup when achievement unlocked
apps/web/src/lib/components/widgets/StreakDisplay.svelte — flame icon + streak count for dashboard
apps/web/src/routes/(protected)/achievements/+page.svelte — NEW: full achievements page
3.4 Personal Milestones (STC-Linked)
Milestones are achievements tied to STC token accumulation and watching patterns:

Milestone	STC Earned	Trigger
First 100 STC earned	Badge	Cumulative STC balance hits 100
First 500 STC earned	Badge + 25 bonus STC	Balance hits 500
Staked for first time	Badge	On-chain stake event
First free month via STC	Badge	mintSubscriptionWithSTC called
1-year member	Badge + 50 STC	Account anniversary
1,000 hours watched	Special badge	Watch history total
New files:

apps/web/src/routes/(protected)/milestones/+page.svelte — milestone tracker with progress bars
apps/web/src/lib/server/milestones.ts — milestone evaluation logic
apps/web/src/routes/api/milestones/+server.ts — GET user milestone progress
Phase 4 — Technical Infrastructure
4.1 Adaptive Streaming (HLS)
HLS.js is already installed (hls.js: v1.6.13). The video encoder pipeline (/api/encoder/*) already exists.

What's needed: Ensure the video player uses HLS manifests and quality selector.

Files:

apps/web/src/lib/components/widgets/VideoPlayer.svelte — NEW (or extend existing player): integrate HLS.js with:
Auto quality selection (ABR based on bandwidth)
Manual quality picker (360p / 720p / 1080p / 4K)
Playback speed controls
Subtitle/caption track support
Progress reporting (calls /api/watch/progress every 30s)
Encoder pipeline (/api/encoder/process) — ensure it outputs HLS segments + master playlist with multiple quality levels
4.2 Offline Downloads (Functional)
Approach: Use Service Worker + Cache API to store HLS segments for offline viewing. Best for PWA context.

New files:

apps/web/static/sw.js — Service Worker: intercepts HLS segment requests, caches them on download
apps/web/src/lib/utils/download-manager.ts — downloadContent(contentId): fetches manifest, queues all segments for SW caching, stores metadata in IndexedDB
apps/web/src/lib/components/sections/dashboard/Downloads.svelte — connect to IndexedDB, real delete, show download progress, storage used
apps/web/src/routes/api/downloads/manifest/[id]/+server.ts — returns signed HLS manifest URL for offline caching (auth-gated, time-limited)
Restriction: Downloads available to Premium and Creator tiers only (not Basic).

4.3 PWA + Install Prompt
New files:

apps/web/static/manifest.json — PWA manifest: name, icons (all sizes), theme_color #0b0c10, background_color, start_url, display: standalone
apps/web/src/lib/components/widgets/PWAInstallPrompt.svelte — listens for beforeinstallprompt event, shows custom "Install App" button/banner
apps/web/src/routes/(app)/device-support/+page.svelte — NEW: device support page (which devices work, download links for app stores when available, PWA install guide)
Update apps/web/src/app.html — link manifest, add meta theme-color, add apple-touch-icon
Update apps/web/src/lib/components/sections/header.svelte or footer — "Install App" link that triggers the PWA prompt
Mobile optimization review:

Audit key pages for touch targets, font sizes, scroll behavior on mobile
Ensure video player controls are touch-friendly
Bottom navigation bar consideration for mobile views
4.4 Device Support Page
New file: apps/web/src/routes/(app)/device-support/+page.svelte

Supported browsers table
Supported devices (Smart TV, Tablet, Mobile, Desktop)
Minimum requirements
PWA install guide (step-by-step with screenshots)
Troubleshooting FAQ (streaming issues, download issues, wallet connection)
Smart Contract Updates Required
Pricing Changes
packages/contracts/contracts/SepharSubscription.sol:

Update tierPrices: Basic 1000 cents → 300 cents, Premium 1500→1000, Creator 2500→1500
Consider adding ppvMint() function for pay-per-view on-chain (can handle off-chain in Sprint 1 first)
After redeployment to Amoy testnet:

Copy addresses from packages/contracts/deployments/amoy-80002.json → apps/web/src/lib/web3/config.ts
Smart Contract Critical Fixes (Pre-Launch)
Five issues identified in the tokenomics audit that must be fixed before or during contract redeployment. All five are in packages/contracts/contracts/.

Fix 1 — Vesting Lock on 300M Platform Dev Tokens (CRITICAL — trust risk)
Problem: The entire 300M STC in the platform treasury has zero time-lock. Any investor or crypto analyst will flag this as a rug-pull risk — the founding team could theoretically dump all 300M tokens at once.

Fix: Deploy an OpenZeppelin VestingWallet contract that holds the 300M allocation:

Cliff: 6 months (nothing releases for the first 6 months)
Duration: 48 months linear vesting after cliff
The founding team receives ~6.25M STC/month after the cliff, preventing a dump
New file: packages/contracts/contracts/FounderVesting.sol


// Deploy OpenZeppelin VestingWallet with:
// beneficiary = founding team multisig address
// startTimestamp = deployment timestamp + 6 months
// durationSeconds = 42 months (48 - 6 cliff)
// Then transfer 300M STC to this contract instead of directly to platform treasury
Deploy script update: packages/contracts/scripts/deploy.ts — after deploying StudioToken, deploy FounderVesting, transfer 300M to it instead of treasury.

Fix 2 — Referral Cap (CRITICAL — pool drain risk)
Problem: referralReward pays 10 STC/referral with no monthly limit. A bot could generate thousands of fake referrals and drain the entire rewards pool.

Fix in StudioToken.sol: Add monthly referral tracking and cap at 5 referrals/user/month:


mapping(address => uint256) public monthlyReferralCount;
mapping(address => uint256) public lastReferralMonth;
uint256 public maxMonthlyReferrals = 5; // owner-adjustable

function rewardReferral(address referrer) external onlyOwner {
    uint256 currentMonth = block.timestamp / 30 days;
    if (lastReferralMonth[referrer] != currentMonth) {
        monthlyReferralCount[referrer] = 0;
        lastReferralMonth[referrer] = currentMonth;
    }
    require(monthlyReferralCount[referrer] < maxMonthlyReferrals, "Monthly referral cap reached");
    monthlyReferralCount[referrer]++;
    _rewardUser(referrer, referralReward);
}
Fix 3 — STC Subscription Revenue Split Disclosure (IMPORTANT — creator relations)
Problem: mintSubscriptionWithSTC() does not call distributeRevenue(). When users pay with STC tokens, creators receive $0. This is not a bug — it's a deliberate loyalty-redemption mechanic (like airline miles) — but creators must be told.

Fix options (choose one):

Option A (Recommended): Document clearly in creator agreement (/creator/agreement page) that STC redemptions are loyalty tokens and do not trigger revenue splits. Add a UI callout on the plans page explaining this distinction.
Option B: Partially fund revenue split from platform treasury when STC is redeemed (complex, reduces treasury). Not recommended at launch.
Action: Update apps/web/src/routes/(creator)/creator/agreement/+page.svelte — add explicit clause about STC redemptions.

Fix 4 — Add addToStake() Function (MODERATE — retention risk)
Problem: Staking tier is calculated once at stake time and frozen. A user who stakes 1,000 STC for Tier 1 and then earns another 9,000 STC cannot upgrade to Tier 3 — they must wait for the full lock to expire before restaking. This kills upgrade motivation.

Fix in StudioToken.sol: Add addToStake() that lets users top up existing stake and recalculates tier:


function addToStake(uint256 additionalAmount) external {
    StakeInfo storage stake = stakes[msg.sender];
    require(stake.amount > 0, "No existing stake");
    require(stake.unlockTime > block.timestamp, "Stake already expired");

    _transfer(msg.sender, address(this), additionalAmount);
    stake.amount += additionalAmount;
    stake.discountTier = _calculateTier(stake.amount, stake.lockPeriod);

    emit StakeAdded(msg.sender, additionalAmount, stake.amount, stake.discountTier);
}
Also update frontend (apps/web/src/routes/(app)/token/+page.svelte): Add "Top Up Stake" button that appears when user has an active stake and sufficient unstaked STC balance.

Fix 5 — Phase-Based STC Subscription Amount (MODERATE — treasury risk)
Problem: 200 STC at launch (when STC ≈ $0.001) costs the user $0.20 for a $10 subscription. Platform receives 50× less value than it should.

Fix: The owner can call updateSTCSubscriptionAmount() (already exists in contract) to change the amount without redeployment. Follow this schedule:

Phase	STC Price	Set Amount To	User Pays	Platform Value
Launch	Below $0.02	500 STC	~$5 at $0.01	$5 — fair discount
Growth	$0.02–$0.05	300 STC	~$6–$15	Near full price
Mature	Above $0.05	200 STC	~$10+	Full parity
Update StudioToken.sol: Change initial deployment value of stcSubscriptionAmount from 200e18 to 500e18.

Update plans page (apps/web/src/routes/(app)/plans/+page.svelte): Display current STC subscription amount dynamically from contract (already reads from chain) and add a tooltip explaining the phase system.

Staking Tier Reference (How It Works)
The platform has two separate systems: how you pay and how you get discounts.

Two Ways to Pay
Method	How it works	Creator payout?	Buyback fires?
Cash (USDC/card)	Full subscription price, auto-split on-chain	✅ 30% to creators	✅ 8% burns STC
STC Tokens	500→300→200 STC (phase-based) → 1 month Basic	❌ $0 to creators	❌ No burn
Staking Discount Tiers
Tier	Discount	How to reach	Example on $10/mo
Tier 1	10% off	Lock 1,000+ STC for 90 days–1 year	Pay $9
Tier 2	20% off	Lock 1,000+ STC for 2 years OR 3,500+ STC for 90d–1yr	Pay $8
Tier 3	35% off	Lock 3,500+ STC for 2 years OR 10,000+ STC for 90d–1yr	Pay $6.50
Tier 4	50% off	Lock 10,000+ STC for 2 years OR 35,000+ STC anytime	Pay $5
Tier 1 is reachable in ~200 days of watching at the 5 STC/day cap — no purchase needed.
addToStake() (Fix 4) lets users upgrade tiers without waiting for lock expiry.

Database Migration Order
Run Drizzle migrations in this order:

subscriptions table (core, other tables reference it)
profiles table (scoped to user)
watchHistory table (scoped to profile)
playlists + playlistItems
ppvContent + ppvPurchases
familyAddons
reviews + reviewHelpful
achievements + userAchievements
streaks
notificationPreferences
quizSessions + bibleStoryProgress
parentalReports
trialBlacklist
milestones (user_milestones)
All migration files go in: apps/web/src/lib/db/migrations/

Build Order (Implementation Phases)
Sprint 1 — Core Revenue & Subscription
Update subscription pricing (plans page + contract)
Paystack integration + checkout page
Free trial flow + anti-abuse (card fingerprint + phone OTP)
Trial expiry email notifications (upgrade email service to nodemailer)
Basic subscription status API (/api/subscriptions/status)
PPV system (DB + admin UI + creator upload field + paywall component)
Family add-on billing
Sprint 2 — Profiles & Parental Controls
Persistent profiles DB + CRUD API
Profile session (activeProfileId in session/cookie)
Parental controls (PIN, content rating, safe mode)
Parental viewing reports
Family add-on profile limit enforcement
Sprint 3 — Content Features
Continue Watching (watch history DB + progress API + player integration)
Watchlists / My List (DB + API + MediaCard integration)
Reviews & Ratings (DB + API + MovieDetail integration + admin moderation)
Email notifications (new release, weekly digest)
Notification preferences page
Sprint 4 — AI & Engagement
AI recommendations (Ollama integration + recommendations API)
Achievements system (DB + award logic + toast notifications)
Streaks system
Personal milestones (STC-linked)
Interactive Bible quiz (Ollama + kids quiz page)
Kids Continue Watching (profile-scoped, already in watchHistory)
Sprint 5 — Technical
Video player with HLS adaptive streaming
Offline downloads (Service Worker + download manager)
PWA manifest + install prompt
Device support page
Mobile optimization audit
Key Files Reference
Area	Critical Files
Subscription contract	packages/contracts/contracts/SepharSubscription.sol
Web3 config	apps/web/src/lib/web3/config.ts
Plans page	apps/web/src/routes/(app)/plans/+page.svelte
Auth config	apps/web/src/lib/auth.ts
DB schema	apps/web/src/lib/db/
Email service	apps/web/src/lib/authentication/server.ts
Header nav	apps/web/src/lib/components/sections/header.svelte
Footer	apps/web/src/lib/components/sections/footer.svelte
Media card	apps/web/src/lib/components/widgets/MediaCard.svelte
Dashboard	apps/web/src/routes/(protected)/dashboard/+page.svelte
Kids age gate	apps/web/src/lib/components/kids/ProfileAgeGate.svelte
Profiles UI	apps/web/src/routes/(protected)/profiles/+page.svelte
Downloads UI	apps/web/src/lib/components/sections/dashboard/Downloads.svelte
Recommendations	apps/web/src/lib/components/sections/dashboard/Recommendations.svelte
Admin content	apps/web/src/routes/(admin)/admin/content/+page.svelte
Creator upload	apps/web/src/lib/components/creator/upload/BasicInfoStep.svelte
Hooks server	apps/web/src/hooks.server.ts
Verification
After each sprint:

Sprint 1: Test checkout → Paystack sandbox → trial starts → email received → PPV paywall shows on Basic account
Sprint 2: Create 8 profiles on family add-on account → set PIN → test kids safe mode blocks adult routes
Sprint 3: Play video → pause → reload → verify "Continue Watching" resumes at correct time → add to watchlist → leave review
Sprint 4: Check recommendations change after watch history builds → earn achievement → see streak counter
Sprint 5: Throttle network in DevTools → verify HLS auto-drops to 360p → download content → go offline → verify playback → install PWA from device support page