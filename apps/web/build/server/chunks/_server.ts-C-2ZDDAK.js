import { r as runAi } from './ai-bbaOpgyC.js';
import { j as json } from './index-Cv5VcsYq.js';
import './shared-server-DUDL94jl.js';
import './drizzle-CKUH7ukq.js';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-ZmR1UjfK.js';
import './ai-settings-b9zX_Yow.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/ai/admin/draft-message/+server.ts
/**
* POST /api/ai/admin/draft-message
*
* Body: { intent, context?, tone? }
* Returns: { subject: string, message: string }
*
* Drafts an admin-to-creator message. Admin reviews + edits before sending
* through the existing /api/admin/communications endpoint. No autonomy.
*/
var POST = async ({ locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const intent = body.intent?.trim() ?? "";
	if (!intent) return json({ error: "intent is required" }, { status: 400 });
	const result = await runAi({
		userId: locals.user.id,
		surface: "admin:draft-message",
		modelType: "chat",
		temperature: .5,
		maxTokens: 400,
		messages: [{
			role: "system",
			content: "You draft admin messages to creators on a Christian streaming platform. Professional, warm, never preachy."
		}, {
			role: "user",
			content: `Draft a message from admin to creator.

Intent: ${intent}
${body.context ? `Context:\n"""${body.context.slice(0, 1500)}"""` : ""}
Tone: ${body.tone ?? "friendly"}

Return as two plain-text blocks separated by an empty line:
Line 1: subject (max 80 chars)
(empty line)
Body (1-3 paragraphs, max 600 chars total)`
		}]
	});
	if (!result.ok) {
		const status = result.error === "budget_exceeded" ? 429 : 503;
		return json({ error: result.message }, { status });
	}
	const lines = result.content.trim().split(/\r?\n/);
	return json({
		subject: (lines[0] ?? "").trim().slice(0, 200),
		message: lines.slice(1).join("\n").trim().slice(0, 2e3)
	});
};

export { POST };
//# sourceMappingURL=_server.ts-C-2ZDDAK.js.map
