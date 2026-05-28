import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { requireAdmin } from '$lib/server/admin-auth';

/**
 * GET /api/admin/ai/models
 *
 * Fetches the full list of available models from OpenRouter,
 * enriches each with category + suitability tags, and caches the result
 * for 1 hour (models don't change often).
 *
 * Response: { models: OpenRouterModel[], hasApiKey: boolean }
 */

export interface OpenRouterModel {
	id: string;
	name: string;
	description: string;
	contextLength: number;
	promptPrice: string;   // USD per 1M tokens, formatted e.g. "$0.10"
	completionPrice: string;
	isFree: boolean;
	category: 'chat' | 'agent' | 'both';
	tags: string[];        // e.g. ['fast', 'reasoning', 'vision', 'cheap']
}

// ── In-memory cache (1 hour TTL) ─────────────────────────────────────────────
let modelsCache: OpenRouterModel[] | null = null;
let modelsCacheExpiry = 0;


/** Models known to be good for structured JSON output (agent tasks) */
const AGENT_CAPABLE = new Set([
	'deepseek/deepseek-r1',
	'deepseek/deepseek-r1:free',
	'deepseek/deepseek-chat',
	'deepseek/deepseek-chat:free',
	'nousresearch/hermes-3-llama-3.1-405b:extended',
	'nousresearch/hermes-3-llama-3.1-70b',
	'meta-llama/llama-3.3-70b-instruct',
	'meta-llama/llama-3.1-70b-instruct',
	'meta-llama/llama-3.1-405b-instruct',
	'mistralai/mixtral-8x7b-instruct',
	'mistralai/mistral-7b-instruct',
	'mistralai/mistral-7b-instruct:free',
	'mistralai/codestral-mamba',
	'openai/gpt-4o',
	'openai/gpt-4o-mini',
	'openai/o1-mini',
	'anthropic/claude-3-5-sonnet',
	'anthropic/claude-3-haiku',
]);

/** Models known to be good for chat/conversational tasks */
const CHAT_CAPABLE = new Set([
	'google/gemini-2.0-flash-001',
	'google/gemini-2.5-flash-preview',
	'google/gemini-2.5-pro-preview',
	'google/gemini-flash-1.5',
	'google/gemini-pro-1.5',
	'google/gemma-3-27b-it',
	'google/gemma-3-27b-it:free',
	'google/gemma-2-27b-it',
	'anthropic/claude-3-5-sonnet',
	'anthropic/claude-sonnet-4',
	'anthropic/claude-3-haiku',
	'anthropic/claude-3-opus',
	'meta-llama/llama-3.2-11b-vision-instruct:free',
	'meta-llama/llama-3.1-8b-instruct:free',
	'deepseek/deepseek-r1',
	'deepseek/deepseek-r1:free',
	'openai/gpt-4o',
	'openai/gpt-4o-mini',
]);

function getTags(modelId: string, price: number, contextLength: number): string[] {
	const tags: string[] = [];
	if (price === 0) tags.push('free');
	else if (price < 0.5) tags.push('cheap');
	else if (price < 2) tags.push('mid-range');
	else tags.push('premium');
	if (contextLength >= 128000) tags.push('large-context');
	if (modelId.includes('flash')) tags.push('fast');
	if (modelId.includes('vision')) tags.push('vision');
	if (modelId.includes('deepseek-r1') || modelId.includes('o1')) tags.push('reasoning');
	if (modelId.includes('gemini-2.5') || modelId.includes('claude-3-5') || modelId.includes('claude-sonnet-4') || modelId.includes('gpt-4o')) tags.push('top-tier');
	return tags;
}

function getCategory(modelId: string): 'chat' | 'agent' | 'both' {
	const isChat = CHAT_CAPABLE.has(modelId) || CHAT_CAPABLE.has(modelId.replace(':free', ''));
	const isAgent = AGENT_CAPABLE.has(modelId) || AGENT_CAPABLE.has(modelId.replace(':free', ''));
	if (isChat && isAgent) return 'both';
	if (isAgent) return 'agent';
	return 'chat'; // default to chat for unknown models
}

function formatPrice(pricePerToken: string | number): string {
	const n = Number(pricePerToken ?? 0);
	if (n === 0) return 'Free';
	const per1M = n * 1_000_000;
	return `$${per1M.toFixed(per1M < 0.1 ? 3 : 2)}`;
}

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const hasApiKey = !!env.OPENROUTER_API_KEY;

	// Return cached result if still fresh
	if (modelsCache && Date.now() < modelsCacheExpiry) {
		return json({ models: modelsCache, hasApiKey });
	}

	if (!hasApiKey) {
		// No API key — return a curated static list so the admin can still see options
		const staticModels = buildStaticModelList();
		return json({ models: staticModels, hasApiKey: false });
	}

	try {
		const res = await fetch('https://openrouter.ai/api/v1/models', {
			headers: {
				Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
				'Content-Type': 'application/json'
			},
			signal: AbortSignal.timeout(10000)
		});

		if (!res.ok) {
			return json({ models: buildStaticModelList(), hasApiKey, warning: 'Could not fetch live model list from OpenRouter' });
		}

		const data = await res.json() as { data: Array<{
			id: string;
			name: string;
			description?: string;
			context_length?: number;
			pricing?: { prompt?: string | number; completion?: string | number };
		}> };

		const models: OpenRouterModel[] = (data.data ?? [])
			.map((m) => {
				const promptPrice = Number(m.pricing?.prompt ?? 0);
				const completionPrice = Number(m.pricing?.completion ?? 0);
				return {
					id: m.id,
					name: m.name ?? m.id,
					description: m.description ?? '',
					contextLength: m.context_length ?? 4096,
					promptPrice: formatPrice(promptPrice),
					completionPrice: formatPrice(completionPrice),
					isFree: promptPrice === 0 && completionPrice === 0,
					category: getCategory(m.id),
					tags: getTags(m.id, promptPrice * 1_000_000, m.context_length ?? 4096)
				};
			})
			// Sort: free first, then by name
			.sort((a, b) => {
				if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
				return a.name.localeCompare(b.name);
			});

		modelsCache = models;
		modelsCacheExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

		return json({ models, hasApiKey });
	} catch {
		return json({ models: buildStaticModelList(), hasApiKey, warning: 'OpenRouter request timed out — showing curated list' });
	}
};

/** Curated static list used when OpenRouter API is unreachable */
function buildStaticModelList(): OpenRouterModel[] {
	return [
		// ── Free models ───────────────────────────────────────────────────────
		{ id: 'google/gemma-3-27b-it:free', name: 'Gemma 3 27B (Free)', description: 'Google\'s Gemma 3 27B — free tier. Great for chat and faith-based conversations.', contextLength: 96000, promptPrice: 'Free', completionPrice: 'Free', isFree: true, category: 'chat', tags: ['free', 'large-context'] },
		{ id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Free)', description: 'DeepSeek\'s powerful reasoning model — free tier. Excellent for structured tasks.', contextLength: 163840, promptPrice: 'Free', completionPrice: 'Free', isFree: true, category: 'both', tags: ['free', 'reasoning', 'large-context'] },
		{ id: 'deepseek/deepseek-chat:free', name: 'DeepSeek Chat (Free)', description: 'DeepSeek Chat — free tier. Fast and capable.', contextLength: 65536, promptPrice: 'Free', completionPrice: 'Free', isFree: true, category: 'both', tags: ['free'] },
		{ id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'Llama 3.1 8B (Free)', description: 'Meta\'s Llama 3.1 8B — free. Lightweight and fast.', contextLength: 131072, promptPrice: 'Free', completionPrice: 'Free', isFree: true, category: 'chat', tags: ['free', 'fast', 'large-context'] },
		{ id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', description: 'Mistral 7B Instruct — free. Reliable for structured tasks.', contextLength: 32768, promptPrice: 'Free', completionPrice: 'Free', isFree: true, category: 'both', tags: ['free'] },
		// ── Cheap / recommended ───────────────────────────────────────────────
		{ id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash ⭐', description: 'Google\'s latest fast model. Excellent quality for the price. Recommended for chat.', contextLength: 1048576, promptPrice: '$0.10', completionPrice: '$0.40', isFree: false, category: 'chat', tags: ['fast', 'cheap', 'large-context', 'top-tier'] },
		{ id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash Preview', description: 'Newer, smarter Gemini Flash — slightly higher cost but significantly better.', contextLength: 1048576, promptPrice: '$0.15', completionPrice: '$0.60', isFree: false, category: 'chat', tags: ['fast', 'cheap', 'large-context', 'top-tier'] },
		{ id: 'deepseek/deepseek-r1', name: 'DeepSeek R1 ⭐', description: 'Near-GPT-4 quality reasoning. Recommended for agent/structured tasks at low cost.', contextLength: 163840, promptPrice: '$0.55', completionPrice: '$2.19', isFree: false, category: 'both', tags: ['reasoning', 'large-context', 'top-tier'] },
		{ id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', description: 'Previous Gemini Flash — very fast and cheap.', contextLength: 1000000, promptPrice: '$0.08', completionPrice: '$0.30', isFree: false, category: 'chat', tags: ['fast', 'cheap', 'large-context'] },
		{ id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', description: 'Meta\'s best open-source model. Strong for both chat and structured tasks.', contextLength: 131072, promptPrice: '$0.30', completionPrice: '$0.39', isFree: false, category: 'both', tags: ['cheap', 'large-context'] },
		{ id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'OpenAI\'s affordable fast model. Good balance of quality and cost.', contextLength: 128000, promptPrice: '$0.15', completionPrice: '$0.60', isFree: false, category: 'both', tags: ['fast', 'cheap', 'large-context'] },
		// ── Premium models ────────────────────────────────────────────────────
		{ id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4', description: 'Anthropic\'s best model for nuanced conversations. Exceptional for theological discussions.', contextLength: 200000, promptPrice: '$3.00', completionPrice: '$15.00', isFree: false, category: 'both', tags: ['premium', 'large-context', 'top-tier'] },
		{ id: 'openai/gpt-4o', name: 'GPT-4o', description: 'OpenAI\'s flagship model. Best overall quality.', contextLength: 128000, promptPrice: '$2.50', completionPrice: '$10.00', isFree: false, category: 'both', tags: ['premium', 'large-context', 'top-tier'] },
		{ id: 'google/gemini-2.5-pro-preview', name: 'Gemini 2.5 Pro Preview', description: 'Google\'s top model. Excellent for complex reasoning and long context.', contextLength: 1048576, promptPrice: '$1.25', completionPrice: '$10.00', isFree: false, category: 'both', tags: ['premium', 'large-context', 'top-tier', 'reasoning'] },
	];
}
