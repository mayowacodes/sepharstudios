import { r as callChat, t as SEPHAR_SYSTEM_PROMPT } from "../../../../../chunks/ai-provider.js";
import { i as enforceRateLimit, n as AI_CHAT_LIMIT } from "../../../../../chunks/rate-limit.js";
import { t as getAiModel } from "../../../../../chunks/ai-model.js";
import { error, json } from "@sveltejs/kit";
import { streamText } from "ai";
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
/**
* Streaming variant of the companion prompt. The JSON envelope the
* blocking path uses ({"answer": ...}) can't be token-streamed — the
* viewer would watch JSON syntax type itself out. Instead the model
* writes the answer as plain prose and appends the follow-up
* suggestions AFTER a sentinel marker on the final line. The SSE
* endpoint holds back a small tail buffer while emitting tokens, so
* the marker never reaches the client as visible text; the parsed
* follow-ups ship in the terminal `done` event instead.
*/
var FOLLOWUPS_MARKER = "[[FOLLOWUPS]]";
var COMPANION_SYSTEM_STREAMING = (ctx) => `
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

Respond in PLAIN TEXT (no JSON, no markdown headings). After your
answer, on a new line, output exactly:
${FOLLOWUPS_MARKER} ["follow-up question 1", "follow-up question 2"]
with 2-3 short follow-up questions the viewer might find interesting.
`.trim();
/** Build the model message array for a streaming companion turn. */
function buildCompanionStreamMessages(context, history, userMessage) {
	const recentHistory = history.slice(-6);
	return [
		{
			role: "system",
			content: COMPANION_SYSTEM_STREAMING(context)
		},
		...recentHistory.map((m) => ({
			role: m.role,
			content: m.content
		})),
		{
			role: "user",
			content: userMessage
		}
	];
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
*   { mode?, message, history?, stream?,
*     contentTitle?, contentDescription?, bibleReference?, genres?, topics?, contentType?,
*     sceneDescription? }
*
* When `stream: true` (chat + general modes), the response is
* text/event-stream with these events:
*   status → {"label":"Thinking about your question…"} — a READY-TO-
*            DISPLAY human sentence. The client renders the string
*            verbatim; it never sees stage enums or JSON internals.
*   token  → {"text":"..."} incremental answer text (marker tail withheld)
*   done   → {"label":"Done","followUps":[...]} terminal event
*   error  → {"label":"Something went wrong — try again."}
* The legacy blocking JSON path stays for scene_insight + old clients.
*/
var POST = async ({ request, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	await enforceRateLimit(`ai:companion:${locals.user.id}`, AI_CHAT_LIMIT);
	const { contentTitle, contentDescription, bibleReference = "", genres = [], topics = [], contentType = "movie", history = [], message, sceneDescription, mode = "chat", stream = false } = await request.json();
	if (mode === "scene_insight") {
		if (!contentTitle) throw error(400, "contentTitle required for scene_insight mode");
		if (!sceneDescription) throw error(400, "sceneDescription required for scene_insight mode");
		const insight = await getSceneInsight(contentTitle, bibleReference, sceneDescription);
		if (!insight) throw error(503, "AI service unavailable");
		return json({ insight });
	}
	if (!message?.trim()) throw error(400, "message is required");
	if (stream === true) {
		const context = mode === "general" ? {
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
		} : {
			contentTitle: contentTitle ?? "",
			contentDescription: contentDescription ?? "",
			contentType,
			bibleReference,
			genres,
			topics
		};
		if (mode !== "general" && (!context.contentTitle || !context.contentDescription)) throw error(400, "contentTitle and contentDescription are required for chat mode");
		return streamCompanion(context, history, String(message), mode);
	}
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
/** Encode one SSE frame. */
function sseFrame(event, data) {
	return new TextEncoder().encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}
/**
* Stream a companion answer as SSE. Status events carry ready-to-display
* human sentences (never internal stage names) — the client renders the
* `label` string verbatim.
*
* The model appends `[[FOLLOWUPS]] [...]` after the answer (see
* ai-companion.ts). We withhold a small tail buffer from token emission
* so the marker never flashes on screen — even when a token boundary
* splits the marker itself — then parse the follow-ups out of the
* accumulated text for the terminal `done` event.
*/
function streamCompanion(context, history, message, mode) {
	const HOLDBACK = FOLLOWUPS_MARKER.length + 4;
	const thinkingLabel = mode === "general" ? "Thinking about your question…" : `Looking at "${context.contentTitle}" for you…`;
	const readable = new ReadableStream({ async start(controller) {
		const send = (event, data) => {
			try {
				controller.enqueue(sseFrame(event, data));
			} catch {}
		};
		send("status", { label: thinkingLabel });
		let resolved;
		try {
			resolved = await getAiModel("chat");
		} catch (err) {
			console.error("[companion/stream] no AI provider:", err);
			send("error", { label: "The assistant is unavailable right now — please try again in a moment." });
			controller.close();
			return;
		}
		try {
			const result = streamText({
				model: resolved.model,
				messages: buildCompanionStreamMessages(context, history, message),
				temperature: .4,
				maxOutputTokens: 512
			});
			let full = "";
			let emitted = 0;
			let markerAt = -1;
			let sentWriting = false;
			for await (const chunk of result.textStream) {
				if (!chunk) continue;
				full += chunk;
				if (!sentWriting) {
					sentWriting = true;
					send("status", { label: "Writing your answer…" });
				}
				if (markerAt === -1) markerAt = full.indexOf(FOLLOWUPS_MARKER);
				const visibleEnd = markerAt >= 0 ? markerAt : full.length - HOLDBACK;
				if (visibleEnd > emitted) {
					send("token", { text: full.slice(emitted, visibleEnd) });
					emitted = visibleEnd;
				}
			}
			if (markerAt === -1) markerAt = full.indexOf(FOLLOWUPS_MARKER);
			const answerEnd = markerAt >= 0 ? markerAt : full.length;
			if (answerEnd > emitted) send("token", { text: full.slice(emitted, answerEnd) });
			let followUps = [];
			if (markerAt >= 0) {
				const tail = full.slice(markerAt + FOLLOWUPS_MARKER.length);
				try {
					const arrMatch = tail.match(/\[[\s\S]*?\]/);
					if (arrMatch) {
						const parsed = JSON.parse(arrMatch[0]);
						if (Array.isArray(parsed)) followUps = parsed.filter((f) => typeof f === "string").slice(0, 3);
					}
				} catch {}
			}
			send("done", {
				label: "Done",
				followUps
			});
		} catch (err) {
			console.error("[companion/stream] stream failed:", err);
			send("error", { label: "Something went wrong while answering — please try again." });
		} finally {
			try {
				controller.close();
			} catch {}
		}
	} });
	return new Response(readable, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache, no-transform",
		Connection: "keep-alive",
		"X-Accel-Buffering": "no"
	} });
}
//#endregion
export { POST };
