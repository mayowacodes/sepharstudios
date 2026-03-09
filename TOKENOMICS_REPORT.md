# Sephar Studios — STC Tokenomics Expert Report

> **Confidential · Internal Strategic Review**
> Token: STC — Studio Token (ERC-20) · Network: Polygon (MATIC)
> Report Date: March 2026 · Current Supply: 2,000,000,000 STC
> Subscription Contract: SepharSubscription.sol (ERC-721) · AMM: Internal CPMM · 0.3% fee
>
> All figures are derived directly from audited Solidity smart contract source code (StudioToken.sol, SepharSubscription.sol, TokenAMM.sol). Projections assume linear growth unless noted. This document is prepared for internal strategic review and is not a financial prospectus.

---

## Table of Contents

1. [Token Allocation & Distribution](#1-token-allocation--distribution)
2. [Reward Emission Rates](#2-reward-emission-rates)
3. [Revenue Distribution Model](#3-revenue-distribution-model)
4. [AMM Mechanics & Price Discovery](#4-amm-mechanics--price-discovery)
5. [Staking Discount Framework](#5-staking-discount-framework)
6. [Pool Sustainability Analysis](#6-pool-sustainability-analysis)
7. [2 Billion vs 5 Billion Supply Comparison](#7-2-billion-vs-5-billion-supply-comparison)
8. [The 200 STC Subscription — Full Analysis](#8-the-200-stc-subscription--full-analysis)
9. [Strategic Recommendations](#9-strategic-recommendations)
10. [Founder Gain Strategy](#10-founder-gain-strategy)

---

## 1. Token Allocation & Distribution

The following allocations are hard-coded as `constant` values in **StudioToken.sol** and are immutable after deployment. There is no vesting cliff function in the current contract — all pools are minted at construction and immediately held in their respective pool addresses.

```
2,000,000,000 STC Total Supply

████████████████████████████████████████████████████  User Rewards Pool     50%  1,000,000,000 STC
██████████████████████████                            Creator Incentives    25%    500,000,000 STC
███████████████                                       Platform Development  15%    300,000,000 STC
██████████                                            Community Governance  10%    200,000,000 STC
```

| Pool | STC Amount | % | Controller Address | Purpose |
|---|---|---|---|---|
| **User Rewards Pool** | 1,000,000,000 | 50% | `userRewardsPool` | Watch-to-earn, referral bonuses |
| **Creator Incentives** | 500,000,000 | 25% | `creatorRewardsPool` | Creator milestone & performance bonuses |
| **Platform Development** | 300,000,000 | 15% | `platformTreasury` | Team, operations, liquidity seeding |
| **Community Governance** | 200,000,000 | 10% | `governancePool` | DAO treasury, proposals |
| **Total** | **2,000,000,000** | **100%** | — | Fixed supply · no further minting |

> ⚠️ **On-Chain Risk: No Vesting Contract**
> The `platformTreasury` holds 300M STC with no time-lock enforced at the contract level. A crypto expert reviewer will flag this as a centralisation risk — the founding team could theoretically dump all 300M tokens. **Recommendation:** deploy a vesting contract (e.g., OpenZeppelin `VestingWallet`) that releases the 300M over 48 months with a 6-month cliff.

---

## 2. Reward Emission Rates

Current on-chain values from **StudioToken.sol**. All three values are adjustable via `updateRewardRates()` (onlyOwner).

| Mechanism | Rate | On-Chain Variable | Hard Cap |
|---|---|---|---|
| Watch-to-earn | 1 STC / hour | `viewingRewardRate` | 5 STC / day |
| Daily cap | 5 STC / day | `dailyUserRewardLimit` | Reset every 86,400 s |
| Referral bonus | 10 STC / referral | `referralReward` | **No per-user cap** |

> ⚠️ **Referral Cap Gap**
> The referral reward has no per-user monthly cap. A single user could generate thousands of referrals and drain the pool disproportionately. The daily limit only applies to `viewingReward`, not `referralReward`. Adding a monthly referral cap (e.g. max 5 referrals/month = 50 STC/month) is strongly recommended.

### User Rewards Pool Burn Rate Projections

| Daily Active Users | STC/day emitted | STC/year emitted | Pool life (no buyback) | Pool life (8% buyback @$10 avg) |
|---|---|---|---|---|
| 1,000 | 5,000 | 1,825,000 | ✅ 548 years | ✅ ∞ sustainable |
| 10,000 | 50,000 | 18,250,000 | ✅ 54.8 years | ✅ ∞ sustainable |
| 100,000 | 500,000 | 182,500,000 | ⚠️ 5.5 years | ⚠️ Needs 62,500 paying subs |
| 500,000 | 2,500,000 | 912,500,000 | ❌ 1.1 years | ❌ Needs 312,500 paying subs |
| 1,000,000 | 5,000,000 | 1,825,000,000 | ❌ 200 days | ❌ Needs 625,000 paying subs |

> ✅ **Buyback Self-Sustain Formula**
> At STC = $0.01/token with 100,000 DAU, only **62,500 paying subscribers** sustains the pool indefinitely through buybacks alone — without touching the original 1B pool.

---

## 3. Revenue Distribution Model

Hard-coded in **SepharSubscription.sol** as basis-point constants (10,000 = 100%). These are immutable — changing them requires redeployment.

| Recipient | Basis Points | % | Per $10 Sub | Per $15 Sub | Per $25 Sub |
|---|---|---|---|---|---|
| Platform Operations | 5500 | 55% | $5.50 | $8.25 | $13.75 |
| Creator Revenue Pool | 3000 | 30% | $3.00 | $4.50 | $7.50 |
| **STC Buyback** | **800** | **8%** | **$0.80** | **$1.20** | **$2.00** |
| User Rewards | 400 | 4% | $0.40 | $0.60 | $1.00 |
| Platform Reserve | 300 | 3% | $0.30 | $0.45 | $0.75 |
| **Total** | **10000** | **100%** | **$10.00** | **$15.00** | **$25.00** |

### Monthly Buyback Volume at Scale

| Paying Subscribers | Avg Plan | Monthly Revenue | Monthly STC Buyback (USDC) |
|---|---|---|---|
| 10,000 | Basic $10 | $100,000 | ⚠️ $8,000 |
| 50,000 | Basic $10 | $500,000 | ✅ $40,000 |
| 100,000 | Mixed $12 | $1,200,000 | ✅ $96,000 |
| 500,000 | Mixed $12 | $6,000,000 | ✅ $480,000 |

> ℹ️ **Important: Buyback Burns STC**
> The `executeBuyback()` function in TokenAMM.sol calls `stcToken.burn(stcBought)` — purchased tokens are permanently destroyed, reducing total supply. This is deflationary and directly supports price appreciation. The 8% buyback allocation is conservative and can be increased by redeploying with higher basis points.

---

## 4. AMM Mechanics & Price Discovery

| Parameter | On-Chain Value | Notes |
|---|---|---|
| Formula | Constant Product (x·y = k) | Standard Uniswap v2 style |
| Trading fee | 0.3% (30 bps) | Adjustable via `updateTradingParameters()` |
| Protocol fee share | 10% of trading fee | Goes to treasury address |
| Max price impact | 5% per trade | Anti-manipulation guard |
| Max trade size | 100,000 STC | Anti-whale single-trade limit |
| Buyback % | 8% of revenue (800 bps) | Held in `buybackReserve` |
| Revenue multiplier cap | 3.0× | Applied to AMM reported price |

### Revenue Price Multiplier

TokenAMM.sol applies a dynamic multiplier to the reported STC price based on platform revenue:

```
multiplier = 100 + (monthly_revenue_USD ÷ 1,000) × 5
cap = 300 (3.0×)

Examples:
  $0/mo revenue   → 1.0× price multiplier
  $10,000/mo      → 1.5× price multiplier
  $20,000/mo      → 2.0× price multiplier
  $40,000/mo      → 3.0× (MAX) price multiplier
```

> ⚠️ **The multiplier reaches maximum (3×) at only $40,000/month** — roughly 4,000 Basic subscribers. Early liquidity providers benefit from this multiplier immediately upon threshold crossing.

### Seeding the AMM — Founder Implications

| Initial Liquidity Seed | USDC Seeded | STC Seeded | Initial Price | Pool Depth |
|---|---|---|---|---|
| Minimal launch | $1,000 | 1,000,000 STC | $0.001/STC | Thin · high slippage |
| Recommended launch | $10,000 | 1,000,000 STC | $0.01/STC | ⚠️ Moderate |
| Strong launch | $50,000 | 1,000,000 STC | $0.05/STC | ✅ Good depth |
| Ideal launch | $100,000 | 2,000,000 STC | $0.05/STC | ✅ Excellent depth |

---

## 5. Staking Discount Framework

Staking is handled by `stakeForDiscount()` in StudioToken.sol. Tokens are transferred to the contract address and locked. The discount tier is calculated at stake time and stored — it does not update if the user adds more tokens later.

| STC Staked | Lock Period | Discount Tier | Discount % | Saving on $10 Basic | Saving on $15 Premium |
|---|---|---|---|---|---|
| 1,000+ STC | 90–365 days | Tier 1 | 10% | $1.00/mo | $1.50/mo |
| 1,000+ STC | 730 days | Tier 2 | 20% | $2.00/mo | $3.00/mo |
| 3,500+ STC | 90–365 days | Tier 2 | 20% | $2.00/mo | $3.00/mo |
| 3,500+ STC | 730 days | Tier 3 | 35% | $3.50/mo | $5.25/mo |
| 10,000+ STC | 90–365 days | Tier 3 | 35% | $3.50/mo | $5.25/mo |
| 10,000+ STC | 730 days | Tier 4 | 50% | ✅ $5.00/mo | ✅ $7.50/mo |
| 35,000+ STC | Any lock | Tier 4 | 50% | ✅ $5.00/mo | ✅ $7.50/mo |

**Time to earn Tier 1 stake (at 5 STC/day):** 200 days of watching alone — no purchase required.
**Annual saving at Tier 4 (Basic plan):** $60/year vs. full price $120/year.

> ❌ **Staking Contract Gap: No `addToStake()` Function**
> Users cannot add tokens to an existing stake position. To upgrade tiers they must wait for full lock expiry, then restake. A future `addToStake()` function that adds tokens and recalculates the discount tier would significantly improve retention.

---

## 6. Pool Sustainability Analysis

The platform has two complementary sustainability mechanisms: the initial 1B STC pool and the ongoing revenue buyback. Sustainability is achieved when monthly buyback ≥ monthly emissions.

```
Monthly emission    = DAU × dailyUserRewardLimit × 30
Monthly buyback (STC) = (subscribers × avg_price × 0.08) ÷ STC_market_price

Self-sustain condition: Monthly buyback ≥ Monthly emission

At STC = $0.01/token, DAU = 100,000:
  Emission        = 100,000 × 5 × 30 = 15,000,000 STC/month
  Buyback needed  = 15,000,000 × $0.01 = $150,000 USDC/month
  Subs needed     = $150,000 ÷ (12 × 0.08) = 156,250 paying subscribers
```

### Breakeven Subscribers at Various STC Prices

| STC Price | DAU = 10k | DAU = 100k | DAU = 500k |
|---|---|---|---|
| $0.001 | ✅ 625 subs | ✅ 6,250 subs | ⚠️ 31,250 subs |
| $0.005 | ✅ 3,125 subs | ⚠️ 31,250 subs | ❌ 156,250 subs |
| $0.01 | ✅ 6,250 subs | ⚠️ 62,500 subs | ❌ 312,500 subs |
| $0.05 | ⚠️ 31,250 subs | ❌ 312,500 subs | ❌ 1,562,500 subs |
| $0.10 | ⚠️ 62,500 subs | ❌ 625,000 subs | ❌ 3,125,000 subs |

> ✅ **Key Insight: Low STC Price = Easier Sustainability**
> Counter-intuitively, a lower STC price makes the ecosystem *easier* to sustain via buybacks — $1 of buyback buys more STC to replenish the pool. The optimal strategy: grow subscribers aggressively while STC is cheap, let buybacks accumulate supply reduction, then price appreciation compounds naturally through scarcity.

---

## 7. 2 Billion vs 5 Billion Supply Comparison

| Dimension | 2B Supply | 5B Supply | Winner |
|---|---|---|---|
| Founder % dilution | None (baseline) | None (same %) | — |
| Buyback price impact (per $1) | Higher | Lower (2.5× less) | ✅ 2B |
| User pool runway @ 100k DAU | 5.5 years | 13.7 years | ✅ 5B |
| Creator pool runway | Moderate | Extended 2.5× | ✅ 5B |
| Perceived scarcity (price psychology) | Higher | Lower | ✅ 2B |
| Initial STC price (same seed liquidity) | Higher | 2.5× lower | ✅ 2B |
| Staking tier attainability (earn 1k STC) | 200 days | 200 days (same rates) | — |
| 200 STC subscription value gap | Same risk | Same risk | — |
| Complexity of contract change | N/A | Requires full redeploy | ✅ 2B |

> ❌ **Recommendation: Keep 2B Supply**
> Increasing to 5B does not solve the core challenges (creator pool management, subscription amount calibration). It dilutes the price impact of every dollar of buyback — the primary price-appreciation engine. The better solution is restructuring *how* creators earn and spend tokens. Scarcity drives long-term value; runway is extended through design, not dilution.

### Alternative: Creator Staking Model (No Supply Increase Needed)

| Creator Tier | STC Staked Required | Revenue Share | Effect on Pool |
|---|---|---|---|
| Standard | 0 STC | 30% | Creator = net receiver only |
| Verified | 5,000 STC staked | 40% | Creator locks 5k STC ✅ |
| Pro Creator | 15,000 STC staked | 50% | Creator locks 15k STC ✅ |
| Studio Creator | 50,000 STC staked | 55% | Creator locks 50k STC ✅ |

With 1,000 Pro Creators each staking 15,000 STC: **15,000,000 STC locked** — equivalent to 3 years of 100k DAU emissions removed from circulation, at zero supply cost.

---

## 8. The 200 STC Subscription — Full Analysis

The `mintSubscriptionWithSTC()` function allows users to spend 200 STC (`stcSubscriptionAmount`, adjustable by owner) to receive one month of Basic access.

### 8.1 What the Contract Actually Does

- User must first call `stcToken.approve(subscriptionContract, 200e18)`
- 200 STC is transferred from the user's wallet to `platformTreasury` (not burned)
- A Basic-tier subscription NFT is minted or the user's existing NFT is extended by 30 days
- The redemption count is incremented; cooldown is applied based on whether count is odd or even
- The `amountPaid` field in the Subscription struct is set to 0 (STC payment, not USDC)
- `distributeRevenue()` is **NOT called** — creators receive $0 from STC redemptions

> ❌ **Critical Gap: No Revenue Distribution on STC Redemptions**
> When a user redeems 200 STC for a subscription, creators receive $0 in USDC. The 30% creator share, 8% buyback, and 4% user rewards that apply to fiat subscriptions do not occur. Only the platform treasury receives the 200 STC. This should be documented clearly in creator agreements.

### 8.2 Price Sensitivity Table

The 200 STC amount is **not pegged to $10 USD**. As STC market price moves, the real-world cost and value received both change:

| STC Market Price | Cost to User (200 STC) | vs $10 Fiat Sub | Treasury Receives | User Incentive | Platform Risk |
|---|---|---|---|---|---|
| $0.001 | $0.20 | 98% cheaper | $0.20 | ❌ Extreme (abuse) | ❌ Critical drain |
| $0.002 | $0.40 | 96% cheaper | $0.40 | ❌ Very high | ❌ High drain |
| $0.005 | $1.00 | 90% cheaper | $1.00 | ⚠️ High | ⚠️ Moderate risk |
| $0.01 | $2.00 | 80% cheaper | $2.00 | ⚠️ High | ⚠️ Manageable w/ cooldown |
| $0.02 | $4.00 | 60% cheaper | $4.00 | ⚠️ Moderate | ✅ Low risk |
| **$0.05** | **$10.00** | **Parity** | **$10.00** | ✅ **Balanced** | ✅ **No risk** |
| $0.10 | $20.00 | 2× overpriced | $20.00 | ❌ Nobody uses | ✅ No drain |
| $0.20 | $40.00 | 4× overpriced | $40.00 | ❌ Feature useless | ✅ No drain |

### 8.3 The Cooldown Mechanism — Does It Protect?

The alternating cooldown (100 days → 200 days → 100 days → 200 days) limits a single user to approximately 2.4 redemptions per year:

```
Cooldown cycle:
  Redemption 1 → wait 100 days
  Redemption 2 → wait 200 days
  Redemption 3 → wait 100 days
  Redemption 4 → wait 200 days

Average cooldown      = (100 + 200) ÷ 2 = 150 days per redemption
Redemptions per year  = 365 ÷ 150 = ~2.4 per user
Max annual STC spent  = 2.4 × 200 = 480 STC/year
Max annual fiat saved = 2.4 × $10 = $24/year

At STC = $0.001:  480 STC costs $0.48 to save $24 of subscriptions
At STC = $0.01:   480 STC costs $4.80 to save $24 of subscriptions
At STC = $0.05:   480 STC costs $24.00 to save $24 of subscriptions (parity)
```

The cooldown reduces how fast damage occurs — it does not prevent undervaluation at low STC prices.

### 8.4 Arguments For and Against 200 STC

**Arguments for keeping 200 STC:**
- Cooldown limits to ~2.4 uses/year per user
- Returned STC stays in treasury (not burned), recyclable
- Strong incentive for users to earn and hold STC
- Owner can raise the amount as price rises via `updateSTCSubscriptionAmount()`
- Creates powerful viral marketing hook ("earn free subscriptions by watching")

**Arguments to raise above 200 STC:**
- At $0.001/STC, platform earns $0.20 per subscription (not economically viable)
- Creators receive $0 from STC redemptions
- 200 STC takes only 40 days to earn (far below the 100-day cooldown minimum)
- Users earn faster than they can redeem — creates treasury drain from accrued STC
- No USD floor — collapses as utility at low token prices

### 8.5 Alternative Subscription Amount Structures

| Structure | Description | Pro | Con |
|---|---|---|---|
| **Fixed 200 STC** *(current)* | Always 200 STC = 1 month | Simple, predictable | No USD floor — dangerous at low price |
| **Dynamic: $8 worth of STC** | Amount = $8 ÷ current AMM price | Always economically sound; auto-adjusts | Requires on-chain price oracle; added complexity |
| **Floor: max(200, $5÷price)** | Never below 200, rises if STC is cheap | Protects against low-price drain | Requires owner to update manually or oracle |
| **Tiered by redemption count** | 1st: 200, 2nd: 300, 3rd: 400 STC… | Organic price ladder; rewards first adopters | Penalises loyal users over time |
| **500 STC at launch, reduce later** | Start high, reduce as price rises | Protects during low-price phase; dropping cost feels rewarding | Less attractive at launch |

### 8.6 Recommended: Phase-Based STC Subscription Amount

> ✅ **Phase 1 (Launch → STC < $0.02):** Set to **500 STC = 1 month Basic**
> At $0.01/STC this costs the user $5 — a 50% discount that is generous but not exploitable.
> Treasury receives $5 in STC value per redemption.
>
> ✅ **Phase 2 (STC $0.02–$0.05):** Reduce to **300 STC**
> At $0.03/STC = $9 — near parity. Users feel rewarded as the cost drops with price growth.
>
> ✅ **Phase 3 (STC > $0.05):** Reduce to **200 STC**
> At $0.05/STC = $10 parity. Feature operates at full economic balance with fiat pricing.
>
> All adjustments via `updateSTCSubscriptionAmount()` — **no redeployment needed**.

### 8.7 The STC-Treasury Recycling Advantage

Spent STC returns to `platformTreasury` (not burned). This creates a recycling loop superior to burning:

```
User earns STC (from userRewardsPool)
  → User spends 500/300/200 STC on subscription
  → STC arrives at platformTreasury
  → Platform options:
      (a) Re-seed AMM buyback reserve       [deflationary]
      (b) Pay creator milestone bonuses     [recirculation]
      (c) Add to AMM liquidity              [depth building]
      (d) Burn for supply reduction         [deflationary]
  → Circular economy: no new issuance required for this loop
```

The treasury controls this decision dynamically based on market conditions — a structural advantage over fixed-burn mechanisms.

---

## 9. Strategic Recommendations

### 1. Add a Vesting Contract for the 300M Platform Development Allocation
Deploy an OpenZeppelin `VestingWallet` for the 15% platform allocation (300M STC). A 48-month linear vest with a 6-month cliff signals long-term commitment to investors and prevents a "team dump" perception. This is the single highest-impact trust signal a crypto expert will look for.

### 2. Add a Monthly Referral Cap to Prevent Pool Drain
The current `referralReward` has no per-user monthly cap. Add a mapping to track monthly referral claims and cap at 5 referrals/month per user (50 STC/month max from referrals). Without this, a botting attack could drain the rewards pool through fake referrals before the platform reaches scale.

### 3. Phase the STC Subscription Amount (500 → 300 → 200 STC)
Start at 500 STC at launch (protecting treasury during the low-price phase), reduce to 300 STC when AMM price exceeds $0.02, then to 200 STC when price exceeds $0.05. Use `updateSTCSubscriptionAmount()` — no redeploy needed. This prevents treasury drain at launch while maintaining the feature's long-term utility.

### 4. Implement Creator Staking Tiers (No Supply Increase Needed)
Add staking tiers for creators: stake 5k STC → 40% revenue share, 15k STC → 50%, 50k STC → 55%. This converts creators from net token sellers into net token lockers, extending the creator pool indefinitely and increasing aggregate staked supply. 1,000 Pro Creators staking 15k STC each locks 15M STC.

### 5. Increase Buyback to 15% Once Platform Reaches $50k/mo Revenue
The current 8% buyback is conservative. Once the platform reaches $50k/month, increasing to 15% buyback would significantly accelerate price appreciation. This requires redeployment with new basis-point constants but is the highest-leverage growth action at scale.

### 6. Seed AMM with Minimum $10,000 USDC + 1,000,000 STC at Launch
This sets the initial price at $0.01/STC. At this price the 200 STC subscription costs $2 (users get 80% off), which is aggressive but the cooldown limits damage. With $10k seed the AMM has enough depth to absorb 5,000 STC of sell pressure (~$50) before noticeable slippage.

### 7. Add `addToStake()` Function for Seamless Tier Upgrades
Users currently cannot add tokens to an existing stake position. A user who staked 1,000 STC for Tier 1 and later earns more cannot upgrade to Tier 2 without waiting for the full lock period to expire. An `addToStake()` function that adds tokens and recalculates the discount tier improves retention significantly.

### 8. Do NOT Increase Supply to 5B — Use Design to Extend Runway
Increasing supply dilutes the buyback price impact by 2.5×. Every $1 of buyback buys 2.5× fewer tokens, weakening the deflationary mechanism. Use creator staking (locks supply) and dynamic reward caps (slows emission at scale) to extend runway instead. Scarcity is the primary long-term value driver.

---

## 10. Founder Gain Strategy

As owner and co-founder, there are four distinct value-capture streams built into the contracts:

### Stream 1 — Platform Operations Revenue (55% of all subscriptions)
Every USDC subscription flows 55% to `platformTreasury`. This is recurring, stable fiat-equivalent revenue.

| Subscribers | Avg Plan | Monthly Revenue | Monthly to Treasury (55%) |
|---|---|---|---|
| 10,000 | $10 | $100,000 | $55,000 |
| 50,000 | $10 | $500,000 | $275,000 |
| 100,000 | $12 avg | $1,200,000 | $660,000 |
| 500,000 | $12 avg | $6,000,000 | $3,300,000 |

### Stream 2 — AMM LP Fee Income (0.3% of every trade)
As the initial liquidity seeder you receive a proportional share of every 0.3% swap fee. At $100,000/month in AMM volume: **$300/month passive**. Scales independently of subscriptions as users buy STC to stake or redeem subscriptions.

### Stream 3 — Token Appreciation on the 300M Platform Allocation

| STC Price | 300M STC Value | Milestone trigger |
|---|---|---|
| $0.001 (launch) | $300,000 | Starting point |
| $0.01 | $3,000,000 | ~62,500 paying subscribers |
| $0.05 | $15,000,000 | AMM parity with fiat price |
| $0.10 | $30,000,000 | Sustained buyback + staking |
| $0.50 | $150,000,000 | Ecosystem maturity |
| $1.00 | $300,000,000 | Category-leading platform |

> 💡 **The most leveraged action you can take is growing paying subscribers.**
> More subscribers → more USDC buyback → higher STC price → 300M allocation worth more.
> A 10× increase in subscribers produces roughly a 10× increase in buyback pressure, compounding into price appreciation of the tokens you hold.

### Stream 4 — Governance & Treasury Control
As `onlyOwner` you control: reward rates, STC subscription amount, buyback percentage, emergency pool rebalancing, and the ability to burn excess supply from the treasury. These levers allow you to actively manage token economics in response to market conditions.

### Optimal Founder Action Plan

| Milestone | Action | Purpose |
|---|---|---|
| Pre-launch | Deploy VestingWallet for 300M platform STC | Signal commitment; prevent dump allegations |
| Launch day | Seed AMM: $10,000 USDC + 1,000,000 STC | Set price at $0.01; enable trading |
| Launch day | Set `stcSubscriptionAmount` to 500 STC | Protect treasury during low-price phase |
| 1,000 subscribers | First buyback execution | Demonstrate mechanism; signal health |
| AMM price > $0.02 | Reduce subscription to 300 STC | Reward early community; maintain utility |
| 10,000 subscribers | Launch creator staking tiers | Convert creators to token lockers |
| $50k/mo revenue | Propose increasing buyback to 15% | Accelerate price appreciation |
| AMM price > $0.05 | Reduce subscription to 200 STC (parity) | Feature reaches economic equilibrium |
| Ongoing | Stake 35,000 STC from platform pool (2yr lock) | Signal confidence; reduce circulating supply |

---

*Sephar Studios · STC Tokenomics Expert Report · March 2026*
*Compiled from: StudioToken.sol · SepharSubscription.sol · TokenAMM.sol*
*Confidential — Internal Use Only · Not a financial prospectus*
