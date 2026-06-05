import { w as db, g as adminSettings } from './drizzle-CKUH7ukq.js';

//#region src/lib/server/ai-settings.ts
var DEFAULT_AI_CONFIG = {
	chatModel: "google/gemini-2.0-flash-001",
	agentModel: "deepseek/deepseek-r1",
	ollamaChatModel: "gemma4",
	ollamaAgentModel: "hermes3",
	providerPreference: "auto"
};
/**
* Get the current AI config from the DB. Falls back to DEFAULT_AI_CONFIG if
* nothing is saved yet or the DB is unreachable.
*/
async function getAIConfig() {
	try {
		const saved = ((await db.select().from(adminSettings).then((r) => r[0]))?.platform ?? {}).ai;
		return {
			chatModel: saved?.chatModel ?? DEFAULT_AI_CONFIG.chatModel,
			agentModel: saved?.agentModel ?? DEFAULT_AI_CONFIG.agentModel,
			ollamaChatModel: saved?.ollamaChatModel ?? DEFAULT_AI_CONFIG.ollamaChatModel,
			ollamaAgentModel: saved?.ollamaAgentModel ?? DEFAULT_AI_CONFIG.ollamaAgentModel,
			providerPreference: saved?.providerPreference ?? DEFAULT_AI_CONFIG.providerPreference
		};
	} catch {
		return { ...DEFAULT_AI_CONFIG };
	}
}
/** Save AI config into the admin_settings.platform JSONB column. */
async function saveAIConfig(config) {
	const existing = await db.select().from(adminSettings).then((r) => r[0]);
	const currentPlatform = existing?.platform ?? {};
	const updatedPlatform = {
		...currentPlatform,
		ai: {
			...currentPlatform.ai ?? {},
			...config
		}
	};
	if (existing) await db.update(adminSettings).set({
		platform: updatedPlatform,
		updatedAt: /* @__PURE__ */ new Date()
	});
	else await db.insert(adminSettings).values({ platform: updatedPlatform });
}

export { DEFAULT_AI_CONFIG as D, getAIConfig as g, saveAIConfig as s };
//# sourceMappingURL=ai-settings-b9zX_Yow.js.map
