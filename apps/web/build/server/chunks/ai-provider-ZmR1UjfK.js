import { p as private_env } from './shared-server-DUDL94jl.js';
import { g as getAIConfig } from './ai-settings-b9zX_Yow.js';

//#region src/lib/server/ai-provider.ts
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
	if (provider === "openrouter") {
		if (!private_env.OPENROUTER_API_KEY) return null;
		return tryOpenRouter(messages, callOptions);
	}
	if (provider === "ollama" || provider === "auto") {
		if (private_env.OLLAMA_URL) {
			const ollamaResult = await tryOllama(messages, callOptions);
			if (ollamaResult) return ollamaResult;
		}
		if (private_env.OPENROUTER_API_KEY) return tryOpenRouter(messages, callOptions);
	}
	return null;
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

export { SEPHAR_SYSTEM_PROMPT as S, callChat as a, extractJsonObject as b, callAgent as c, extractJsonArray as e };
//# sourceMappingURL=ai-provider-ZmR1UjfK.js.map
