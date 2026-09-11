import { p as private_env } from './index.js-BP8aAXBX.js';
import { g as getAIConfig } from './ai-settings-D6n_XJi6.js';
import { createOpenAI } from '@ai-sdk/openai';

//#region src/lib/server/ai-model.ts
var OPENROUTER_HEADERS = {
	"HTTP-Referer": "https://sepharstudios.com",
	"X-Title": "Sephar Studios AI"
};
async function resolveModel(modelType) {
	const aiConfig = await getAIConfig().catch(() => null);
	const preference = aiConfig?.providerPreference ?? "auto";
	const wantOpenRouter = preference === "openrouter" || preference === "auto";
	const wantOllama = preference === "ollama" || preference === "auto";
	if (wantOpenRouter && private_env.OPENROUTER_API_KEY) {
		const modelId = modelType === "agent" ? aiConfig?.agentModel ?? private_env.OPENROUTER_AGENT_MODEL ?? "meta-llama/llama-3.1-70b-instruct:free" : aiConfig?.chatModel ?? private_env.OPENROUTER_CHAT_MODEL ?? "google/gemma-2-9b-it:free";
		return {
			model: createOpenAI({
				baseURL: "https://openrouter.ai/api/v1",
				apiKey: private_env.OPENROUTER_API_KEY,
				headers: OPENROUTER_HEADERS
			})(modelId),
			provider: "openrouter",
			modelId
		};
	}
	if (wantOllama && private_env.OLLAMA_URL) {
		const modelId = modelType === "agent" ? aiConfig?.ollamaAgentModel ?? private_env.OLLAMA_AGENT_MODEL ?? "hermes3" : aiConfig?.ollamaChatModel ?? private_env.OLLAMA_CHAT_MODEL ?? "gemma4";
		return {
			model: createOpenAI({
				baseURL: `${private_env.OLLAMA_URL.replace(/\/$/, "")}/v1`,
				apiKey: "ollama"
			})(modelId),
			provider: "ollama",
			modelId
		};
	}
	throw new Error("No AI provider available. Set OPENROUTER_API_KEY (recommended — works with :free models without credit) or OLLAMA_URL (requires `ollama pull <model>` for each model). Configure /admin/settings to change model ids.");
}
/**
* Returns a Vercel AI SDK `LanguageModel` for `streamText()` to consume.
* Throws if no provider is reachable.
*/
async function getAiModel(modelType) {
	return resolveModel(modelType);
}

export { getAiModel as g };
//# sourceMappingURL=ai-model-6N-Tpipn.js.map
