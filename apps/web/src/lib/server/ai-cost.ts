import { db } from '$lib/db/drizzle';
import { aiCostLedger, aiBudgetPeriods } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';

/**
 * AI cost governor — estimate → reserve → execute → record actual → reconcile.
 *
 * Why a reservation and not just a receipt: recording the actual cost after a
 * call tells you what you spent, not what you are about to spend, so it can
 * never refuse anything. The ceiling only means something if the spend is
 * claimed *before* the provider is contacted.
 *
 * All money is micro-dollars (1e-6 USD) as integers. Per-call costs are
 * fractions of a cent; float accumulation across millions of rows drifts.
 * Convert to dollars only when displaying.
 */

export type CostCategory = 'planning' | 'speech' | 'qc' | 'compute' | 'delivery';

export interface CostScope {
	userId?: string | null;
	creatorId?: string | null;
	contentId?: string | null;
}

export interface ReserveInput extends CostScope {
	category: CostCategory;
	operation: string;
	provider: string;
	model: string;
	estimatedInputUnits?: number;
	estimatedOutputUnits?: number;
	retryNumber?: number;
}

export interface Reservation {
	id: string;
	estimatedMicroUsd: number;
}

/**
 * Price table, micro-USD per 1,000 tokens.
 *
 * Deliberately conservative — an underestimate lets a call through that the
 * budget could not actually afford, which is the failure mode that matters.
 * Locally-hosted models are 0: Ollama runs on hardware already paid for, so
 * charging it against a spend ceiling would refuse free work.
 */
const PRICE_PER_1K_MICRO_USD: Record<string, { input: number; output: number }> = {
	ollama: { input: 0, output: 0 },
	openrouter: { input: 600, output: 1800 },
	openai: { input: 500, output: 1500 },
	anthropic: { input: 800, output: 4000 }
};

const DEFAULT_PRICE = { input: 1000, output: 3000 };

export function estimateMicroUsd(
	provider: string,
	inputUnits: number,
	outputUnits: number
): number {
	const price = PRICE_PER_1K_MICRO_USD[provider.toLowerCase()] ?? DEFAULT_PRICE;
	return Math.ceil((inputUnits / 1000) * price.input + (outputUnits / 1000) * price.output);
}

/** UTC month start — the period every budget rolls on. */
function periodStart(d = new Date()): string {
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * Is this scope within budget?
 *
 * A null `limitMicroUsd` means no ceiling — an explicit absence, not zero.
 * Zero would mean "cannot spend anything", a very different policy, and
 * conflating them would silently disable every AI feature the first time a
 * budget row was created without a limit.
 */
async function withinBudget(scope: 'user' | 'creator' | 'platform', scopeId: string, addMicroUsd: number) {
	const [row] = await db
		.select({ spent: aiBudgetPeriods.spentMicroUsd, limit: aiBudgetPeriods.limitMicroUsd })
		.from(aiBudgetPeriods)
		.where(
			and(
				eq(aiBudgetPeriods.scope, scope),
				eq(aiBudgetPeriods.scopeId, scopeId),
				eq(aiBudgetPeriods.periodStart, periodStart())
			)
		)
		.limit(1);

	if (!row || row.limit === null || row.limit === undefined) return true;
	return row.spent + addMicroUsd <= row.limit;
}

async function addSpend(scope: 'user' | 'creator' | 'platform', scopeId: string, deltaMicroUsd: number) {
	await db
		.insert(aiBudgetPeriods)
		.values({
			scope,
			scopeId,
			periodStart: periodStart(),
			spentMicroUsd: deltaMicroUsd
		})
		.onConflictDoUpdate({
			target: [aiBudgetPeriods.scope, aiBudgetPeriods.scopeId, aiBudgetPeriods.periodStart],
			set: {
				// Increment in SQL, not read-modify-write: concurrent AI calls
				// are the normal case and a lost update here understates spend.
				spentMicroUsd: sql`${aiBudgetPeriods.spentMicroUsd} + ${deltaMicroUsd}`,
				updatedAt: new Date()
			}
		});
}

export class BudgetExceededError extends Error {
	constructor(readonly scope: string, readonly scopeId: string) {
		super(`AI budget exceeded for ${scope}:${scopeId}`);
		this.name = 'BudgetExceededError';
	}
}

/**
 * Claim the estimated spend. Throws BudgetExceededError if any applicable
 * ceiling would be breached, and records a `refused` ledger row so a refusal is
 * as visible in reporting as a spend.
 */
export async function reserve(input: ReserveInput): Promise<Reservation> {
	const estimated = estimateMicroUsd(
		input.provider,
		input.estimatedInputUnits ?? 0,
		input.estimatedOutputUnits ?? 0
	);

	const checks: Array<['user' | 'creator' | 'platform', string]> = [['platform', 'platform']];
	if (input.userId) checks.push(['user', input.userId]);
	if (input.creatorId) checks.push(['creator', input.creatorId]);

	for (const [scope, scopeId] of checks) {
		if (!(await withinBudget(scope, scopeId, estimated))) {
			await db.insert(aiCostLedger).values({
				userId: input.userId ?? null,
				creatorId: input.creatorId ?? null,
				contentId: input.contentId ?? null,
				category: input.category,
				operation: input.operation,
				provider: input.provider,
				model: input.model,
				estimatedMicroUsd: estimated,
				status: 'refused',
				retryNumber: input.retryNumber ?? 0,
				errorMessage: `budget exceeded for ${scope}`
			});
			throw new BudgetExceededError(scope, scopeId);
		}
	}

	const [row] = await db
		.insert(aiCostLedger)
		.values({
			userId: input.userId ?? null,
			creatorId: input.creatorId ?? null,
			contentId: input.contentId ?? null,
			category: input.category,
			operation: input.operation,
			provider: input.provider,
			model: input.model,
			inputUnits: input.estimatedInputUnits ?? 0,
			outputUnits: input.estimatedOutputUnits ?? 0,
			estimatedMicroUsd: estimated,
			status: 'reserved',
			retryNumber: input.retryNumber ?? 0
		})
		.returning({ id: aiCostLedger.id });

	for (const [scope, scopeId] of checks) await addSpend(scope, scopeId, estimated);

	return { id: row.id, estimatedMicroUsd: estimated };
}

/**
 * Record what the call actually cost and reconcile the reservation.
 *
 * The delta can be negative — an over-estimate releases budget back. That
 * release is the whole point of reserving conservatively: a cautious estimate
 * never permanently over-charges the ceiling.
 */
export async function settle(
	reservation: Reservation,
	actual: { inputUnits: number; outputUnits: number; provider: string },
	scope: CostScope
): Promise<void> {
	const actualMicroUsd = estimateMicroUsd(actual.provider, actual.inputUnits, actual.outputUnits);
	const delta = actualMicroUsd - reservation.estimatedMicroUsd;

	await db
		.update(aiCostLedger)
		.set({
			inputUnits: actual.inputUnits,
			outputUnits: actual.outputUnits,
			actualMicroUsd,
			status: 'settled',
			settledAt: new Date()
		})
		.where(eq(aiCostLedger.id, reservation.id));

	if (delta !== 0) {
		await addSpend('platform', 'platform', delta);
		if (scope.userId) await addSpend('user', scope.userId, delta);
		if (scope.creatorId) await addSpend('creator', scope.creatorId, delta);
	}
}

/**
 * The call failed. Keep the row — a provider that timed out after consuming
 * input tokens still cost money, and a retry storm that bills nothing visible
 * is exactly how COGS drifts unnoticed — but release the unused reservation.
 */
export async function fail(
	reservation: Reservation,
	message: string,
	scope: CostScope
): Promise<void> {
	await db
		.update(aiCostLedger)
		.set({ status: 'failed', errorMessage: message.slice(0, 500), settledAt: new Date() })
		.where(eq(aiCostLedger.id, reservation.id));

	const release = -reservation.estimatedMicroUsd;
	await addSpend('platform', 'platform', release);
	if (scope.userId) await addSpend('user', scope.userId, release);
	if (scope.creatorId) await addSpend('creator', scope.creatorId, release);
}

/**
 * Rough token count for estimation only.
 *
 * ~4 characters per token is the usual English approximation. It is not
 * accurate enough for billing, which is why `settle()` recomputes from the
 * provider's reported usage where available — this exists solely so the
 * reservation has something to claim before the call is made.
 */
export function approxTokens(text: string): number {
	return Math.ceil(text.length / 4);
}
