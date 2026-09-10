import { R as Role } from './constants-RccSloty.js';
import { r as runAi } from './ai-CyoiIdCn.js';
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

//#region src/routes/api/ai/suggest/review-reply/+server.ts
/**
* POST /api/ai/suggest/review-reply
*
* Body: { reviewText, rating, contentTitle, tone? }
* Returns: { reply: string }
*
* Drafts a warm, professional reply to a viewer's review on the creator's
* content. Tone defaults to 'gracious'. Creator can edit + send.
*/
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const reviewText = body.reviewText?.trim() ?? "";
	const contentTitle = body.contentTitle?.trim() ?? "this video";
	const tone = body.tone ?? "gracious";
	if (!reviewText) return json({ error: "reviewText is required" }, { status: 400 });
	const result = await runAi({
		userId: session.user.id,
		surface: "creator:suggest-review-reply",
		modelType: "chat",
		temperature: .6,
		maxTokens: 256,
		messages: [{
			role: "system",
			content: "You are a Christian content creator replying to a viewer's review on your faith-based video. Be warm, specific, and humble."
		}, {
			role: "user",
			content: `Draft a reply to this review on "${contentTitle}".

Star rating: ${body.rating ?? "?"}/5
Review: """${reviewText.slice(0, 800)}"""

Tone: ${tone}

Rules:
- 1-2 sentences
- Address the reviewer warmly
- If criticism: acknowledge without being defensive
- If praise: thank them, don't gush
- Plain text — no JSON wrapper, no markdown`
		}]
	});
	if (!result.ok) {
		const status = result.error === "budget_exceeded" ? 429 : 503;
		return json({ error: result.message }, { status });
	}
	return json({ reply: result.content.trim().slice(0, 1e3) });
};

export { POST };
//# sourceMappingURL=_server.ts-CEZNGi4J.js.map
