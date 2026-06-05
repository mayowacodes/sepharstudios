import { env } from '$env/dynamic/private';
import { createOpenAI } from '@ai-sdk/openai';
import type { LanguageModel } from 'ai';
import { getAIConfig } from './ai-settings';

/**
 * Vercel AI SDK 6 model factory — adapter over the existing dual-model
 * (Ollama → OpenRouter) routing in `ai-provider.ts`, but returning a
 * `LanguageModel` instead of a one-shot completion. This is what
 * `streamText()` needs.
 *
 * We expose two model surfaces:
 *
 *   - `getAiModel('chat')`  → conversational (Gemma 4 local / Gemini cloud)
 *   - `getAiModel('agent')` → structured (Hermes 3 local / Deepseek cloud)
 *
 * The factory is lazy — it reads `getAIConfig()` (DB admin settings, falls
 * back to env vars) on every call so an admin can change the model live
 * via `/admin/settings` and the next streaming turn picks it up without
 * a server restart.
 *
 * Ollama exposes an OpenAI-compatible chat-completions endpoint at
 * `${OLLAMA_URL}/v1`. OpenRouter is also OpenAI-compatible at
 * `https://openrouter.ai/api/v1`. We use `createOpenAI` from
 * `@ai-sdk/openai` against each with the right baseURL.
 *
 * Fallback ordering matches `ai-provider.ts` for compatibility:
 *   provider preference 'auto'       → Ollama, then OpenRouter
 *   provider preference 'ollama'     → Ollama only
 *   provider preference 'openrouter' → OpenRouter only
 *
 * For now this returns a SINGLE model (first available provider for the
 * requested type). True runtime fallback is a follow-on: AI SDK middleware
 * (`wrapLanguageModel` with a fallback callback) can swap to OpenRouter
 * mid-stream if Ollama drops. The simple single-model path is enough to
 * unblock the streaming UX win first.
 */

export type AiModelType = 'chat' | 'agent';

interface ResolvedModel {
	model: LanguageModel;
	provider: 'ollama' | 'openrouter';
	modelId: string;
}

const OPENROUTER_HEADERS = {
	'HTTP-Referer': 'https://sepharstudios.com',
	'X-Title': 'Sephar Studios AI'
} as const;

async function resolveModel(modelType: AiModelType): Promise<ResolvedModel> {
	const aiConfig = await getAIConfig().catch(() => null);
	const preference = aiConfig?.providerPreference ?? 'auto';

	// OpenRouter-first by default: it has hundreds of models that always
	// exist (no "model not found" failures like raw Ollama produces if
	// you haven't pulled the model). The :free suffix on OpenRouter model
	// ids opts into the free tier — no credit charged, but rate-limited
	// to ~20 req/min and ~200 req/day per account. Good enough for
	// development and low-traffic Copilot use; bump to paid models by
	// changing /admin/settings when you have credit.
	//
	// `preference` semantics (matches /admin/settings UI):
	//   'auto'       → OpenRouter first, Ollama fallback (this is the new
	//                  default — previously was Ollama first)
	//   'openrouter' → OpenRouter only (never falls back)
	//   'ollama'     → Ollama only (never falls back)

	const wantOpenRouter = preference === 'openrouter' || preference === 'auto';
	const wantOllama     = preference === 'ollama'     || preference === 'auto';

	// ── OpenRouter path (preferred under 'auto') ────────────────────────────
	if (wantOpenRouter && env.OPENROUTER_API_KEY) {
		const modelId = modelType === 'agent'
			? (aiConfig?.agentModel ?? env.OPENROUTER_AGENT_MODEL ?? 'meta-llama/llama-3.1-70b-instruct:free')
			: (aiConfig?.chatModel  ?? env.OPENROUTER_CHAT_MODEL  ?? 'google/gemma-2-9b-it:free');
		const openrouter = createOpenAI({
			baseURL: 'https://openrouter.ai/api/v1',
			apiKey: env.OPENROUTER_API_KEY,
			headers: OPENROUTER_HEADERS
		});
		return { model: openrouter(modelId), provider: 'openrouter', modelId };
	}

	// ── Ollama path (fallback under 'auto', or required if OPENROUTER_API_KEY
	//    is absent and preference is 'openrouter') ──────────────────────────
	if (wantOllama && env.OLLAMA_URL) {
		const modelId = modelType === 'agent'
			? (aiConfig?.ollamaAgentModel ?? env.OLLAMA_AGENT_MODEL ?? 'hermes3')
			: (aiConfig?.ollamaChatModel  ?? env.OLLAMA_CHAT_MODEL  ?? 'gemma4');
		const ollama = createOpenAI({
			baseURL: `${env.OLLAMA_URL.replace(/\/$/, '')}/v1`,
			apiKey: 'ollama' // Ollama ignores the value but the SDK requires non-empty
		});
		return { model: ollama(modelId), provider: 'ollama', modelId };
	}

	throw new Error(
		'No AI provider available. Set OPENROUTER_API_KEY (recommended — works with :free models without credit) or OLLAMA_URL (requires `ollama pull <model>` for each model). Configure /admin/settings to change model ids.'
	);
}

/**
 * Returns a Vercel AI SDK `LanguageModel` for `streamText()` to consume.
 * Throws if no provider is reachable.
 */
export async function getAiModel(modelType: AiModelType): Promise<ResolvedModel> {
	return resolveModel(modelType);
}

