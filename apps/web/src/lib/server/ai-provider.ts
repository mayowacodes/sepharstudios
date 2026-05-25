import { env } from '$env/dynamic/private';
import { getAIConfig } from './ai-settings';

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

export type AIProviderPreference = 'ollama' | 'openrouter' | 'auto';
export type AIModelType = 'chat' | 'agent';

export interface AIMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface AIResponse {
	content: string;
	provider: 'ollama' | 'openrouter';
	model: string;
}

export interface AICallOptions {
	/** Which provider to prefer. Default: 'auto' (Ollama → OpenRouter fallback) */
	provider?: AIProviderPreference;
	/**
	 * 'chat'  → Gemma 4 / conversational model (companion, narration, insights)
	 * 'agent' → Hermes 3 / structured model (tagging, scoring, moderation, NFTs)
	 * Default: 'chat'
	 */
	modelType?: AIModelType;
	timeoutMs?: number;
	temperature?: number;
	maxTokens?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONVENIENCE WRAPPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * callAgent — shorthand for structured/agentic tasks (Hermes 3).
 * Use for: tagging, moderation, scoring, NFT metadata, recommendations.
 */
export async function callAgent(
	messages: AIMessage[],
	options: Omit<AICallOptions, 'modelType'> = {}
): Promise<AIResponse | null> {
	return callAI(messages, { ...options, modelType: 'agent', provider: options.provider ?? 'ollama' });
}

/**
 * callChat — shorthand for conversational tasks (Gemma 4).
 * Use for: companion chat, scene insights, creator narration, portfolio storytelling.
 */
export async function callChat(
	messages: AIMessage[],
	options: Omit<AICallOptions, 'modelType'> = {}
): Promise<AIResponse | null> {
	return callAI(messages, { ...options, modelType: 'chat', provider: options.provider ?? 'auto' });
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ROUTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Main unified AI call with smart provider + model routing.
 */
export async function callAI(
	messages: AIMessage[],
	options: AICallOptions = {}
): Promise<AIResponse | null> {
	const {
		provider = 'auto',
		modelType = 'chat',
		timeoutMs = 15000,
		temperature = 0.3,
		maxTokens = 1024
	} = options;

	const callOptions = { timeoutMs, temperature, maxTokens, modelType };

	// ── OpenRouter only ───────────────────────────────────────────────────────
	if (provider === 'openrouter') {
		if (!env.OPENROUTER_API_KEY) return null;
		return tryOpenRouter(messages, callOptions);
	}

	// ── Ollama preferred (with OpenRouter fallback) ───────────────────────────
	if (provider === 'ollama' || provider === 'auto') {
		if (env.OLLAMA_URL) {
			const ollamaResult = await tryOllama(messages, callOptions);
			if (ollamaResult) return ollamaResult;
			// Ollama failed or down — fall through to OpenRouter
		}

		if (env.OPENROUTER_API_KEY) {
			return tryOpenRouter(messages, callOptions);
		}
	}

	return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// OLLAMA ADAPTER
// Routes to OLLAMA_CHAT_MODEL or OLLAMA_AGENT_MODEL based on modelType
// Admin can override model names via the AI settings panel (DB config).
// Env vars serve as a fallback if DB config is unavailable.
// ─────────────────────────────────────────────────────────────────────────────
async function tryOllama(
	messages: AIMessage[],
	options: { timeoutMs: number; temperature: number; maxTokens: number; modelType: AIModelType }
): Promise<AIResponse | null> {
	// Model selection: DB admin config → env var → hardcoded fallback
	const aiConfig = await getAIConfig().catch(() => null);
	const model =
		options.modelType === 'agent'
			? (aiConfig?.ollamaAgentModel ?? env.OLLAMA_AGENT_MODEL ?? 'hermes3')
			: (aiConfig?.ollamaChatModel  ?? env.OLLAMA_CHAT_MODEL  ?? 'gemma4');

	try {
		const res = await fetch(`${env.OLLAMA_URL}/api/chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
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

		const data = await res.json();
		const content: string = data?.message?.content ?? '';
		if (!content.trim()) return null;

		return { content, provider: 'ollama', model };
	} catch {
		return null;
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// OPENROUTER ADAPTER
// Routes to chat or agent cloud model based on modelType
// Admin can change models live via the AI settings panel (stored in DB).
// Env vars serve as a last fallback if DB config is unavailable.
// ─────────────────────────────────────────────────────────────────────────────
async function tryOpenRouter(
	messages: AIMessage[],
	options: { timeoutMs: number; temperature: number; maxTokens: number; modelType: AIModelType }
): Promise<AIResponse | null> {
	// Cloud model selection: DB admin config → env var → hardcoded fallback
	const aiConfig = await getAIConfig().catch(() => null);
	const model =
		options.modelType === 'agent'
			? (aiConfig?.agentModel ?? env.OPENROUTER_AGENT_MODEL ?? 'deepseek/deepseek-r1')
			: (aiConfig?.chatModel  ?? env.OPENROUTER_CHAT_MODEL  ?? 'google/gemini-2.0-flash-001');

	try {
		const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
				'Content-Type': 'application/json',
				'HTTP-Referer': 'https://sepharstudios.com',
				'X-Title': 'Sephar Studios AI'
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

		const data = await res.json();
		const content: string = data?.choices?.[0]?.message?.content ?? '';
		if (!content.trim()) return null;

		return { content, provider: 'openrouter', model };
	} catch {
		return null;
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Extract the first valid JSON array from AI text output */
export function extractJsonArray<T = unknown>(text: string): T[] | null {
	const match = text.match(/\[[\s\S]*?\]/);
	if (!match) return null;
	try {
		return JSON.parse(match[0]) as T[];
	} catch {
		return null;
	}
}

/** Extract the first valid JSON object from AI text output */
export function extractJsonObject<T = Record<string, unknown>>(text: string): T | null {
	// Try greedy match first (handles nested objects), then minimal
	const match = text.match(/\{[\s\S]*\}/) ?? text.match(/\{[\s\S]*?\}/);
	if (!match) return null;
	try {
		return JSON.parse(match[0]) as T;
	} catch {
		return null;
	}
}

/** System prompt shared by all Sephar Studios AI features */
export const SEPHAR_SYSTEM_PROMPT = `You are an AI assistant for Sephar Studios, a faith-based streaming platform for Christian movies, documentaries, and family content. Your responses should be respectful of Christian faith, theologically sensitive, and family-appropriate. Always return structured output (JSON) when asked. Be concise and accurate.`;

// ─────────────────────────────────────────────────────────────────────────────
// ROUTING REFERENCE
// ─────────────────────────────────────────────────────────────────────────────
//
//  HERMES 3 (agent model — structured JSON, function-calling):
//    ✓ Content auto-tagging         callAgent()  — every upload
//    ✓ Search intent classification callAgent()  — every search
//    ✓ Comment moderation           callAgent()  — every comment
//    ✓ Content pre-screening        callAgent()  — every upload
//    ✓ Review quality scoring       callAgent()  — every review
//    ✓ Watch engagement / tokens    callAgent()  — every watch session
//    ✓ Bot/farming detection        callAgent()  — periodic
//    ✓ NFT metadata generation      callAgent()  — at mint time
//    ✓ Creator analytics insights   callAgent()  — dashboard load
//    ✓ Title optimizer              callAgent()  — on-demand
//
//  GEMMA 4 (chat model — conversational, faith-aware):
//    ✓ Watch companion chat         callChat()   — user-initiated
//    ✓ Scene faith insights         callChat()   — video player button
//    ✓ Portfolio narration          callChat()   — NFT portfolio page
//    ✓ Blockchain activity story    callChat()   — activity feed
//
// ─────────────────────────────────────────────────────────────────────────────
