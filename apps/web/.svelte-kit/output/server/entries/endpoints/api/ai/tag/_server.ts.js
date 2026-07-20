import { K as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { a as extractJsonObject, n as callAgent, t as SEPHAR_SYSTEM_PROMPT } from "../../../../../chunks/ai-provider.js";
import { i as enforceRateLimit, t as AI_AGENT_LIMIT } from "../../../../../chunks/rate-limit.js";
import { error, json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/lib/server/ai-tagging.ts
async function generateContentMetadata(title, description, contentType) {
	const result = await callAgent([{
		role: "system",
		content: SEPHAR_SYSTEM_PROMPT
	}, {
		role: "user",
		content: `Analyze this faith-based ${contentType} and return a JSON object with metadata.

Title: "${title}"
Description: "${description}"

Return ONLY this JSON structure, nothing else:
{
  "genres": ["Drama"],
  "topics": ["Redemption", "Faith"],
  "keywords": ["christian movie", "faith journey"],
  "moodTags": ["emotional", "uplifting"],
  "bibleReference": "Romans 8:28",
  "ageRating": "All",
  "shortDescription": "A compelling story about...",
  "sensitiveFlags": []
}

Rules:
- genres: 1–3 items from [Drama, Comedy, Documentary, Animation, Action, Romance, Thriller, Biography, Kids, Worship, Sermon]
- topics: 2–5 faith/life themes
- keywords: 4–8 SEO-friendly terms
- moodTags: 2–4 from [emotional, uplifting, thought-provoking, slow-burn, fast-paced, inspirational, heavy, light, family-friendly, intense]
- bibleReference: single most relevant Bible reference, or "" if none
- ageRating: one of "All", "7+", "12+", "16+"
- shortDescription: max 150 characters
- sensitiveFlags: content warnings if any, empty array if none`
	}], {
		temperature: .2,
		maxTokens: 512
	});
	if (!result) return null;
	const parsed = extractJsonObject(result.content);
	if (!parsed) return null;
	return {
		...parsed,
		aiProvider: `${result.provider}/${result.model}`
	};
}
//#endregion
//#region src/routes/api/ai/tag/+server.ts
/**
* POST /api/ai/tag
* Auto-generate metadata for a content item.
* Called from: encoder-ready webhook, creator upload flow, admin panel.
*
* Body: { contentId } — existing mediaLibrary record
*   OR: { title, description, contentType } — standalone generation
*
* If contentId is provided, metadata suggestions are saved back to the DB.
*/
var POST = async ({ request, locals }) => {
	if (!locals.user) throw error(401, "Unauthorized");
	await enforceRateLimit(`ai:tag:${locals.user.id}`, AI_AGENT_LIMIT);
	const { contentId, title, description, contentType = "movie" } = await request.json();
	let resolvedTitle = title;
	let resolvedDescription = description;
	let resolvedType = contentType;
	if (contentId) {
		const [content] = await db.select({
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			mediaType: mediaLibrary.mediaType
		}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
		if (!content) throw error(404, "Content not found");
		resolvedTitle = content.title;
		resolvedDescription = content.description ?? "";
		resolvedType = content.mediaType;
	}
	if (!resolvedTitle) throw error(400, "title is required");
	const metadata = await generateContentMetadata(resolvedTitle, resolvedDescription ?? "", resolvedType);
	if (!metadata) throw error(503, "AI tagging service unavailable");
	if (contentId) await db.update(mediaLibrary).set({
		genres: metadata.genres,
		topics: metadata.topics,
		keywords: metadata.keywords,
		bibleReference: metadata.bibleReference || void 0,
		ageRating: metadata.ageRating,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, contentId));
	return json({
		metadata,
		saved: !!contentId
	});
};
//#endregion
export { POST };
