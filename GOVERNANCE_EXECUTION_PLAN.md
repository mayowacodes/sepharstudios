# Governance & Token Sustainability Execution Plan

## Critical Fixes (Must Be Explicitly Completed Before Public Trading)

- [ ] **Separate pool addresses at deployment**
  - Use distinct addresses for `platformTreasury`, `creatorRewardsPool`, `userRewardsPool`, `governancePool`.
  - All pool addresses must be multisig/timelock-controlled, not one EOA.
  - Update and validate [deploy.ts](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/scripts/deploy.ts).

- [ ] **CreatorPayments permission alignment**
  - Replace fragile `onlyOwner` dependency between contracts with role-based access (`AccessControl`) or approved-caller mapping.
  - Ensure `CreatorPayments` can call payout path safely without requiring unsafe owner wiring.
  - Validate on [CreatorPayments.sol](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/contracts/CreatorPayments.sol) and [StudioToken.sol](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/contracts/StudioToken.sol).

- [ ] **Disable burn sinks for long-term circulation**
  - Remove/replace burn behavior in AMM buyback path.
  - Remove or hard-disable discretionary excess burn.
  - Validate on [TokenAMM.sol](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/contracts/TokenAMM.sol) and [StudioToken.sol](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/contracts/StudioToken.sol).

- [ ] **Enforce real-USDC-backed buyback accounting**
  - No virtual reserve increments without actual token movement.
  - Add reserve sync/invariant checks.
  - Validate on [TokenAMM.sol](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/contracts/TokenAMM.sol).

- [ ] **Add slippage protection to replenishment swaps**
  - Remove `minOut = 0` swap calls.
  - Add configurable minimum output and failure-safe behavior.
  - Validate on [StudioToken.sol](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/contracts/StudioToken.sol).

- [ ] **Reduce global transfer-freeze risk**
  - Remove or tightly scope token-wide pause behavior for public market safety.
  - If pause remains, restrict to emergency-only and timelock governance.
  - Validate on [StudioToken.sol](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/packages/contracts/contracts/StudioToken.sol).

## Policy Direction (Approved)

- [x] Use **Option 1**: fixed supply + recycle model.
- [x] No emergency mint authority in baseline.
- [x] Reward sustainability via buyback-to-rewards and strict emission caps.

## Rollout Timeline

### Week 1: Policy Freeze + Scope
- [ ] Finalize `TOKEN_POLICY.md` with fixed-supply rules and parameter bounds.
- [ ] Lock reward/referral/update ceilings.
- [ ] Define what is non-upgradable vs timelock-governed.

### Week 1-2: Contract Change Spec
- [ ] Write `CONTRACT_CHANGE_SPEC.md` covering all critical fixes.
- [ ] Include migration/deployment impact and backward compatibility notes.

### Week 2-3: Governance Foundation
- [ ] Deploy Safe multisig (`4/7` threshold).
- [ ] Deploy `TimelockController` (`72h` routine, `7d` monetary).
- [ ] Transfer control of core contracts to timelock.

### Week 3-4: Implementation + Tests
- [ ] Implement critical contract patches.
- [ ] Add tests for:
  - [ ] reserve accounting invariants
  - [ ] no-burn recycle path
  - [ ] payout permissions
  - [ ] pause behavior limits
  - [ ] slippage enforcement

### Week 4-5: Economic Validation
- [ ] Re-run scenarios in [token-lifespan-model.csv](c:/Users/Mayowa%20Animasaun/Documents/Projects/sepharstudios/token-lifespan-model.csv).
- [ ] Publish runway targets (`base-case > 10 years`, no hidden sinks).
- [ ] Issue `TOKENOMICS_RUNWAY_REPORT.md`.

### Week 5-6: Audit + Hardening
- [ ] Third-party audit.
- [ ] Remediate findings.
- [ ] Publish emergency response playbook.

### Week 6: Governance Operations
- [ ] Start monthly policy review proposals.
- [ ] Publish treasury/emissions transparency reports.
- [ ] Activate proposal templates and decision logs.

## Admin UI Implementation (Governance)

### Route Group
- [ ] Add governance route group under existing admin routes:
  - [ ] `/admin/governance` (overview dashboard)
  - [ ] `/admin/governance/proposals` (proposal list + details)
  - [ ] `/admin/governance/create` (proposal builder)
  - [ ] `/admin/governance/execution` (timelock queue + execution)
  - [ ] `/admin/governance/treasury` (pool balances, inflow/outflow, runway)
  - [ ] `/admin/governance/emergency` (pause controls + incident logging)
  - [ ] `/admin/governance/roles` (role matrix and permission audit log)
  - [ ] `/admin/governance/reports` (transparency report generation/export)

### Core Components
- [ ] Build reusable governance components:
  - [ ] `GovernanceStatusCard` (policy mode, mint status, timelock delays)
  - [ ] `ProposalBuilderForm` (change type, params, risk notes)
  - [ ] `GuardrailValidator` (client-side checks for cap/range violations)
  - [ ] `TimelockQueueTable` (queued actions, ETA, execution state)
  - [ ] `MultisigApprovalsPanel` (signers, threshold, approval progress)
  - [ ] `TreasuryPoolsTable` (treasury/user rewards/creator/governance pools)
  - [ ] `RunwayWidget` (links to lifespan assumptions and live estimate)
  - [ ] `EmergencyActionForm` (pause trigger with mandatory incident reason)
  - [ ] `RolePermissionsTable` (who can do what, last changed timestamp)
  - [ ] `GovernanceReportExport` (CSV/PDF export controls)

### API Endpoints (Admin Governance)
- [ ] Add/extend server routes for governance data:
  - [ ] `GET /api/admin/governance/status`
  - [ ] `GET /api/admin/governance/proposals`
  - [ ] `POST /api/admin/governance/proposals`
  - [ ] `GET /api/admin/governance/timelock-queue`
  - [ ] `POST /api/admin/governance/queue`
  - [ ] `POST /api/admin/governance/execute`
  - [ ] `GET /api/admin/governance/treasury`
  - [ ] `POST /api/admin/governance/emergency/pause`
  - [ ] `GET /api/admin/governance/roles`
  - [ ] `GET /api/admin/governance/reports`

### Access Control & Safety
- [ ] Enforce route/API guards so only authorized admin roles can access governance pages.
- [ ] Require confirmation + rationale text for all monetary-critical actions.
- [ ] Prevent direct execution paths outside timelock/multisig workflow in UI.
- [ ] Add immutable audit log entries for create/queue/execute/pause actions.

### UX Requirements
- [ ] Show clearly what admin can do vs cannot do on each governance page.
- [ ] Display approval flow state: `draft -> submitted -> queued -> executable -> executed`.
- [ ] Show all time delays with exact timestamps and countdown timers.
- [ ] Block proposal submission when guardrail checks fail.
- [ ] Surface risk warnings for parameter changes near hard limits.

### Delivery Sequence (UI)
- [ ] Sprint A: Dashboard + status + treasury monitor.
- [ ] Sprint B: Proposals list/details + proposal builder + guardrail validator.
- [ ] Sprint C: Timelock queue/execution + multisig approvals panel.
- [ ] Sprint D: Roles page + emergency panel + reporting center.

## Exit Criteria (Go/No-Go)

- [ ] No single wallet can alter monetary-critical behavior.
- [ ] No discretionary mint path exists.
- [ ] Buyback/recycle flow is fully funded and auditable on-chain.
- [ ] Reward runway remains above target in base and downside scenarios.
- [ ] All critical fixes above are checked complete.
