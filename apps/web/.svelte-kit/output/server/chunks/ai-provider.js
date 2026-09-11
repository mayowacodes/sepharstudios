import { t as private_env } from "./shared-server.js";
import { C as aiBudgetPeriods, T as aiCostLedger, t as db } from "./drizzle.js";
import { n as getAIConfig } from "./ai-settings.js";
import { and, eq, sql } from "drizzle-orm";
//#region src/lib/server/ai-cost.ts
/**
* Price table, micro-USD per 1,000 tokens.
*
* Deliberately conservative — an underestimate lets a call through that the
* budget could not actually afford, which is the failure mode that matters.
* Locally-hosted models are 0: Ollama runs on hardware already paid for, so
* charging it against a spend ceiling would refuse free work.
*/
var PRICE_PER_1K_MICRO_USD = {
	ollama: {
		input: 0,
		output: 0
	},
	openrouter: {
		input: 600,
		output: 1800
	},
	openai: {
		input: 500,
		output: 1500
	},
	anthropic: {
		input: 800,
		output: 4e3
	}
};
var DEFAULT_PRICE = {
	input: 1e3,
	output: 3e3
};
function estimateMicroUsd(provider, inputUnits, outputUnits) {
	const price = PRICE_PER_1K_MICRO_USD[provider.toLowerCase()] ?? DEFAULT_PRICE;
	return Math.ceil(inputUnits / 1e3 * price.input + outputUnits / 1e3 * price.output);
}
/** UTC month start — the period every budget rolls on. */
function periodStart(d = /* @__PURE__ */ new Date()) {
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}
/**
* Is this scope within budget?
*
* A null `limitMicroUsd` means no ceiling — an explicit absence, not zero.
* Zero would mean "cannot spend anything", a very different policy, and
* conflating them would silently disable every AI feature the first time a
* budget row was created without a limit.
*/
async function withinBudget(scope, scopeId, addMicroUsd) {
	const [row] = await db.select({
		spent: aiBudgetPeriods.spentMicroUsd,
		limit: aiBudgetPeriods.limitMicroUsd
	}).from(aiBudgetPeriods).where(and(eq(aiBudgetPeriods.scope, scope), eq(aiBudgetPeriods.scopeId, scopeId), eq(aiBudgetPeriods.periodStart, periodStart()))).limit(1);
	if (!row || row.limit === null || row.limit === void 0) return true;
	return row.spent + addMicroUsd <= row.limit;
}
async function addSpend(scope, scopeId, deltaMicroUsd) {
	await db.insert(aiBudgetPeriods).values({
		scope,
		scopeId,
		periodStart: periodStart(),
		spentMicroUsd: deltaMicroUsd
	}).onConflictDoUpdate({
		target: [
			aiBudgetPeriods.scope,
			aiBudgetPeriods.scopeId,
			aiBudgetPeriods.periodStart
		],
		set: {
			spentMicroUsd: sql`${aiBudgetPeriods.spentMicroUsd} + ${deltaMicroUsd}`,
			updatedAt: /* @__PURE__ */ new Date()
		}
	});
}
var BudgetExceededError = class extends Error {
	scope;
	scopeId;
	constructor(scope, scopeId) {
		super(`AI budget exceeded for ${scope}:${scopeId}`);
		this.scope = scope;
		this.scopeId = scopeId;
		this.name = "BudgetExceededError";
	}
};
/**
* Claim the estimated spend. Throws BudgetExceededError if any applicable
* ceiling would be breached, and records a `refused` ledger row so a refusal is
* as visible in reporting as a spend.
*/
async function reserve(input) {
	const estimated = estimateMicroUsd(input.provider, input.estimatedInputUnits ?? 0, input.estimatedOutputUnits ?? 0);
	const checks = [["platform", "platform"]];
	if (input.userId) checks.push(["user", input.userId]);
	if (input.creatorId) checks.push(["creator", input.creatorId]);
	for (const [scope, scopeId] of checks) if (!await withinBudget(scope, scopeId, estimated)) {
		await db.insert(aiCostLedger).values({
			userId: input.userId ?? null,
			creatorId: input.creatorId ?? null,
			contentId: input.contentId ?? null,
			category: input.category,
			operation: input.operation,
			provider: input.provider,
			model: input.model,
			estimatedMicroUsd: estimated,
			status: "refused",
			retryNumber: input.retryNumber ?? 0,
			errorMessage: `budget exceeded for ${scope}`
		});
		throw new BudgetExceededError(scope, scopeId);
	}
	const [row] = await db.insert(aiCostLedger).values({
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
		status: "reserved",
		retryNumber: input.retryNumber ?? 0
	}).returning({ id: aiCostLedger.id });
	for (const [scope, scopeId] of checks) await addSpend(scope, scopeId, estimated);
	return {
		id: row.id,
		estimatedMicroUsd: estimated
	};
}
/**
* Record what the call actually cost and reconcile the reservation.
*
* The delta can be negative — an over-estimate releases budget back. That
* release is the whole point of reserving conservatively: a cautious estimate
* never permanently over-charges the ceiling.
*/
async function settle(reservation, actual, scope) {
	const actualMicroUsd = estimateMicroUsd(actual.provider, actual.inputUnits, actual.outputUnits);
	const delta = actualMicroUsd - reservation.estimatedMicroUsd;
	await db.update(aiCostLedger).set({
		inputUnits: actual.inputUnits,
		outputUnits: actual.outputUnits,
		actualMicroUsd,
		status: "settled",
		settledAt: /* @__PURE__ */ new Date()
	}).where(eq(aiCostLedger.id, reservation.id));
	if (delta !== 0) {
		await addSpend("platform", "platform", delta);
		if (scope.userId) await addSpend("user", scope.userId, delta);
		if (scope.creatorId) await addSpend("creator", scope.creatorId, delta);
	}
}
/**
* The call failed. Keep the row — a provider that timed out after consuming
* input tokens still cost money, and a retry storm that bills nothing visible
* is exactly how COGS drifts unnoticed — but release the unused reservation.
*/
async function fail(reservation, message, scope) {
	await db.update(aiCostLedger).set({
		status: "failed",
		errorMessage: message.slice(0, 500),
		settledAt: /* @__PURE__ */ new Date()
	}).where(eq(aiCostLedger.id, reservation.id));
	const release = -reservation.estimatedMicroUsd;
	await addSpend("platform", "platform", release);
	if (scope.userId) await addSpend("user", scope.userId, release);
	if (scope.creatorId) await addSpend("creator", scope.creatorId, release);
}
/**
* Rough token count for estimation only.
*
* ~4 characters per token is the usual English approximation. It is not
* accurate enough for billing, which is why `settle()` recomputes from the
* provider's reported usage where available — this exists solely so the
* reservation has something to claim before the call is made.
*/
function approxTokens(text) {
	return Math.ceil(text.length / 4);
}
//#endregion
//#region src/lib/server/ai-provider.ts
/**
* ─────────────────────────────────────────────────────────────────────────────
* UNIFIED AI PROVIDER — Sephar Studios (Dual-Model Hybrid)
* ─────────────────────────────────────────────────────────────────────────────
*
* TWO OLLAMA MODELS, TWO JOBS:
*
*   CHAT MODEL   (Gemma 4 / OLLAMA_CHAT_MODEL)
*     → Conversational, warm, faith-aware
*     → companion chat, scene insights, platform narration
*     → best at: natural language, long-form, theological nuance
*
*   AGENT MODEL  (Hermes 3 / OLLAMA_AGENT_MODEL)
*     → Structured JSON, function-calling grade output
*     → content tagging, moderation, token scoring, NFT metadata
*     → best at: reliable JSON, classification, multi-step reasoning
*
* TWO CLOUD FALLBACKS (OpenRouter):
*   OPENROUTER_CHAT_MODEL  = google/gemma-2-27b-it   (chat fallback)
*   OPENROUTER_AGENT_MODEL = nousresearch/hermes-3-llama-3.1-405b:extended
*
* PROVIDER ROUTING:
*   'ollama'      → use Ollama (right model for type); fallback to OpenRouter
*   'openrouter'  → skip Ollama entirely
*   'auto'        → Ollama first, then OpenRouter
*
* MODEL TYPE:
*   'chat'  → conversational (Gemma 4 locally, Claude/Gemma cloud)
*   'agent' → structured JSON/function-calling (Hermes 3 locally, Hermes cloud)
*
* ENVIRONMENT VARIABLES:
*   OLLAMA_URL              = http://ollama:11434
*   OLLAMA_CHAT_MODEL       = gemma4            (pull: ollama pull gemma4)
*   OLLAMA_AGENT_MODEL      = hermes3           (pull: ollama pull hermes3)
*   OPENROUTER_API_KEY      = sk-or-v1-...
*   OPENROUTER_CHAT_MODEL   = google/gemma-2-27b-it          (optional override)
*   OPENROUTER_AGENT_MODEL  = nousresearch/hermes-3-llama-3.1-405b:extended
* ─────────────────────────────────────────────────────────────────────────────
*/
/**
* callAgent — shorthand for structured/agentic tasks (Hermes 3).
* Use for: tagging, moderation, scoring, NFT metadata, recommendations.
*/
async function callAgent(messages, options = {}) {
	return callAI(messages, {
		...options,
		modelType: "agent",
		provider: options.provider ?? "ollama"
	});
}
/**
* callChat — shorthand for conversational tasks (Gemma 4).
* Use for: companion chat, scene insights, creator narration, portfolio storytelling.
*/
async function callChat(messages, options = {}) {
	return callAI(messages, {
		...options,
		modelType: "chat",
		provider: options.provider ?? "auto"
	});
}
/**
* Main unified AI call with smart provider + model routing.
*/
async function callAI(messages, options = {}) {
	const { provider = "auto", modelType = "chat", timeoutMs = 15e3, temperature = .3, maxTokens = 1024 } = options;
	const callOptions = {
		timeoutMs,
		temperature,
		maxTokens,
		modelType
	};
	const cost = options.cost;
	const inputTokens = approxTokens(messages.map((m) => m.content).join(" "));
	const reservedProvider = provider === "openrouter" ? "openrouter" : "ollama";
	let reservation = null;
	if (cost) try {
		reservation = await reserve({
			userId: cost.userId,
			creatorId: cost.creatorId,
			contentId: cost.contentId,
			category: cost.category ?? "planning",
			operation: cost.operation,
			provider: reservedProvider,
			model: modelType,
			estimatedInputUnits: inputTokens,
			estimatedOutputUnits: maxTokens
		});
	} catch (err) {
		if (err instanceof BudgetExceededError) {
			console.warn(`[ai] refused: ${err.message} (${cost.operation})`);
			return null;
		}
		console.error("[ai] cost reservation failed, proceeding unmetered:", err);
	}
	const scope = {
		userId: cost?.userId,
		creatorId: cost?.creatorId,
		contentId: cost?.contentId
	};
	const finish = async (result) => {
		if (!reservation) return result;
		try {
			if (result) await settle(reservation, {
				inputUnits: inputTokens,
				outputUnits: approxTokens(result.content),
				provider: result.provider
			}, scope);
			else await fail(reservation, "no provider returned a response", scope);
		} catch (err) {
			console.error("[ai] cost settlement failed:", err);
		}
		return result;
	};
	if (provider === "openrouter") {
		if (!private_env.OPENROUTER_API_KEY) return finish(null);
		return finish(await tryOpenRouter(messages, callOptions));
	}
	if (provider === "ollama" || provider === "auto") {
		if (private_env.OLLAMA_URL) {
			const ollamaResult = await tryOllama(messages, callOptions);
			if (ollamaResult) return finish(ollamaResult);
		}
		if (private_env.OPENROUTER_API_KEY) return finish(await tryOpenRouter(messages, callOptions));
	}
	return finish(null);
}
async function tryOllama(messages, options) {
	const aiConfig = await getAIConfig().catch(() => null);
	const model = options.modelType === "agent" ? aiConfig?.ollamaAgentModel ?? private_env.OLLAMA_AGENT_MODEL ?? "hermes3" : aiConfig?.ollamaChatModel ?? private_env.OLLAMA_CHAT_MODEL ?? "gemma4";
	try {
		const res = await fetch(`${private_env.OLLAMA_URL}/api/chat`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model,
				messages,
				stream: false,
				options: {
					temperature: options.temperature,
					num_predict: options.maxTokens
				}
			}),
			signal: AbortSignal.timeout(options.timeoutMs)
		});
		if (!res.ok) return null;
		const content = (await res.json())?.message?.content ?? "";
		if (!content.trim()) return null;
		return {
			content,
			provider: "ollama",
			model
		};
	} catch {
		return null;
	}
}
async function tryOpenRouter(messages, options) {
	const aiConfig = await getAIConfig().catch(() => null);
	const model = options.modelType === "agent" ? aiConfig?.agentModel ?? private_env.OPENROUTER_AGENT_MODEL ?? "deepseek/deepseek-r1" : aiConfig?.chatModel ?? private_env.OPENROUTER_CHAT_MODEL ?? "google/gemini-2.0-flash-001";
	try {
		const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${private_env.OPENROUTER_API_KEY}`,
				"Content-Type": "application/json",
				"HTTP-Referer": "https://sepharstudios.com",
				"X-Title": "Sephar Studios AI"
			},
			body: JSON.stringify({
				model,
				messages,
				temperature: options.temperature,
				max_tokens: options.maxTokens
			}),
			signal: AbortSignal.timeout(options.timeoutMs)
		});
		if (!res.ok) return null;
		const content = (await res.json())?.choices?.[0]?.message?.content ?? "";
		if (!content.trim()) return null;
		return {
			content,
			provider: "openrouter",
			model
		};
	} catch {
		return null;
	}
}
/** Extract the first valid JSON array from AI text output */
function extractJsonArray(text) {
	const match = text.match(/\[[\s\S]*?\]/);
	if (!match) return null;
	try {
		return JSON.parse(match[0]);
	} catch {
		return null;
	}
}
/** Extract the first valid JSON object from AI text output */
function extractJsonObject(text) {
	const match = text.match(/\{[\s\S]*\}/) ?? text.match(/\{[\s\S]*?\}/);
	if (!match) return null;
	try {
		return JSON.parse(match[0]);
	} catch {
		return null;
	}
}
/** System prompt shared by all Sephar Studios AI features */
var SEPHAR_SYSTEM_PROMPT = `You are an AI assistant for Sephar Studios, a faith-based streaming platform for Christian movies, documentaries, and family content. Your responses should be respectful of Christian faith, theologically sensitive, and family-appropriate. Always return structured output (JSON) when asked. Be concise and accurate.`;
//#endregion
export { extractJsonObject as a, extractJsonArray as i, callAgent as n, callChat as r, SEPHAR_SYSTEM_PROMPT as t };
