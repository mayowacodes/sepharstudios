import { R as Role } from './constants-BEpeHz1K.js';
import { r as runAi, t as tryParseJson } from './ai-bbaOpgyC.js';
import { j as json } from './index-Cv5VcsYq.js';
import './ui-libs-BjzLDLAh.js';
import './rolldown-runtime-pTpnEGsq.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './shared-server-DUDL94jl.js';
import './drizzle-CKUH7ukq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-ZmR1UjfK.js';
import './ai-settings-b9zX_Yow.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/ai/suggest/title/+server.ts
/**
* POST /api/ai/suggest/title
*
* Body: { description, contentType?, currentTitle? }
* Returns: { suggestions: string[] } — up to 3 candidates
*/
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const description = body.description?.trim() ?? "";
	if (!description) return json({ error: "description is required" }, { status: 400 });
	const result = await runAi({
		userId: session.user.id,
		surface: "creator:suggest-title",
		modelType: "agent",
		temperature: .7,
		maxTokens: 256,
		messages: [{
			role: "system",
			content: "You write concise, compelling titles for faith-based video content on a Christian streaming platform."
		}, {
			role: "user",
			content: `Generate 3 candidate titles for a ${body.contentType ?? "video"}.

Description: """${description.slice(0, 1200)}"""

${body.currentTitle ? `Current title (improve on it): "${body.currentTitle}"` : ""}

Return ONLY this JSON:
{ "suggestions": ["Title 1", "Title 2", "Title 3"] }

Rules:
- 4-8 words each
- Clear, specific, evocative
- No clickbait, no all-caps
- Avoid generic words like "amazing" or "incredible"`
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
//# sourceMappingURL=_server.ts-Cx4S8rms.js.map
