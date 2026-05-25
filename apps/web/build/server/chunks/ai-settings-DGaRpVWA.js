import { d as db, e as adminSettings } from './drizzle-CW7hPjGG.js';

const DEFAULT_AI_CONFIG = {
  chatModel: "google/gemini-2.0-flash-001",
  agentModel: "deepseek/deepseek-r1",
  ollamaChatModel: "gemma4",
  ollamaAgentModel: "hermes3",
  providerPreference: "auto"
};
let configCache = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 6e4;
async function getAIConfig() {
  const now = Date.now();
  if (configCache && now < cacheExpiry) return configCache;
  try {
    const row = await db.select().from(adminSettings).then((r) => r[0]);
    const platform = row?.platform ?? {};
    const saved = platform.ai;
    configCache = {
      chatModel: saved?.chatModel ?? DEFAULT_AI_CONFIG.chatModel,
      agentModel: saved?.agentModel ?? DEFAULT_AI_CONFIG.agentModel,
      ollamaChatModel: saved?.ollamaChatModel ?? DEFAULT_AI_CONFIG.ollamaChatModel,
      ollamaAgentModel: saved?.ollamaAgentModel ?? DEFAULT_AI_CONFIG.ollamaAgentModel,
      providerPreference: saved?.providerPreference ?? DEFAULT_AI_CONFIG.providerPreference
    };
  } catch {
    configCache = { ...DEFAULT_AI_CONFIG };
  }
  cacheExpiry = now + CACHE_TTL_MS;
  return configCache;
}
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
  if (existing) {
    await db.update(adminSettings).set({ platform: updatedPlatform, updatedAt: /* @__PURE__ */ new Date() });
  } else {
    await db.insert(adminSettings).values({ platform: updatedPlatform });
  }
  configCache = null;
  cacheExpiry = 0;
}

export { DEFAULT_AI_CONFIG as D, getAIConfig as g, saveAIConfig as s };
//# sourceMappingURL=ai-settings-DGaRpVWA.js.map
