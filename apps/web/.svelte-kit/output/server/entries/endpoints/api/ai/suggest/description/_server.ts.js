import { r as Role } from "../../../../../../chunks/constants.js";
import { n as tryParseJson, t as runAi } from "../../../../../../chunks/ai.js";
import { json } from "@sveltejs/kit";
//#region src/routes/api/ai/suggest/description/+server.ts
/**
* POST /api/ai/suggest/description
*
* Body: { title, contentType?, genres?, currentDescription? }
* Returns: { suggestions: string[] } — up to 3 candidates (2-3 sentences each)
*/
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const title = body.title?.trim() ?? "";
	if (!title) return json({ error: "title is required" }, { status: 400 });
	const result = await runAi({
		userId: session.user.id,
		surface: "creator:suggest-description",
		modelType: "agent",
		temperature: .6,
		maxTokens: 512,
		messages: [{
			role: "system",
			content: "You write descriptions for faith-based video content on a Christian streaming platform."
		}, {
			role: "user",
			content: `Generate 3 candidate descriptions.

Title: "${title}"
Type: ${body.contentType ?? "video"}
${body.genres && body.genres.length > 0 ? `Genres: ${body.genres.join(", ")}` : ""}

${body.currentDescription ? `Current description (refine this voice):\n"""${body.currentDescription.slice(0, 800)}"""\n` : ""}

Return ONLY this JSON:
{ "suggestions": ["Description 1", "Description 2", "Description 3"] }

Rules:
- 2-3 sentences each, max 280 characters
- Hook the viewer in the first sentence
- Mention what they will gain or learn
- Family-safe; reverent tone
- No SEO keyword stuffing`
		}]
	});
	if (!result.ok) {
		const status = result.error === "budget_exceeded" ? 429 : 503;
		return json({ error: result.message }, { status });
	}
	const parsed = tryParseJson(result.content);
	const suggestions = Array.isArray(parsed?.suggestions) ? parsed.suggestions.filter((s) => typeof s === "string").slice(0, 3) : [];
	if (suggestions.length === 0) return json({ error: "AI did not return valid suggestions" }, { status: 502 });
	return json({ suggestions });
};
//#endregion
export { POST };
