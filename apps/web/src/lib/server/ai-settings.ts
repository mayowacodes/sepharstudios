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
 * Previously this had a 60-second in-memory cache per pod. We dropped it: with
 * multiple replicas the cache caused up to 60 seconds of inconsistency after
 * an admin changed the model, and the underlying query is a single indexed-row
 * select (~0.3 ms) so the cache was a premature optimisation.
 *
 * If we ever need a cache layer later, the right answer is Postgres
 * LISTEN/NOTIFY so every replica invalidates together.
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

/**
 * Get the current AI config from the DB. Falls back to DEFAULT_AI_CONFIG if
 * nothing is saved yet or the DB is unreachable.
 */
export async function getAIConfig(): Promise<AIConfig> {
	try {
		const row = await db.select().from(adminSettings).then((r) => r[0]);
		const platform = (row?.platform ?? {}) as Record<string, unknown>;
		const saved = platform.ai as Partial<AIConfig> | undefined;

		return {
			chatModel: (saved?.chatModel ?? DEFAULT_AI_CONFIG.chatModel) as string,
			agentModel: (saved?.agentModel ?? DEFAULT_AI_CONFIG.agentModel) as string,
			ollamaChatModel: (saved?.ollamaChatModel ?? DEFAULT_AI_CONFIG.ollamaChatModel) as string,
			ollamaAgentModel: (saved?.ollamaAgentModel ?? DEFAULT_AI_CONFIG.ollamaAgentModel) as string,
			providerPreference: (saved?.providerPreference ?? DEFAULT_AI_CONFIG.providerPreference) as AIConfig['providerPreference']
		};
	} catch {
		// DB unavailable — use defaults
		return { ...DEFAULT_AI_CONFIG };
	}
}

/** Save AI config into the admin_settings.platform JSONB column. */
export async function saveAIConfig(config: Partial<AIConfig>): Promise<void> {
	const existing = await db.select().from(adminSettings).then((r) => r[0]);

	const currentPlatform = (existing?.platform ?? {}) as Record<string, unknown>;
	const updatedPlatform = {
		...currentPlatform,
		ai: {
			...((currentPlatform.ai as object) ?? {}),
			...config
		}
	};

	if (existing) {
		await db.update(adminSettings).set({ platform: updatedPlatform, updatedAt: new Date() });
	} else {
		await db.insert(adminSettings).values({ platform: updatedPlatform });
	}
}

