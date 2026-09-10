# Sephar Studios — Subscription Tiers Explained
### Plain English Guide · No Crypto Knowledge Required

---

## The Big Idea First

When you subscribe to Sephar Studios, you do not just get an account entry in a database like Netflix does it. You receive an actual **NFT** — a digital certificate of ownership — sent directly to your crypto wallet. It proves you are a subscriber, and it lives on the Polygon blockchain forever.

Think of it like the difference between:
- **Traditional streaming** → A cinema ticket printed on paper. Works today, gone tomorrow, and the cinema can cancel it any time without telling you.
- **Sephar Studios** → A metal membership card with your name engraved on it, stored in your own safe. Nobody can take it away. It has an expiry date everyone can see. It is truly yours.

Both get you access — but one you actually **own**.

---

## The Three Tiers

> **Prices last verified against the code on 2026-09-10.** The authoritative
> values live in `PLAN_PRICES_CENTS` and `PLAN_FEATURES` in
> [apps/web/src/lib/payment/paystack.ts](apps/web/src/lib/payment/paystack.ts).
> If this file and that file disagree, the code is right and this file is stale.

---

### ⚪ Basic — Free, forever

The entry tier. No card, no trial clock, no expiry.

- HD streaming, **with ads**
- **2 profiles**
- **Kids & Teens access included** — and always ad-free
- Full standard library

Basic absorbed the old "Freemium" tier. The platform monetises through
advertising and pay-per-view on Sephar-sponsored titles rather than an entry
subscription: a paywall at the front door is the single biggest brake on
acquisition.

**Ads never run on Kids or Teens content**, on any tier. That is a category
rule, not a plan rule — a Basic viewer watching a kids title sees no
advertising even though their plan is ad-supported. Non-skippable advertising
to children carries regulatory exposure (COPPA in the US, the UK CAP code) that
the available inventory does not justify.

---

### 🔵 Premium (Family) — $1 / month

Everything in Basic, plus:

- **No ads**
- **8 profiles**
- Kids mode with parental controls

Replaces the old Basic + $5 family add-on, which is deprecated.

---

### 🟡 Creator — $2 / month

For people publishing to the platform. Everything in Premium, plus creator
tooling, analytics and payouts.

- **No ads**
- **8 profiles**

Creator revenue share is a **separate axis** from the subscription tier, read
from the CreatorPayments contract on Polygon:

| Creator tier | Share |
|---|---|
| Standard | 30% |
| Exclusive | 40% |
| Top Performer | 55% |

---

## At a glance

| | Basic | Premium | Creator |
|---|---|---|---|
| Price | **Free** | $1/mo | $2/mo |
| Ads | Yes | No | No |
| Profiles | 2 | 8 | 8 |
| Kids access | Yes | Yes | Yes |
| Ads on kids/teens | **Never** | — | — |

---

## Pay-per-view

Separate from subscriptions. Sephar-sponsored titles can carry an individual
price, set per region. A PPV purchase is **permanent** — there is currently no
rental window or expiry — and PPV titles have their playback URLs stripped
server-side until purchased.

---

## A note on legacy plan names

Subscription rows written before 2026-09-10 may store `plan = 'freemium'`. That
name is retained in code as a deprecated alias for `basic` so those rows keep
resolving correctly; `canonicalPlan()` in `paystack.ts` maps it. It is not
selectable for new or changed subscriptions.

---

## A note on the NFT

The subscription NFT described below applies to the **paid** tiers. Basic is an
ordinary account record; there is no on-chain certificate for a plan that costs
nothing to hold.

---

## What Makes the NFT Part Special

When your subscription is an NFT, three things work differently from every other streaming service:

**1. You can prove you are a subscriber without logging in**
Any app or partner platform can check the blockchain and verify your subscription is active — no username, no password. Just your wallet address.

**2. It cannot be silently cancelled without your knowledge**
The NFT has an on-chain expiry date that is publicly visible. No hidden cancellations. If your subscription expires, the NFT reflects that — honestly and transparently.

**3. It is transferable (where policy allows)**
The NFT could be gifted or moved to a family member's wallet — the way a physical gift card works. Your subscription record is yours, not just a number in someone else's database.

---

## How to Think About Each Tier

> **Free** — I want to see what's here before I commit anything, and I want my kids to be able to watch safely.
>
> **Basic** — I watch regularly and I would rather pay a little than sit through ads.
>
> **Premium** — We're a household. I want profiles for everyone and kids mode with real controls.
>
> **Creator** — I make content and I want to reach an audience while earning real money from it.

---

## The Smart Upgrade Path

Most users follow this journey naturally:

```
Start Free ($0)
  → Watch with ads, kids watch ad-free
  → Earn STC while watching
  → Ads start to grate → upgrade to Basic ($4) for ad-free
  → Stake 1,000 STC for 3 months → 10% off
  → Household grows → Premium ($10) for 8 profiles + kids mode
  → OR start publishing → Creator, and earn 30–55% of your revenue
```

The platform is designed so that simply using it — just watching — naturally
builds toward long-term savings. No extra steps required.

---

*Sephar Studios · Subscription Tiers Guide · Updated 2026-09-10*
*For full tokenomics details, see TOKENOMICS_REPORT.md and TOKENOMICS_SIMPLE.md*
