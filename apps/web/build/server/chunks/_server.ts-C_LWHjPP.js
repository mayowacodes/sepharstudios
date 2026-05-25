import { j as json } from './index-BcOZ6EV9.js';
import { p as private_env } from './shared-server-BeisX7n9.js';
import { d as db, c as user } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

let modelsCache = null;
let modelsCacheExpiry = 0;
async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}
const AGENT_CAPABLE = /* @__PURE__ */ new Set([
  "deepseek/deepseek-r1",
  "deepseek/deepseek-r1:free",
  "deepseek/deepseek-chat",
  "deepseek/deepseek-chat:free",
  "nousresearch/hermes-3-llama-3.1-405b:extended",
  "nousresearch/hermes-3-llama-3.1-70b",
  "meta-llama/llama-3.3-70b-instruct",
  "meta-llama/llama-3.1-70b-instruct",
  "meta-llama/llama-3.1-405b-instruct",
  "mistralai/mixtral-8x7b-instruct",
  "mistralai/mistral-7b-instruct",
  "mistralai/mistral-7b-instruct:free",
  "mistralai/codestral-mamba",
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  "openai/o1-mini",
  "anthropic/claude-3-5-sonnet",
  "anthropic/claude-3-haiku"
]);
const CHAT_CAPABLE = /* @__PURE__ */ new Set([
  "google/gemini-2.0-flash-001",
  "google/gemini-2.5-flash-preview",
  "google/gemini-2.5-pro-preview",
  "google/gemini-flash-1.5",
  "google/gemini-pro-1.5",
  "google/gemma-3-27b-it",
  "google/gemma-3-27b-it:free",
  "google/gemma-2-27b-it",
  "anthropic/claude-3-5-sonnet",
  "anthropic/claude-sonnet-4",
  "anthropic/claude-3-haiku",
  "anthropic/claude-3-opus",
  "meta-llama/llama-3.2-11b-vision-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "deepseek/deepseek-r1",
  "deepseek/deepseek-r1:free",
  "openai/gpt-4o",
  "openai/gpt-4o-mini"
]);
function getTags(modelId, price, contextLength) {
  const tags = [];
  if (price === 0) tags.push("free");
  else if (price < 0.5) tags.push("cheap");
  else if (price < 2) tags.push("mid-range");
  else tags.push("premium");
  if (contextLength >= 128e3) tags.push("large-context");
  if (modelId.includes("flash")) tags.push("fast");
  if (modelId.includes("vision")) tags.push("vision");
  if (modelId.includes("deepseek-r1") || modelId.includes("o1")) tags.push("reasoning");
  if (modelId.includes("gemini-2.5") || modelId.includes("claude-3-5") || modelId.includes("claude-sonnet-4") || modelId.includes("gpt-4o")) tags.push("top-tier");
  return tags;
}
function getCategory(modelId) {
  const isChat = CHAT_CAPABLE.has(modelId) || CHAT_CAPABLE.has(modelId.replace(":free", ""));
  const isAgent = AGENT_CAPABLE.has(modelId) || AGENT_CAPABLE.has(modelId.replace(":free", ""));
  if (isChat && isAgent) return "both";
  if (isAgent) return "agent";
  return "chat";
}
function formatPrice(pricePerToken) {
  const n = Number(pricePerToken ?? 0);
  if (n === 0) return "Free";
  const per1M = n * 1e6;
  return `$${per1M.toFixed(per1M < 0.1 ? 3 : 2)}`;
}
const GET = async ({ locals }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  const hasApiKey = !!private_env.OPENROUTER_API_KEY;
  if (modelsCache && Date.now() < modelsCacheExpiry) {
    return json({ models: modelsCache, hasApiKey });
  }
  if (!hasApiKey) {
    const staticModels = buildStaticModelList();
    return json({ models: staticModels, hasApiKey: false });
  }
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        Authorization: `Bearer ${private_env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      signal: AbortSignal.timeout(1e4)
    });
    if (!res.ok) {
      return json({ models: buildStaticModelList(), hasApiKey, warning: "Could not fetch live model list from OpenRouter" });
    }
    const data = await res.json();
    const models = (data.data ?? []).map((m) => {
      const promptPrice = Number(m.pricing?.prompt ?? 0);
      const completionPrice = Number(m.pricing?.completion ?? 0);
      return {
        id: m.id,
        name: m.name ?? m.id,
        description: m.description ?? "",
        contextLength: m.context_length ?? 4096,
        promptPrice: formatPrice(promptPrice),
        completionPrice: formatPrice(completionPrice),
        isFree: promptPrice === 0 && completionPrice === 0,
        category: getCategory(m.id),
        tags: getTags(m.id, promptPrice * 1e6, m.context_length ?? 4096)
      };
    }).sort((a, b) => {
      if (a.isFree !== b.isFree) return a.isFree ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    modelsCache = models;
    modelsCacheExpiry = Date.now() + 60 * 60 * 1e3;
    return json({ models, hasApiKey });
  } catch {
    return json({ models: buildStaticModelList(), hasApiKey, warning: "OpenRouter request timed out — showing curated list" });
  }
};
function buildStaticModelList() {
  return [
    // ── Free models ───────────────────────────────────────────────────────
    { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B (Free)", description: "Google's Gemma 3 27B — free tier. Great for chat and faith-based conversations.", contextLength: 96e3, promptPrice: "Free", completionPrice: "Free", isFree: true, category: "chat", tags: ["free", "large-context"] },
    { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 (Free)", description: "DeepSeek's powerful reasoning model — free tier. Excellent for structured tasks.", contextLength: 163840, promptPrice: "Free", completionPrice: "Free", isFree: true, category: "both", tags: ["free", "reasoning", "large-context"] },
    { id: "deepseek/deepseek-chat:free", name: "DeepSeek Chat (Free)", description: "DeepSeek Chat — free tier. Fast and capable.", contextLength: 65536, promptPrice: "Free", completionPrice: "Free", isFree: true, category: "both", tags: ["free"] },
    { id: "meta-llama/llama-3.1-8b-instruct:free", name: "Llama 3.1 8B (Free)", description: "Meta's Llama 3.1 8B — free. Lightweight and fast.", contextLength: 131072, promptPrice: "Free", completionPrice: "Free", isFree: true, category: "chat", tags: ["free", "fast", "large-context"] },
    { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B (Free)", description: "Mistral 7B Instruct — free. Reliable for structured tasks.", contextLength: 32768, promptPrice: "Free", completionPrice: "Free", isFree: true, category: "both", tags: ["free"] },
    // ── Cheap / recommended ───────────────────────────────────────────────
    { id: "google/gemini-2.0-flash-001", name: "Gemini 2.0 Flash ⭐", description: "Google's latest fast model. Excellent quality for the price. Recommended for chat.", contextLength: 1048576, promptPrice: "$0.10", completionPrice: "$0.40", isFree: false, category: "chat", tags: ["fast", "cheap", "large-context", "top-tier"] },
    { id: "google/gemini-2.5-flash-preview", name: "Gemini 2.5 Flash Preview", description: "Newer, smarter Gemini Flash — slightly higher cost but significantly better.", contextLength: 1048576, promptPrice: "$0.15", completionPrice: "$0.60", isFree: false, category: "chat", tags: ["fast", "cheap", "large-context", "top-tier"] },
    { id: "deepseek/deepseek-r1", name: "DeepSeek R1 ⭐", description: "Near-GPT-4 quality reasoning. Recommended for agent/structured tasks at low cost.", contextLength: 163840, promptPrice: "$0.55", completionPrice: "$2.19", isFree: false, category: "both", tags: ["reasoning", "large-context", "top-tier"] },
    { id: "google/gemini-flash-1.5", name: "Gemini Flash 1.5", description: "Previous Gemini Flash — very fast and cheap.", contextLength: 1e6, promptPrice: "$0.08", completionPrice: "$0.30", isFree: false, category: "chat", tags: ["fast", "cheap", "large-context"] },
    { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", description: "Meta's best open-source model. Strong for both chat and structured tasks.", contextLength: 131072, promptPrice: "$0.30", completionPrice: "$0.39", isFree: false, category: "both", tags: ["cheap", "large-context"] },
    { id: "openai/gpt-4o-mini", name: "GPT-4o Mini", description: "OpenAI's affordable fast model. Good balance of quality and cost.", contextLength: 128e3, promptPrice: "$0.15", completionPrice: "$0.60", isFree: false, category: "both", tags: ["fast", "cheap", "large-context"] },
    // ── Premium models ────────────────────────────────────────────────────
    { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4", description: "Anthropic's best model for nuanced conversations. Exceptional for theological discussions.", contextLength: 2e5, promptPrice: "$3.00", completionPrice: "$15.00", isFree: false, category: "both", tags: ["premium", "large-context", "top-tier"] },
    { id: "openai/gpt-4o", name: "GPT-4o", description: "OpenAI's flagship model. Best overall quality.", contextLength: 128e3, promptPrice: "$2.50", completionPrice: "$10.00", isFree: false, category: "both", tags: ["premium", "large-context", "top-tier"] },
    { id: "google/gemini-2.5-pro-preview", name: "Gemini 2.5 Pro Preview", description: "Google's top model. Excellent for complex reasoning and long context.", contextLength: 1048576, promptPrice: "$1.25", completionPrice: "$10.00", isFree: false, category: "both", tags: ["premium", "large-context", "top-tier", "reasoning"] }
  ];
}

export { GET };
//# sourceMappingURL=_server.ts-C_LWHjPP.js.map
