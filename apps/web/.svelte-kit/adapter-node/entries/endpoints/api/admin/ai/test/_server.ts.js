import { t as private_env } from "../../../../../../chunks/shared-server.js";
import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/admin/ai/test/+server.ts
/**
* POST /api/admin/ai/test
*
* Sends a quick test prompt to a specific model via OpenRouter and returns
* the response along with latency. Used from the Admin AI settings panel.
*
* Body: { model: string; type: 'chat' | 'agent' }
* Response: { response: string; latencyMs: number; model: string; provider: 'openrouter' }
*/
var CHAT_TEST_PROMPT = `You are an AI assistant for Sephar Studios, a faith-based streaming platform. 
Give me a 1-sentence description of what makes a great Christian movie.`;
var AGENT_TEST_PROMPT = `You are a content tagging AI for a faith-based streaming platform.
Tag this movie title: "The Redemption Story"

Respond in JSON only:
{"genres": ["string"], "themes": ["string"], "ageRating": "string", "faithScore": 0-100}`;
var POST = async ({ locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	if (!private_env.OPENROUTER_API_KEY) return json({ error: "OPENROUTER_API_KEY is not configured in environment variables" }, { status: 503 });
	const body = await request.json();
	const model = body.model?.trim();
	const type = body.type ?? "chat";
	if (!model) return json({ error: "model is required" }, { status: 400 });
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
				messages: [{
					role: "user",
					content: prompt
				}],
				temperature: .3,
				max_tokens: 200
			}),
			signal: AbortSignal.timeout(2e4)
		});
		const latencyMs = Date.now() - start;
		if (!res.ok) return json({
			error: (await res.json().catch(() => ({})))?.error?.message ?? `OpenRouter returned ${res.status}`,
			latencyMs
		}, { status: res.status >= 500 ? 503 : 400 });
		const data = await res.json();
		return json({
			response: data?.choices?.[0]?.message?.content ?? "",
			latencyMs,
			model: data?.model ?? model,
			provider: "openrouter"
		});
	} catch (e) {
		const latencyMs = Date.now() - start;
		return json({
			error: e instanceof Error ? e.message : "Request timed out or failed",
			latencyMs
		}, { status: 503 });
	}
};
//#endregion
export { POST };
