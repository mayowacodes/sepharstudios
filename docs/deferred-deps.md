# Deferred Dependency Majors

> **Status: cleared.** Every workspace is fully up to date. This doc remains as a historical reference for the migrations performed.

## Current state

`bun outdated` across the monorepo:

| Workspace | Outdated |
|---|---|
| `apps/web` | none |
| `packages/web3` | none |
| `packages/contracts` | none |

Zero outdated dependencies anywhere. Last verified 2026-05-28.

---

## What landed (history)

Rounds 7 + 8 + the follow-up rounds bumped or removed every outdated dependency. Notable highlights:

### `apps/web`
- `svelte` 5.46 → 5.55 (Round 1) — closed 7 SSR XSS advisories
- `@sveltejs/kit` 2.49 → 2.61 (Round 1) — closed redirect-DoS + devalue chain
- `@sveltejs/adapter-node` 5.4 → 5.5 (Round 1) — closed BODY_SIZE_LIMIT bypass
- `drizzle-orm` 0.44 → 0.45 (Round 1) — closed SQL injection CVE
- `vite` 7 → 8 (Round 3)
- `typescript` 5 → 6 (Round 3)
- `@sveltejs/vite-plugin-svelte` 6 → 7 (Round 3)
- `@tanstack/svelte-query` 5 → 6 (Round 3) — ported users page off the v5 store interface
- `@lucide/svelte` 0 → 1 (Round 2)
- `@wagmi/core` 2 → 3 + `@wagmi/connectors` 5 → 8 (Round 2)
- `runed` 0.23 → 0.37 (follow-up) — `Debounced` API stable
- `rollup-plugin-visualizer` 6 → 7 (follow-up)
- `@types/node` 24 → 25 (final) — paired with the Solidity work

### `packages/web3`
- All deps aligned with `apps/web`. `@types/node` 24 → 25, `typescript` 5 → 6, `@wagmi/*` majors.

### `packages/contracts`
- `solhint` 4 → 6 — required a new `.solhint.json` config
- `typescript` 5 → 6 — fixed 2 type errors (hardhat-verify `customChains` → top-level `chainDescriptors`, viem branded-address cast)
- `hardhat` 3.0 → 3.6
- `ethers` 6.15 → 6.16
- `@types/node` 22 → 25
- `@chainlink/contracts` — **removed entirely** (dead dependency, zero usage in contracts)
- `@openzeppelin/contracts` **4.9 → 5.6** — see migration notes below

## OpenZeppelin v4 → v5 migration notes

Performed in the final round. All 6 contracts ([StudioToken](../packages/contracts/contracts/StudioToken.sol), [TokenAMM](../packages/contracts/contracts/TokenAMM.sol), [FounderVesting](../packages/contracts/contracts/FounderVesting.sol), [SepharSubscription](../packages/contracts/contracts/SepharSubscription.sol), [CreatorPayments](../packages/contracts/contracts/CreatorPayments.sol), [MockUSDC](../packages/contracts/contracts/MockUSDC.sol)) updated:

### Import path changes (security → utils)
```diff
- import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
- import "@openzeppelin/contracts/security/Pausable.sol";
+ import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
+ import "@openzeppelin/contracts/utils/Pausable.sol";
```

### Ownable constructor (now requires initial owner)
```diff
- constructor(...) ERC20("Studio Token", "STC") {
+ constructor(...) ERC20("Studio Token", "STC") Ownable(msg.sender) {
```

Applied to all 7 constructors (StudioToken, SepharSubscription, TokenAMM, LPToken, CreatorPayments, FounderVesting, MockUSDC).

### `_beforeTokenTransfer` → `_update`

**StudioToken (ERC20):**
```diff
- function _beforeTokenTransfer(address from, address to, uint256 amount)
-     internal override whenNotPaused
- {
-     super._beforeTokenTransfer(from, to, amount);
- }
+ function _update(address from, address to, uint256 value)
+     internal override whenNotPaused
+ {
+     super._update(from, to, value);
+ }
```

**SepharSubscription (ERC721)** — bigger change because the v5 signature returns the previous owner:
```diff
- function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
-     internal override whenNotPaused
- {
-     super._beforeTokenTransfer(from, to, tokenId, batchSize);
-     if (from != address(0) && to != address(0)) {
-         ...
-     }
- }
- function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
-     super._burn(tokenId);
- }
+ function _update(address to, uint256 tokenId, address auth)
+     internal override(ERC721) whenNotPaused returns (address)
+ {
+     address from = super._update(to, tokenId, auth);
+     if (from != address(0) && to != address(0)) {
+         ...
+     }
+     return from;
+ }
```

Note: `_burn` override was dropped — v5 burning goes through `_update(address(0), tokenId, address(0))` automatically.

### `_exists` removed
```diff
- require(_exists(tokenId), "Not found");
+ require(_ownerOf(tokenId) != address(0), "Not found");
```

Applied to 2 sites in SepharSubscription.

## Verification

`hardhat compile`: **6 Solidity files compiled clean** under OZ v5.6 ✓
`svelte-check`: **0 errors / 0 warnings** maintained across all rounds ✓

## Pre-mainnet checklist (separate concern)

The OZ v5 migration was internal — it does not substitute for an external smart-contract audit. Before funding the mainnet treasury, see [audit-roadmap.md § 1](./audit-roadmap.md#1-smart-contract-security-audit--mainnet-blocker). The contracts now compile under v5 so an audit firm can review the final intended code shape, not an interim one.
