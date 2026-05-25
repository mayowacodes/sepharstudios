import { db } from '$lib/db/drizzle';
import { adminSettings } from '$lib/db/schema/sepharstudios';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * AI SETTINGS — Runtime model config stored in admin_settings DB
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * API keys stay in environment variables (Dokploy).
 * Model selection is stored in the DB so admins can change it without redeployment.
 *
 * Cache TTL = 60 seconds to avoid hitting the DB on every AI call.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface AIConfig {
	/** OpenRouter model ID for conversational tasks (copilot, scene insights) */
	chatModel: string;
	/** OpenRouter model ID for structured/agentic tasks (tagging, moderation, scoring, NFTs) */
	agentModel: string;
	/** OpenRouter model ID for local Ollama chat tasks */
	ollamaChatModel: string;
	/** OpenRouter model ID for local Ollama agent tasks */
	ollamaAgentModel: string;
	/** Provider routing preference */
	providerPreference: 'auto' | 'ollama' | 'openrouter';
}

export const DEFAULT_AI_CONFIG: AIConfig = {
	chatModel: 'google/gemini-2.0-flash-001',
	agentModel: 'deepseek/deepseek-r1',
	ollamaChatModel: 'gemma4',
	ollamaAgentModel: 'hermes3',
	providerPreference: 'auto'
};

// ── In-memory cache (avoids DB hit on every AI call) ─────────────────────────
let configCache: AIConfig | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 60_000; // 60 seconds

/**
 * Get the current AI config from the DB (cached for 60s).
 * Falls back to DEFAULT_AI_CONFIG if nothing is saved yet.
 */
export async function getAIConfig(): Promise<AIConfig> {
	const now = Date.now();
	if (configCache && now < cacheExpiry) return configCache;

	try {
		const row = await db.select().from(adminSettings).then(r => r[0]);
		const platform = (row?.platform ?? {}) as Record<string, unknown>;
		const saved = platform.ai as Partial<AIConfig> | undefined;

		configCache = {
			chatModel: (saved?.chatModel ?? DEFAULT_AI_CONFIG.chatModel) as string,
			agentModel: (saved?.agentModel ?? DEFAULT_AI_CONFIG.agentModel) as string,
			ollamaChatModel: (saved?.ollamaChatModel ?? DEFAULT_AI_CONFIG.ollamaChatModel) as string,
			ollamaAgentModel: (saved?.ollamaAgentModel ?? DEFAULT_AI_CONFIG.ollamaAgentModel) as string,
			providerPreference: (saved?.providerPreference ?? DEFAULT_AI_CONFIG.providerPreference) as AIConfig['providerPreference']
		};
	} catch {
		// DB unavailable — use defaults
		configCache = { ...DEFAULT_AI_CONFIG };
	}

	cacheExpiry = now + CACHE_TTL_MS;
	return configCache;
}

/**
 * Save AI config into the admin_settings.platform JSONB column.
 * Also busts the in-memory cache so the next call gets fresh data.
 */
export async function saveAIConfig(config: Partial<AIConfig>): Promise<void> {
	const existing = await db.select().from(adminSettings).then(r => r[0]);

	const currentPlatform = (existing?.platform ?? {}) as Record<string, unknown>;
	const updatedPlatform = {
		...currentPlatform,
		ai: {
			...(currentPlatform.ai as object ?? {}),
			...config
		}
	};

	if (existing) {
		await db
			.update(adminSettings)
			.set({ platform: updatedPlatform, updatedAt: new Date() });
	} else {
		await db.insert(adminSettings).values({ platform: updatedPlatform });
	}

	// Bust cache
	configCache = null;
	cacheExpiry = 0;
}

/** Manually bust the cache (e.g., after saving new settings) */
export function bustAIConfigCache(): void {
	configCache = null;
	cacheExpiry = 0;
}
