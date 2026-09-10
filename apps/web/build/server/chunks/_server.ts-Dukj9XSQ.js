import { R as Role } from './constants-RccSloty.js';
import { r as runAi, t as tryParseJson } from './ai-CyoiIdCn.js';
import { j as json } from './index.js-DwRgOKlO.js';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';
import './drizzle-DlGuU73K.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-StSxp_t-.js';
import './ai-settings-Bn2doK5E.js';

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

export { POST };
//# sourceMappingURL=_server.ts-Dukj9XSQ.js.map
