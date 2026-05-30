import { r as callChat, t as SEPHAR_SYSTEM_PROMPT } from "../../../../../chunks/ai-provider.js";
import { i as enforceRateLimit, n as AI_CHAT_LIMIT } from "../../../../../chunks/rate-limit.js";
import { error, json } from "@sveltejs/kit";
//#region src/lib/server/ai-companion.ts
var COMPANION_SYSTEM = (ctx) => `
${SEPHAR_SYSTEM_PROMPT}

You are the Watch Companion for this content:
- Title: "${ctx.contentTitle}"
- Type: ${ctx.contentType}
- Description: "${ctx.contentDescription}"
${ctx.bibleReference ? `- Bible Reference: ${ctx.bibleReference}` : ""}
${ctx.genres?.length ? `- Genres: ${ctx.genres.join(", ")}` : ""}
${ctx.topics?.length ? `- Themes: ${ctx.topics.join(", ")}` : ""}

Your role: Help viewers understand this content more deeply. 
Answer questions about scenes, characters, themes, and faith lessons.
Provide biblical context when relevant. Keep answers warm, clear, 
and under 200 words unless the question demands a longer response.
Suggest 2–3 follow-up questions the viewer might find interesting.

Always respond in this JSON format:
{
  "answer": "Your response here...",
  "suggestedFollowUps": ["What does this mean for...?", "How does this relate to...?"]
}
`.trim();
async function askCompanion(context, history, userMessage) {
	const recentHistory = history.slice(-6);
	const result = await callChat([
		{
			role: "system",
			content: COMPANION_SYSTEM(context)
		},
		...recentHistory.map((m) => ({
			role: m.role,
			content: m.content
		})),
		{
			role: "user",
			content: userMessage
		}
	], {
		provider: "openrouter",
		temperature: .4,
		maxTokens: 512,
		timeoutMs: 2e4
	});
	if (!result) return null;
	try {
		const jsonMatch = result.content.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]);
			return {
				answer: parsed.answer ?? result.content,
				suggestedFollowUps: parsed.suggestedFollowUps ?? [],
				aiProvider: `${result.provider}/${result.model}`
			};
		}
	} catch {}
	return {
		answer: result.content,
		suggestedFollowUps: [],
		aiProvider: `${result.provider}/${result.model}`
	};
}
async function getSceneInsight(contentTitle, bibleReference, sceneDescription) {
	return (await callChat([{
		role: "system",
		content: SEPHAR_SYSTEM_PROMPT
	}, {
		role: "user",
		content: `Provide a brief faith-based insight for this scene from "${contentTitle}".
${bibleReference ? `The main Bible reference is: ${bibleReference}` : ""}

Scene context: "${sceneDescription}"

Write 2–3 sentences explaining the spiritual lesson or biblical principle shown. 
Be warm, accessible, and faith-affirming. No JSON needed — plain text only.`
	}], {
		temperature: .5,
		maxTokens: 200
	}))?.content ?? null;
}
//#endregion
//#region src/routes/api/ai/companion/+server.ts
/**
* POST /api/ai/companion
*
* Modes:
*   'chat'         → conversation about a specific piece of content (requires contentTitle + contentDescription)
*   'scene_insight'→ short scene explanation (requires contentTitle + sceneDescription)
*   'general'      → floating copilot with no specific content context (no content fields required)
*
* Body:
*   { mode?, message, history?,
*     contentTitle?, contentDescription?, bibleReference?, genres?, topics?, contentType?,
*     sceneDescription? }
*/
var POST = async ({ request, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	await enforceRateLimit(`ai:companion:${locals.user.id}`, AI_CHAT_LIMIT);
	const { contentTitle, contentDescription, bibleReference = "", genres = [], topics = [], contentType = "movie", history = [], message, sceneDescription, mode = "chat" } = await request.json();
	if (mode === "scene_insight") {
		if (!contentTitle) throw error(400, "contentTitle required for scene_insight mode");
		if (!sceneDescription) throw error(400, "sceneDescription required for scene_insight mode");
		const insight = await getSceneInsight(contentTitle, bibleReference, sceneDescription);
		if (!insight) throw error(503, "AI service unavailable");
		return json({ insight });
	}
	if (!message?.trim()) throw error(400, "message is required");
	if (mode === "general") {
		const response = await askCompanion({
			contentTitle: "Sephar Studios",
			contentDescription: "A faith-based streaming platform featuring Christian movies, documentaries, sermons, and family content from creators around the world.",
			contentType: "platform",
			bibleReference: "",
			genres: [
				"Drama",
				"Documentary",
				"Worship",
				"Sermon",
				"Kids"
			],
			topics: [
				"Faith",
				"Redemption",
				"Family",
				"Prayer",
				"Scripture",
				"Christian Living"
			]
		}, history, message);
		if (!response) throw error(503, "AI service unavailable — try again shortly");
		return json(response);
	}
	if (!contentTitle || !contentDescription) throw error(400, "contentTitle and contentDescription are required for chat mode");
	const response = await askCompanion({
		contentTitle,
		contentDescription,
		bibleReference,
		genres,
		topics,
		contentType
	}, history, message);
	if (!response) throw error(503, "AI service unavailable — try again shortly");
	return json(response);
};
//#endregion
export { POST };
