import { t as runAi } from "../../../../../../chunks/ai.js";
import { json } from "@sveltejs/kit";
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
//#endregion
export { POST };
