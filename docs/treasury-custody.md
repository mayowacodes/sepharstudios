# Treasury Wallet Custody

> Custodial STC settlement uses a treasury wallet to push tokens to user wallets when they claim. This doc explains what's shipped, why it's testnet-only as-shipped, and the production path.

## What's shipped (Round 4)

- [`apps/web/src/lib/server/stc-transfer.ts`](../apps/web/src/lib/server/stc-transfer.ts) — server-side viem client. Reads `TREASURY_PRIVATE_KEY` from env, signs transfers against the STC token contract on Polygon Amoy (or mainnet) via `viem.privateKeyToAccount` + `walletClient.writeContract`.
- [`POST /api/users/me/stc-claim`](../apps/web/src/routes/api/users/me/stc-claim/+server.ts) — batches all `transactions` rows with `currency='STC'`, `type='earn'`, `status='pending'` for the caller, transfers the sum on-chain, then updates the rows to `status='completed'` with the `txHash`.
- An audit row of `type='transfer'` is inserted recording which earn rows were settled.

The public API of `stc-transfer.ts` (`transferStc(toAddress, amount)`) is intentionally minimal so swapping the signing backend (KMS, HSM, Fireblocks) only changes that one file.

## Why this is testnet-only as shipped

`TREASURY_PRIVATE_KEY` lives in env. That means:

- Anyone with deploy access can read the prod treasury key.
- Anyone with shell access to the running container can read it from `process.env`.
- A leaked env file = drained treasury. There is no transaction policy, no second factor, no per-call approval.

For a testnet treasury with a small balance this is fine — keep the env approach, rotate the key if exposed, top up small amounts. **Don't put real-money mainnet STC behind this** until one of the production paths below lands.

## Required env vars

```
TREASURY_PRIVATE_KEY=0x<64 hex chars>      # the signing key. Anything funded by it can be moved.
STC_NETWORK=amoy                           # 'amoy' (default) or 'polygon'
AMOY_RPC_URL=https://rpc-amoy.polygon.technology    # already in .env
POLYGON_RPC_URL=https://polygon-rpc.com              # when you flip to mainnet
PUBLIC_STC_TOKEN_AMOY=0x<token address>    # set after contract deploy
PUBLIC_STC_TOKEN_POLYGON=0x<token address> # set after mainnet deploy
STC_TOKEN_DECIMALS=18                       # default — only change for non-standard tokens
```

If `TREASURY_PRIVATE_KEY` or the matching token address is unset, `isTreasuryReady()` returns false and `/api/users/me/stc-claim` responds 503 with `reason: 'treasury_not_configured'` — safe failure mode for missing env.

## Production custody — the four real options

When you cross from testnet to "real STC is moving", swap the signing backend in `stc-transfer.ts` to one of these. The caller (`/api/users/me/stc-claim`) doesn't change.

### Option A — Cloud KMS (recommended for most teams)

- **AWS KMS** with `aws-kms-signer` (or sign-and-send via `@aws-sdk/client-kms`).
- **GCP KMS** with `gcp-kms-signer`.
- **Cloudflare Workers + Hardware Security Modules** if you're already on CF.

How it works: the private key never leaves the KMS HSM. Your server calls `KMS.sign(unsignedTx)` and KMS returns the signature. You set IAM policy: only the production app's role can call sign; logs are immutable.

Cost: $1/month per key + tiny per-signature fee.

Code change: replace `privateKeyToAccount(pk)` in `stc-transfer.ts` with a KMS-backed `Account` (viem accepts custom `Account` objects). Remove `TREASURY_PRIVATE_KEY` env.

### Option B — Fireblocks or similar managed custody

- Fireblocks, BitGo, Coinbase Custody. Treats wallets as policy-controlled objects: spending limits, whitelisted destinations, multi-approver flows.
- Best when you have a finance/compliance team that wants policy enforcement.

Cost: ~$1000+/month minimums.

Code change: swap signer with the provider's SDK call. Same caller-facing API.

### Option C — Hardware wallet with offline batch signing

- Treasury key on a Ledger or Trezor, never online.
- Server queues batched transfer jobs to a file/queue; a human (you) periodically signs them via the hardware device and the server picks up the signed txs from a "signed" folder.

Best for: low-volume, high-value cases where you can afford the latency. Bad UX for users — claims take hours/days.

### Option D — Gnosis Safe multisig with a bot signer

- Treasury is a Gnosis Safe (e.g., 2-of-3). One signer is your server's hot key, the other(s) are human-controlled.
- Limit per-tx amount + spending caps via Safe modules.
- If the server key leaks, attacker can't drain — needs another signer.

Cost: Safe transactions cost ~3x normal gas, but on Polygon that's still pennies.

Code change: replace direct ERC-20 transfer with a `proposeTransaction` call to the Safe SDK, then a worker that auto-confirms the bot's signature.

## Recommendation

- **Now / testnet:** keep the env-key approach. Document the rotation plan (below).
- **At first real-money flow:** Option A (AWS KMS) — cheapest production-grade path, biggest security gain per dollar.
- **At meaningful TVL (>$50k in the treasury):** Option D (Gnosis Safe + KMS-backed bot signer) — defense in depth.
- **At enterprise / regulated:** Option B (Fireblocks) for compliance reporting.

## Key rotation plan (even on testnet)

1. Generate a new key via `viem`'s `generatePrivateKey()` (or `cast wallet new`).
2. Send the existing treasury balance to the new address (one normal transfer).
3. Update `TREASURY_PRIVATE_KEY` in Dokploy env.
4. Restart the app — `getClients()` caches per-process so a restart picks up the new key.
5. Burn the old key.

Rotate at least quarterly while on env-key custody.

## How `/api/users/me/stc-claim` behaves under failure

The endpoint is written to be **safe on retry**:

- If the on-chain transfer reverts or RPC times out, the pending rows stay `pending`. The user can retry without double-claiming.
- The `txHash` is only written after `waitForTransactionReceipt` confirms success.
- Rate limit: 5 claims / 5 minutes per user (shared with the AI agent limit), so a script can't hammer the endpoint.

If the on-chain transfer succeeds but the DB UPDATE fails (e.g., DB outage between mine and update), the user gets the tokens but the rows stay pending. This is a soft duplicate — `stc-claim` will try to send them again next time. **Mitigation:** monitor for users with on-chain balance and pending rows; add a manual reconciliation tool when this becomes a real problem.

## Verification on Amoy

1. Deploy STC token contract to Amoy, set `PUBLIC_STC_TOKEN_AMOY` env.
2. Generate a fresh wallet, fund it with testnet STC + MATIC (for gas).
3. Set `TREASURY_PRIVATE_KEY` in dev env.
4. Watch a video to completion as a test user → `transactions` row appears as `pending`.
5. Link a separate test wallet to the user (set `user.walletAddress`).
6. `POST /api/users/me/stc-claim` → expect `{ success: true, amount, txHash }`.
7. Check on a Polygonscan Amoy explorer: tx hash should show the transfer + token movement.
8. Confirm DB: `pending` rows are now `completed` with the same `txHash`.
