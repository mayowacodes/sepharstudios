# STC Lifespan Model (Spreadsheet)

Use `token-lifespan-model.csv` in Excel/Google Sheets.

## What this models
- **Annual Outflow (STC):** user watch rewards + referral rewards
- **Annual Inflow (STC):** revenue buyback converted to STC and recycled to rewards pool
- **Net Depletion:** outflow - inflow
- **Lifespan (years):** user rewards pool / net depletion

If net depletion <= 0, the model marks as **Sustainable**.

## Inputs mapped to your contracts
- `UserRewardsPool_STC` default: `1,000,000,000` from `USER_REWARDS_ALLOCATION`
- `AvgRewardPerUserPerDay_STC` should stay <= `5` (daily user cap)
- `ReferralReward_STC` default: `10`
- `MaxMonthlyReferrals` default: `5`
- `BuybackPct` default: `0.08` (8%)

## How to use
1. Open `token-lifespan-model.csv`.
2. Edit columns C-K only.
3. Columns L-Q auto-calculate annual outflow/inflow and lifespan.
4. Duplicate rows for additional scenarios.

## Interpreting results
- `20+ years`: robust under current assumptions
- `7-15 years`: workable but needs active replenishment discipline
- `<5 years`: high risk of reward pool exhaustion

## Notes
- This is a **planning model**, not a price oracle.
- Lifespan is highly sensitive to:
  - active users
  - average rewards per user per day
  - STC market price
  - how much buyback actually returns to rewards pool
- If you keep burning bought-back STC instead of recycling, lifespan shortens.
