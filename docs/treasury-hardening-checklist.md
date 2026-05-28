# Treasury Hardening — Operator Checklist

> Companion to [`docs/treasury-custody.md`](./treasury-custody.md) (technical reference). This doc is the **action list** for the human who has to execute the hardening. Print it, work through it, tick off each box.

## What this is, in plain English

Round 4 shipped custodial STC settlement. The treasury wallet that signs transfers currently uses `TREASURY_PRIVATE_KEY` from environment variables. That's testnet-acceptable but not production-safe because:

1. Anyone with Dokploy access can read the key (plaintext in the env panel).
2. Anyone with shell access to the running container can dump it via `process.env`.
3. A leaked `.env` file = drained treasury. No recovery, no policy override, no second factor.

"Hardening" means swapping that env-var key for a key-management system where:

- The private key never exists as plaintext anywhere.
- Signing becomes a *call to an external system that holds the key*.
- Compromise of one credential (server, env file, GitHub) doesn't drain the treasury.

The code change is small (~50 lines in one file). The work is **operational**: provisioning the KMS, setting IAM policies, rotating funds.

## When you should do this — the trigger conditions

Right now, **don't**. The testnet env-key approach works fine while STC is play money on Amoy and the treasury holds a small amount you can afford to lose.

Harden the treasury **before** you do any of these:

- [ ] Deploy the STC token contract to Polygon **mainnet**.
- [ ] Fund the treasury wallet with anything you'd be unhappy losing.
- [ ] Open the claim flow to real users on mainnet.
- [ ] Accept revenue or investment denominated in STC.

If you're about to tick any of those, **stop and do the hardening first.**

## The four production paths (pick one)

| Approach | Cost | Operational complexity | Recommended when |
|---|---|---|---|
| **AWS KMS** (recommended default) | ~$1/month + ~$0.03 per 10k signatures | Low | First production deploy. Cheapest path to "real" security. |
| **GCP KMS** | Similar to AWS | Low | Already on GCP. |
| **Fireblocks / BitGo** | ~$1000+/month minimum | Medium | Have a finance/compliance team that wants policy reporting + multi-approver flows. |
| **Gnosis Safe + KMS bot signer** | Safe gas costs (~3x normal) | High | Treasury > $50k. Defence in depth — stolen server key still can't drain alone. |
| **Hardware wallet (offline)** | Hardware cost only | Highest (humans in the loop) | Low-volume, very high value. Claims take hours/days. |

**Default recommendation: AWS KMS.** The checklist below assumes that path. The other paths follow the same flow with provider-specific changes — see [`treasury-custody.md`](./treasury-custody.md) for the others.

---

## The checklist — AWS KMS path

### Phase 1 — Prep (no code or money yet)

- [ ] Create an AWS account if you don't have one, or pick the account that owns the production infrastructure.
- [ ] Enable AWS CloudTrail in the chosen region. Every KMS signing operation will be logged here — that's your audit trail.
- [ ] Decide a region. Use one geographically close to where the Dokploy VPS lives (Frankfurt / Amsterdam if EU, Virginia if US). Lower latency = faster claim API.
- [ ] Set up an AWS IAM user (NOT root) with admin perms for the initial setup. Use this for the steps below.

### Phase 2 — Provision the KMS key

- [ ] In AWS Console → KMS → **Customer managed keys** → **Create key**.
- [ ] **Key type:** Asymmetric.
- [ ] **Key usage:** Sign and verify.
- [ ] **Key spec:** `ECC_SECG_P256K1` (this is secp256k1 — the curve Ethereum uses).
- [ ] **Key alias:** `sephar-treasury-prod` (so you can refer to it without memorising the UUID).
- [ ] **Key administrators:** add your IAM user.
- [ ] **Key users:** create a new IAM role called `sephar-treasury-signer` and grant it only `kms:Sign` and `kms:GetPublicKey` on this key. Nothing else — not `Decrypt`, not `Encrypt`, not `DescribeKey`.
- [ ] Save the **Key ID** (UUID) and the **Key ARN** somewhere safe (1Password / Bitwarden).

### Phase 3 — Derive the Ethereum address

Unlike a private key, you can't "see" your wallet address directly in KMS. You derive it from the public key.

- [ ] Run a small Node/Bun script (write it once, throw away):

  ```ts
  // scripts/derive-kms-address.ts
  import { KMSClient, GetPublicKeyCommand } from '@aws-sdk/client-kms';
  import { publicKeyToAddress } from 'viem/accounts';

  const client = new KMSClient({ region: 'eu-central-1' });
  const out = await client.send(new GetPublicKeyCommand({ KeyId: 'alias/sephar-treasury-prod' }));
  // out.PublicKey is DER-encoded; strip the prefix to get the 64-byte uncompressed key
  const pub = ('0x04' + Buffer.from(out.PublicKey!).slice(-64).toString('hex')) as `0x${string}`;
  console.log('Treasury address:', publicKeyToAddress(pub));
  ```

- [ ] **Run it once**, copy the address it prints, save it as `TREASURY_ADDRESS`. You'll never have to derive it again.

### Phase 4 — Fund the new wallet (testnet first)

Always test on Amoy before mainnet.

- [ ] Send a small amount of testnet STC + a few MATIC (for gas) to the derived `TREASURY_ADDRESS`.
- [ ] Verify on Amoy Polygonscan that the balance appears.

### Phase 5 — Swap the signer in code

This is the actual code change. About 50 lines in one file.

- [ ] Install the KMS SDK:

  ```powershell
  cd apps/web
  bun add @aws-sdk/client-kms
  bun add -d @types/aws-lambda  # if missing
  ```

- [ ] Edit [`apps/web/src/lib/server/stc-transfer.ts`](../apps/web/src/lib/server/stc-transfer.ts):
  - Replace `privateKeyToAccount(pk as Hex)` with a `kmsAccount(keyId)` helper.
  - The helper implements viem's `Account` interface using KMS sign calls. Reference implementation: `viem` + `@aws-sdk/client-kms` — there are Gists by Wagmi maintainers that show the exact pattern.
  - Read `AWS_KMS_KEY_ID` from env instead of `TREASURY_PRIVATE_KEY`.
- [ ] Delete `TREASURY_PRIVATE_KEY` from `apps/web/src/lib/server/stc-transfer.ts` env reads.
- [ ] Run `bun x svelte-check --no-tsconfig` — should still pass `0 errors`.

### Phase 6 — Set up Dokploy IAM credentials

The production container needs AWS credentials to call KMS. Two options:

**Option A (recommended):** Use AWS access keys scoped to the `sephar-treasury-signer` role.

- [ ] In IAM → Users → Create a new user `sephar-app-prod` with **programmatic access only** (no console password).
- [ ] Attach the `sephar-treasury-signer` role to it.
- [ ] Generate access keys. Copy `Access key ID` + `Secret access key`.
- [ ] In Dokploy env vars for the `sepharstudios` service, set:

  ```
  AWS_ACCESS_KEY_ID=<from above>
  AWS_SECRET_ACCESS_KEY=<from above>
  AWS_REGION=<your KMS region>
  AWS_KMS_KEY_ID=alias/sephar-treasury-prod
  ```

- [ ] **Remove** `TREASURY_PRIVATE_KEY` from Dokploy env vars.

**Option B (better when feasible):** Use IAM Roles for Service Accounts (IRSA) if you ever move to EKS. Not applicable to Dokploy today.

### Phase 7 — Deploy + smoke test on Amoy

- [ ] Build + push the docker image: `docker build -t manimasaun/sepharstudios:latest . && docker push …`
- [ ] Redeploy on Dokploy.
- [ ] Hit `/api/health` — should return 200.
- [ ] As a test user with a linked wallet and pending STC earnings, call `POST /api/users/me/stc-claim`.
- [ ] Verify on Amoy Polygonscan that the transfer happened from the new `TREASURY_ADDRESS`.
- [ ] Verify in CloudTrail that the `kms:Sign` operation was logged with the timestamp and caller.
- [ ] Check `transactions` table: pending rows for that user are now `completed` with the correct `txHash`.

### Phase 8 — Migrate the testnet treasury balance

- [ ] Send the remaining balance from the old env-key wallet to the new KMS-backed `TREASURY_ADDRESS`.
- [ ] Confirm the old wallet is empty.
- [ ] Securely delete the old `TREASURY_PRIVATE_KEY` from anywhere it was stored (1Password, env files, terminal history).

### Phase 9 — Document the runbook for incidents

- [ ] Update `docs/treasury-custody.md` with the new approach.
- [ ] Document the response plan for these scenarios:
  - **AWS credentials leak:** rotate via IAM, redeploy.
  - **KMS region outage:** KMS supports multi-region keys — set one up.
  - **Treasury balance critically low:** alert + manual refill SOP.

### Phase 10 — Mainnet preparation (only when ready for real money)

Do steps 2-8 again, but:

- [ ] Provision a **separate** KMS key for mainnet (`sephar-treasury-mainnet`). Never share keys across networks.
- [ ] Set `STC_NETWORK=polygon` and `PUBLIC_STC_TOKEN_POLYGON=0x…` in Dokploy env.
- [ ] Fund the new mainnet treasury address with real STC + MATIC.
- [ ] Run the claim flow against mainnet with a small test claim from your own account.
- [ ] Only THEN open the claim endpoint to real users.

---

## Code reference — what changes in `stc-transfer.ts`

The change is localised. The public API and every caller stay the same. Pseudo-diff:

```ts
// Before (testnet env-key path):
const pk = env.TREASURY_PRIVATE_KEY;
if (!pk?.startsWith('0x')) return null;
const account = privateKeyToAccount(pk as Hex);

// After (KMS path):
const keyId = env.AWS_KMS_KEY_ID;
if (!keyId) return null;
const account = await createKmsAccount({ keyId, region: env.AWS_REGION });
```

Everything else — the `transferStc()` function, the balance check, the receipt wait, the `TreasuryBalanceLowError` — stays as is. That's the value of structuring the file the way it was: hardening is a localised swap, not a rewrite.

---

## Quick-reference: what the operator actually does

If you skim this whole doc and just want the punch list:

1. **Pick AWS region** + create an IAM user.
2. **Create a KMS key**: asymmetric, secp256k1, Sign + Verify usage.
3. **Lock down permissions**: only `kms:Sign` + `kms:GetPublicKey` for the app.
4. **Derive the Ethereum address** from the KMS public key (one-off script).
5. **Fund on Amoy**, test the existing claim flow against the new wallet.
6. **Swap the signer** in `stc-transfer.ts` (~50 lines).
7. **Set AWS_KMS_KEY_ID + AWS_REGION** in Dokploy; remove TREASURY_PRIVATE_KEY.
8. **Deploy + smoke test** on Amoy.
9. **Migrate testnet balance**, delete old key.
10. **Repeat for mainnet** when ready.

Total operator time: half a day if you've used AWS IAM before, a full day if you haven't.

---

## Don't do these things

- ❌ Use the SAME KMS key for Amoy and mainnet.
- ❌ Grant `kms:Decrypt` to the app role. (It only needs to sign.)
- ❌ Store AWS credentials in the repo. They go in Dokploy env, never in `.env` files committed to git.
- ❌ Skip CloudTrail. The audit log is what makes KMS auditable; turning it off defeats the point.
- ❌ Fund the mainnet treasury before completing Phase 7 (Amoy smoke test) end to end.
- ❌ Reuse the testnet treasury wallet on mainnet. Fresh keys per network.

---

## When you've finished

Update [`docs/NEXT_ROUND.md`](./NEXT_ROUND.md) to remove the "Treasury custody — production hardening" line. The work is done. From this point on, KMS handles signing transparently and the operational story is "IAM + CloudTrail" instead of "env vars".
