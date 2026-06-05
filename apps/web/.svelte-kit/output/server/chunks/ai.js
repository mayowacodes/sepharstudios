import { t as private_env } from "./shared-server.js";
import { g as aiCallLog, t as db } from "./drizzle.js";
import { n as callAgent, r as callChat } from "./ai-provider.js";
import { and, eq, gte, sql } from "drizzle-orm";
//#region src/lib/server/ai.ts
var DEFAULT_BUDGET = 500;
function monthlyBudgetCents() {
	const raw = private_env.AI_COST_BUDGET_CENTS_PER_USER_PER_MONTH;
	if (raw === void 0) return DEFAULT_BUDGET;
	const n = Number(raw);
	return Number.isFinite(n) && n >= 0 ? n : DEFAULT_BUDGET;
}
/**
* Very rough cost estimate. Cents per 1k tokens; tokens ≈ chars / 4.
* Real Stripe-style accuracy isn't needed — we just want sane aggregate
* spend numbers for the budget guard.
*/
function estimateCostCents(messages, output) {
	const inChars = messages.reduce((sum, m) => sum + m.content.length, 0);
	const outChars = output.length;
	const tokensIn = Math.ceil(inChars / 4);
	const tokensOut = Math.ceil(outChars / 4);
	return {
		tokensIn,
		tokensOut,
		costCents: Math.ceil(tokensIn / 1e6 * 50 + tokensOut / 1e6 * 150)
	};
}
async function spendThisMonth(userId) {
	const start = /* @__PURE__ */ new Date();
	start.setDate(1);
	start.setHours(0, 0, 0, 0);
	const [row] = await db.select({ total: sql`coalesce(sum(${aiCallLog.costCents}), 0)::int` }).from(aiCallLog).where(and(eq(aiCallLog.userId, userId), gte(aiCallLog.createdAt, start)));
	return Number(row?.total ?? 0);
}
async function runAi(input) {
	const budget = monthlyBudgetCents();
	if (budget > 0 && input.userId) {
		if (await spendThisMonth(input.userId) >= budget) return {
			ok: false,
			error: "budget_exceeded",
			message: `Monthly AI budget reached (${budget / 100} USD). Resets on the 1st.`
		};
	}
	const t0 = Date.now();
	const fn = (input.modelType ?? "chat") === "chat" ? callChat : callAgent;
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
			error: "provider_failed",
			message: err instanceof Error ? err.message : "AI provider failed"
		};
	}
	if (!result) {
		await logCall(input, t0, null, /* @__PURE__ */ new Error("Provider returned null"));
		return {
			ok: false,
			error: "unavailable",
			message: "AI provider unavailable"
		};
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
async function logCall(input, startedAt, result, err, costOverride) {
	const cost = costOverride ?? (result ? estimateCostCents(input.messages, result.content) : {
		tokensIn: 0,
		tokensOut: 0,
		costCents: 0
	});
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
			error: err ? (err instanceof Error ? err.message : String(err)).slice(0, 2e3) : null
		});
	} catch (logErr) {
		console.warn("[ai] log insert failed:", logErr);
	}
}
/**
* Helper: extract the JSON object from a model response. Mirrors the
* existing extractJsonObject from ai-provider but lives here so callers
* import only one symbol.
*/
function tryParseJson(raw) {
	const trimmed = raw.trim();
	const start = trimmed.indexOf("{");
	const end = trimmed.lastIndexOf("}");
	if (start === -1 || end === -1 || end < start) return null;
	try {
		return JSON.parse(trimmed.slice(start, end + 1));
	} catch {
		return null;
	}
}
//#endregion
export { tryParseJson as n, runAi as t };
