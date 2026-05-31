import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { aiCallLog } from '$lib/db/schema/sepharstudios';
import { and, eq, gte, sql } from 'drizzle-orm';
import { callAgent, callChat, type AIMessage } from './ai-provider';

/**
 * AI Layer 1 wrapper. Adds cost logging + per-user monthly budget enforcement
 * around the existing `callAgent` / `callChat` providers. Every inline-AI
 * surface (creator + admin Suggest buttons) goes through `runAi()`.
 *
 * Budget:
 *   AI_COST_BUDGET_CENTS_PER_USER_PER_MONTH defaults to 500 (= $5). Returns
 *   `BudgetError` when exceeded; the caller surfaces a 429 with a friendly
 *   message. Set to 0 to disable enforcement (tracking still runs).
 *
 * Cost estimation:
 *   We don't get token counts from the local Ollama providers, so we
 *   approximate from character counts at conservative rates. The
 *   `ai_call_log` row stores the estimate; admins can audit aggregate spend
 *   even when the provider doesn't expose tokens directly.
 */

export interface AiCallInput {
	userId: string | null;
	surface: string;           // e.g. 'creator:suggest-title'
	messages: AIMessage[];
	modelType?: 'chat' | 'agent';
	temperature?: number;
	maxTokens?: number;
}

export interface AiCallSuccess {
	ok: true;
	content: string;
	provider: string;
	model: string;
	costCents: number;
}

export interface AiCallFailure {
	ok: false;
	error: 'budget_exceeded' | 'provider_failed' | 'unavailable';
	message: string;
}

export type AiCallResult = AiCallSuccess | AiCallFailure;

const DEFAULT_BUDGET = 500;
function monthlyBudgetCents(): number {
	const raw = env.AI_COST_BUDGET_CENTS_PER_USER_PER_MONTH;
	if (raw === undefined) return DEFAULT_BUDGET;
	const n = Number(raw);
	return Number.isFinite(n) && n >= 0 ? n : DEFAULT_BUDGET;
}

/**
 * Very rough cost estimate. Cents per 1k tokens; tokens ≈ chars / 4.
 * Real Stripe-style accuracy isn't needed — we just want sane aggregate
 * spend numbers for the budget guard.
 */
function estimateCostCents(messages: AIMessage[], output: string): {
	tokensIn: number; tokensOut: number; costCents: number;
} {
	const inChars = messages.reduce((sum, m) => sum + m.content.length, 0);
	const outChars = output.length;
	const tokensIn = Math.ceil(inChars / 4);
	const tokensOut = Math.ceil(outChars / 4);
	// Generous default: $0.50 per 1M input, $1.50 per 1M output (rounded up).
	const costCents = Math.ceil(
		(tokensIn / 1_000_000) * 50 + (tokensOut / 1_000_000) * 150
	);
	return { tokensIn, tokensOut, costCents };
}

async function spendThisMonth(userId: string): Promise<number> {
	const start = new Date();
	start.setDate(1);
	start.setHours(0, 0, 0, 0);
	const [row] = await db.select({
		total: sql<number>`coalesce(sum(${aiCallLog.costCents}), 0)::int`
	})
		.from(aiCallLog)
		.where(and(eq(aiCallLog.userId, userId), gte(aiCallLog.createdAt, start)));
	return Number(row?.total ?? 0);
}

export async function runAi(input: AiCallInput): Promise<AiCallResult> {
	const budget = monthlyBudgetCents();
	if (budget > 0 && input.userId) {
		const spent = await spendThisMonth(input.userId);
		if (spent >= budget) {
			return {
				ok: false,
				error: 'budget_exceeded',
				message: `Monthly AI budget reached (${budget / 100} USD). Resets on the 1st.`
			};
		}
	}

	const t0 = Date.now();
	const fn = (input.modelType ?? 'chat') === 'chat' ? callChat : callAgent;
	let result;
	try {
		result = await fn(input.messages, {
			temperature: input.temperature,
			maxTokens: input.maxTokens
		});
	} catch (err) {
		await logCall(input, t0, null, err);
		return {
			ok: false,
			error: 'provider_failed',
			message: err instanceof Error ? err.message : 'AI provider failed'
		};
	}

	if (!result) {
		await logCall(input, t0, null, new Error('Provider returned null'));
		return { ok: false, error: 'unavailable', message: 'AI provider unavailable' };
	}

	const cost = estimateCostCents(input.messages, result.content);
	await logCall(input, t0, result, null, cost);

	return {
		ok: true,
		content: result.content,
		provider: result.provider,
		model: result.model,
		costCents: cost.costCents
	};
}

async function logCall(
	input: AiCallInput,
	startedAt: number,
	result: { provider: string; model: string; content: string } | null,
	err: unknown,
	costOverride?: { tokensIn: number; tokensOut: number; costCents: number }
) {
	const cost = costOverride
		?? (result ? estimateCostCents(input.messages, result.content) : { tokensIn: 0, tokensOut: 0, costCents: 0 });
	try {
		await db.insert(aiCallLog).values({
			userId: input.userId,
			surface: input.surface,
			model: result?.model ?? null,
			provider: result?.provider ?? null,
			tokensIn: cost.tokensIn,
			tokensOut: cost.tokensOut,
			costCents: cost.costCents,
			latencyMs: Date.now() - startedAt,
			ok: !err,
			error: err ? (err instanceof Error ? err.message : String(err)).slice(0, 2000) : null
		});
	} catch (logErr) {
		console.warn('[ai] log insert failed:', logErr);
	}
}

/**
 * Helper: extract the JSON object from a model response. Mirrors the
 * existing extractJsonObject from ai-provider but lives here so callers
 * import only one symbol.
 */
export function tryParseJson<T>(raw: string): T | null {
	const trimmed = raw.trim();
	const start = trimmed.indexOf('{');
	const end = trimmed.lastIndexOf('}');
	if (start === -1 || end === -1 || end < start) return null;
	try {
		return JSON.parse(trimmed.slice(start, end + 1)) as T;
	} catch {
		return null;
	}
}
