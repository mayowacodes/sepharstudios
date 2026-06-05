import { R as Role } from './constants-BEpeHz1K.js';
import { r as runAi } from './ai-bbaOpgyC.js';
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
//# sourceMappingURL=_server.ts-DOr4ve3R.js.map
