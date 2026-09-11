import { r as runAi } from './ai-Ch8bXv3B.js';
import { j as json } from './index.js-BP8aAXBX.js';
import './drizzle-CsnNxG5m.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './ai-provider-DSZS7CVy.js';
import './ai-settings-D6n_XJi6.js';

//#region src/routes/api/ai/admin/summarize-application/+server.ts
/**
* POST /api/ai/admin/summarize-application
*
* Body: { text }
* Returns: { summary: string }
*
* Shrinks long creator applications down to a 3-bullet TL;DR. Plain text.
*/
var POST = async ({ locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const text = (await request.json().catch(() => ({}))).text?.trim() ?? "";
	if (!text) return json({ error: "text is required" }, { status: 400 });
	const result = await runAi({
		userId: locals.user.id,
		surface: "admin:summarize-application",
		modelType: "chat",
		temperature: .2,
		maxTokens: 320,
		messages: [{
			role: "system",
			content: "You summarize creator applications for admin review on a Christian streaming platform."
		}, {
			role: "user",
			content: `Summarize this creator application in 3 short bullets covering: ministry focus, content track record, and any flags worth a closer look.

Application: """${text.slice(0, 4e3)}"""

Return plain text (no JSON, no markdown headers). Each bullet on its own line, starting with "• ".`
		}]
	});
	if (!result.ok) {
		const status = result.error === "budget_exceeded" ? 429 : 503;
		return json({ error: result.message }, { status });
	}
	return json({ summary: result.content.trim().slice(0, 1500) });
};

export { POST };
//# sourceMappingURL=_server.ts-DQkRVhE8.js.map
