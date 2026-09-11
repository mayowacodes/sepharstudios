import { R as Role } from './constants-BiiFHz9b.js';
import { r as runAi } from './ai-2aiw5bTG.js';
import { j as json } from './index.js-CxPEndTa.js';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';
import './drizzle-C3SH12nS.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-DtG_2Y9V.js';
import './ai-settings-DXSDeAyP.js';

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
//# sourceMappingURL=_server.ts-DocV2z1y.js.map
