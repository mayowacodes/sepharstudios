import { json } from "@sveltejs/kit";
import { p as private_env } from "../../../../../../chunks/shared-server.js";
import { d as db, b as user } from "../../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
async function requireAdmin(locals) {
  const session = await locals.auth.getSession();
  if (!session) return { error: json({ error: "Unauthorized" }, { status: 401 }) };
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return { error: json({ error: "Forbidden" }, { status: 403 }) };
  return { error: null };
}
const CHAT_TEST_PROMPT = `You are an AI assistant for Sephar Studios, a faith-based streaming platform. 
Give me a 1-sentence description of what makes a great Christian movie.`;
const AGENT_TEST_PROMPT = `You are a content tagging AI for a faith-based streaming platform.
Tag this movie title: "The Redemption Story"

Respond in JSON only:
{"genres": ["string"], "themes": ["string"], "ageRating": "string", "faithScore": 0-100}`;
const POST = async ({ locals, request }) => {
  const { error } = await requireAdmin(locals);
  if (error) return error;
  if (!private_env.OPENROUTER_API_KEY) {
    return json({ error: "OPENROUTER_API_KEY is not configured in environment variables" }, { status: 503 });
  }
  const body = await request.json();
  const model = body.model?.trim();
  const type = body.type ?? "chat";
  if (!model) {
    return json({ error: "model is required" }, { status: 400 });
  }
  const prompt = type === "agent" ? AGENT_TEST_PROMPT : CHAT_TEST_PROMPT;
  const start = Date.now();
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${private_env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://sepharstudios.com",
        "X-Title": "Sephar Studios AI Admin Test"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      }),
      signal: AbortSignal.timeout(2e4)
    });
    const latencyMs = Date.now() - start;
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return json({
        error: errBody?.error?.message ?? `OpenRouter returned ${res.status}`,
        latencyMs
      }, { status: res.status >= 500 ? 503 : 400 });
    }
    const data = await res.json();
    const response = data?.choices?.[0]?.message?.content ?? "";
    return json({
      response,
      latencyMs,
      model: data?.model ?? model,
      provider: "openrouter"
    });
  } catch (e) {
    const latencyMs = Date.now() - start;
    const message = e instanceof Error ? e.message : "Request timed out or failed";
    return json({ error: message, latencyMs }, { status: 503 });
  }
};
export {
  POST
};
