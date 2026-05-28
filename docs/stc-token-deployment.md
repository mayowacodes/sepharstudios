# STC Token Deployment — Amoy Testnet

> Companion to [`docs/treasury-custody.md`](./treasury-custody.md) (custody design) and [`docs/treasury-hardening-checklist.md`](./treasury-hardening-checklist.md) (production hardening). This doc is the **action list** for getting the STC token + supporting contracts live on Polygon Amoy testnet so the claim flow works end-to-end.

## What gets deployed

The Hardhat deploy script in [`packages/contracts/scripts/deploy.ts`](../packages/contracts/scripts/deploy.ts) ships the **full stack**, not just the STC token:

| # | Contract            | Purpose                                                                       |
|---|---------------------|-------------------------------------------------------------------------------|
| 1 | `MockUSDC`          | Stand-in for USDC on testnet (real USDC contract is used on mainnet).         |
| 2 | `StudioToken`       | The STC ERC-20. Mints 2B supply across treasury / creator / user / gov pools. |
| 3 | `FounderVesting`    | Locks 300M platform-dev tokens with 6-month cliff + 48-month linear vesting.  |
| 4 | `TokenAMM`          | STC/USDC pool with buyback + LP fees.                                         |
| 5 | `SepharSubscription`| Subscription NFT bound to STC discounts.                                      |
| 6 | `CreatorPayments`   | Per-creator payout router.                                                    |

All five non-mock contracts are needed for the staking, swap, and subscription pages to work — not just for the claim flow. Cost: ~0.3 MATIC total on Amoy.

---

## Prerequisites

- [ ] Bun installed and `bun install` run in the repo root.
- [ ] A **deployer EOA** (externally-owned account) — any wallet, e.g. MetaMask. Export its private key.
- [ ] Funded with ~0.5 testnet MATIC. Faucets:
  - [faucet.polygon.technology](https://faucet.polygon.technology) (official)
  - [stakely.io/faucet/polygon-amoy](https://stakely.io/faucet/polygon-amoy)
- [ ] *(Optional, for source verification)* Polygonscan API key from [polygonscan.com/myapikey](https://polygonscan.com/myapikey).

---

## Step 1 — Configure deploy env

Create [`packages/contracts/.env`](../packages/contracts/.env) (gitignored):

```bash
AMOY_RPC_URL=https://rpc-amoy.polygon.technology
PRIVATE_KEY=0x<deployer EOA private key>
POLYGONSCAN_API_KEY=<optional — only for verify:amoy>
```

> **Security note**: this private key holds the freshly-minted 2B STC supply. Treat it like cash for the duration of deployment. After deploy, the script transfers 300M to FounderVesting and leaves the rest in the deployer EOA's named pools. You can keep this EOA as treasury for testnet, or rotate to a fresh wallet for production.

---

## Step 2 — Compile

From project root:

```powershell
cd packages/contracts
bun install                  # only first time
bun run compile              # writes ABIs to artifacts/
```

Expected: `Compiled X Solidity files successfully` with no errors.

---

## Step 3 — Deploy to Amoy

```powershell
# still in packages/contracts/
bun run deploy:amoy
```

The script prints each step:

```
🚀 Starting Sephar Studios tokenomics deployment...
Deploying contracts with account: 0x...
🌐 Deploying on network: amoy (chainId: 80002)
📝 Deploying mock USDC token...
✅ Mock USDC deployed to: 0x...
📝 Deploying Studio Token...
✅ Studio Token deployed to: 0x...
📝 Deploying FounderVesting...
✅ FounderVesting deployed to: 0x...
✅ 300M STC transferred to FounderVesting (cliff: 6 months, duration: 48 months)
📝 Deploying Token AMM...
✅ Token AMM deployed to: 0x...
📝 Deploying Sephar Studios Subscription...
✅ Subscription deployed to: 0x...
📝 Deploying Creator Payments...
✅ Creator Payments deployed to: 0x...
⚙️ Configuring contracts...
✅ TokenAMM address set in StudioToken
💾 Deployment data saved to deployments/amoy-80002.json
🎉 Deployment completed successfully!
```

Addresses are written to [`packages/contracts/deployments/amoy-80002.json`](../packages/contracts/deployments/amoy-80002.json). **Save this file** — you'll paste from it into env vars next.

---

## Step 4 — (Optional) Verify source on Polygonscan

Source verification makes the contracts readable on [amoy.polygonscan.com](https://amoy.polygonscan.com) and unlocks the "Read/Write contract" tabs there.

```powershell
# from packages/contracts/
bunx hardhat verify --network amoy <STC_ADDRESS> <treasury> <creatorPool> <userPool> <govPool> <USDC_ADDRESS>
bunx hardhat verify --network amoy <TOKEN_AMM_ADDRESS> <STC_ADDRESS> <USDC_ADDRESS> <treasury>
bunx hardhat verify --network amoy <SUBSCRIPTION_ADDRESS> <STC_ADDRESS> <USDC_ADDRESS> <treasury> <creatorPool> <userPool> <TOKEN_AMM_ADDRESS>
bunx hardhat verify --network amoy <CREATOR_PAYMENTS_ADDRESS> <STC_ADDRESS> <USDC_ADDRESS> <treasury> <usdcTreasury> <TOKEN_AMM_ADDRESS>
```

(For testnet, treasury / creatorPool / userPool / govPool / usdcTreasury are all the deployer address — see [deploy.ts:73-77](../packages/contracts/scripts/deploy.ts#L73-L77).)

---

## Step 5 — Wire contract addresses into the app

Open [`DOKPLOY_ENV.txt`](../DOKPLOY_ENV.txt) and [`apps/web/.env`](../apps/web/.env) and paste from `deployments/amoy-80002.json`:

```bash
PUBLIC_STC_TOKEN_AMOY=0x<studioToken>
PUBLIC_TOKEN_AMM_AMOY=0x<tokenAMM>
PUBLIC_SUBSCRIPTION_AMOY=0x<sepharSubscription>
PUBLIC_CREATOR_PAYMENTS_AMOY=0x<creatorPayments>
PUBLIC_USDC_AMOY=0x<usdcToken>
STC_NETWORK=amoy
```

---

## Step 6 — Generate the treasury wallet

The treasury is a **separate wallet** from the deployer EOA. The deployer holds all the minted pools; the treasury holds a small float used to pay claims.

### Option A — using Foundry's `cast` (recommended)

```powershell
cast wallet new
```

Outputs:
```
Successfully created new keypair.
Address:     0x...
Private key: 0x...
```

### Option B — using viem in a quick script

```powershell
bun -e "import('viem/accounts').then(m => { const pk = m.generatePrivateKey(); console.log('PrivateKey:', pk); console.log('Address:', m.privateKeyToAccount(pk).address); })"
```

**Save both fields** — the address (public, you'll fund it) and the private key (secret, goes in env).

---

## Step 7 — Fund the treasury

The treasury needs two things:
1. **MATIC for gas** — ~0.5 testnet MATIC. Send from the deployer wallet, or hit a faucet directly with the treasury address.
2. **STC float** — transfer some out of `userRewardsPool` (which is the deployer EOA on testnet).

For #2, open the Hardhat console:

```powershell
# from packages/contracts/
bunx hardhat console --network amoy
```

Then in the REPL:

```javascript
const stc = await viem.getContractAt("StudioToken", "<STC_ADDRESS_FROM_STEP_3>")
// transfer 10,000 STC (10000 * 10^18 wei) to the treasury
await stc.write.transfer(["<TREASURY_ADDRESS_FROM_STEP_6>", 10_000_000_000_000_000_000_000n])
// confirm
await stc.read.balanceOf(["<TREASURY_ADDRESS>"])
```

10,000 STC is plenty for testnet. The `userRewardsPool` holds 1B STC from constructor mint, so you have headroom.

> **Why a separate treasury?** The deployer EOA could lose funds to a leaked deploy machine. By moving a small float to a freshly-generated treasury whose key only lives in app env, you compartmentalise blast radius. Production hardening (KMS/HSM) replaces this env-key with a non-extractable signing backend — see [`treasury-hardening-checklist.md`](./treasury-hardening-checklist.md).

---

## Step 8 — Set treasury env vars + restart

Add to [`DOKPLOY_ENV.txt`](../DOKPLOY_ENV.txt) and [`apps/web/.env`](../apps/web/.env):

```bash
TREASURY_PRIVATE_KEY=0x<from step 6>
```

In Dokploy: paste into the env panel, save, click **Redeploy**.

---

## Step 9 — Verify the claim flow

1. Open the app, sign in as a user who has earned STC (visible at `GET /api/users/me/stc-balance`).
2. From the user dashboard or wallet page, trigger the claim flow.
3. Watch the network tab — `POST /api/users/me/stc-claim` should return 200 with a `txHash`.
4. Paste the txHash into [amoy.polygonscan.com](https://amoy.polygonscan.com) — confirm a Transfer event from treasury → user wallet.
5. In the DB:
   ```sql
   SELECT id, status, currency, amount, tx_hash, updated_at
   FROM transactions
   WHERE user_id = '<user_id>' AND currency = 'STC'
   ORDER BY updated_at DESC LIMIT 5;
   ```
   The previously `pending` rows should now show `status='completed'` with `tx_hash` populated, and a fresh `type='transfer'` audit row referencing them.

If the claim returns **503 `treasury_not_configured`**: `isTreasuryReady()` is false. Re-check that both `TREASURY_PRIVATE_KEY` and `PUBLIC_STC_TOKEN_AMOY` are set in the running container's env.

If the claim returns **500 with a viem error**: usually means the treasury wallet has insufficient MATIC for gas, or insufficient STC for the transfer amount. Top up.

---

## Failure & rollback

The deploy script is **not idempotent** — re-running it deploys fresh contracts at new addresses. If a deploy fails partway:

- The script writes `deployments/amoy-80002.json` only on success, so a failed run leaves the file from the last good deploy untouched.
- Any contracts that succeeded before the failure are still on-chain (you can see them on Polygonscan), but unwired. To recover, re-run the script — you'll get a clean fresh set. The orphaned contracts on-chain are harmless (no one holds the keys to interact with them as owner, but they're not connected to the app either).
- On Amoy, the cost of a failed re-deploy is negligible.

For mainnet, run a full Amoy dry-run end-to-end first, then deploy mainnet once the script has succeeded clean ≥3 times in a row.

---

## Going to mainnet later

When testnet has been stable for a release cycle:

1. Repeat steps 1–4 with `polygon` (chainId 137) instead of `amoy`. Use `POLYGON_RPC_URL` + `bun run deploy:polygon`.
2. Real USDC is hardcoded in [deploy.ts:60-61](../packages/contracts/scripts/deploy.ts#L60-L61), so the MockUSDC step is skipped automatically.
3. Set `STC_NETWORK=polygon` and `PUBLIC_STC_TOKEN_POLYGON=...` in env.
4. **Do not** reuse the testnet treasury key on mainnet. Generate a fresh one — and per [`treasury-hardening-checklist.md`](./treasury-hardening-checklist.md), strongly consider KMS-backed signing before this wallet holds real-money STC.

---

## Checklist

- [ ] Deployer EOA created + funded with testnet MATIC.
- [ ] `packages/contracts/.env` populated.
- [ ] `bun run compile` succeeds.
- [ ] `bun run deploy:amoy` succeeds; `deployments/amoy-80002.json` exists.
- [ ] *(Optional)* All 4 verify commands succeed; Polygonscan shows source.
- [ ] App env vars set: `PUBLIC_STC_TOKEN_AMOY`, `PUBLIC_TOKEN_AMM_AMOY`, `PUBLIC_SUBSCRIPTION_AMOY`, `PUBLIC_CREATOR_PAYMENTS_AMOY`, `PUBLIC_USDC_AMOY`, `STC_NETWORK=amoy`.
- [ ] Treasury wallet generated; private key + address saved out-of-band.
- [ ] Treasury funded: ~0.5 MATIC + 10,000 STC.
- [ ] `TREASURY_PRIVATE_KEY` set in Dokploy env.
- [ ] App redeployed.
- [ ] End-to-end claim test passes; txHash visible on Polygonscan; DB rows flipped to `completed`.
