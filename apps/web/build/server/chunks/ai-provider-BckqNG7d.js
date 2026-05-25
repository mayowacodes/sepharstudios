import { p as private_env } from './shared-server-BeisX7n9.js';
import { g as getAIConfig } from './ai-settings-DGaRpVWA.js';

async function callAgent(messages, options = {}) {
  return callAI(messages, { ...options, modelType: "agent", provider: options.provider ?? "ollama" });
}
async function callChat(messages, options = {}) {
  return callAI(messages, { ...options, modelType: "chat", provider: options.provider ?? "auto" });
}
async function callAI(messages, options = {}) {
  const {
    provider = "auto",
    modelType = "chat",
    timeoutMs = 15e3,
    temperature = 0.3,
    maxTokens = 1024
  } = options;
  const callOptions = { timeoutMs, temperature, maxTokens, modelType };
  if (provider === "openrouter") {
    if (!private_env.OPENROUTER_API_KEY) return null;
    return tryOpenRouter(messages, callOptions);
  }
  if (provider === "ollama" || provider === "auto") {
    if (private_env.OLLAMA_URL) {
      const ollamaResult = await tryOllama(messages, callOptions);
      if (ollamaResult) return ollamaResult;
    }
    if (private_env.OPENROUTER_API_KEY) {
      return tryOpenRouter(messages, callOptions);
    }
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
    const data = await res.json();
    const content = data?.message?.content ?? "";
    if (!content.trim()) return null;
    return { content, provider: "ollama", model };
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
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    if (!content.trim()) return null;
    return { content, provider: "openrouter", model };
  } catch {
    return null;
  }
}
function extractJsonArray(text) {
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
function extractJsonObject(text) {
  const match = text.match(/\{[\s\S]*\}/) ?? text.match(/\{[\s\S]*?\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}
const SEPHAR_SYSTEM_PROMPT = `You are an AI assistant for Sephar Studios, a faith-based streaming platform for Christian movies, documentaries, and family content. Your responses should be respectful of Christian faith, theologically sensitive, and family-appropriate. Always return structured output (JSON) when asked. Be concise and accurate.`;

export { SEPHAR_SYSTEM_PROMPT as S, callAgent as a, extractJsonArray as b, callChat as c, extractJsonObject as e };
//# sourceMappingURL=ai-provider-BckqNG7d.js.map
