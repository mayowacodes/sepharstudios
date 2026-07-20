import { h as aiActionLog, t as db, w as copilotMessages } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/ai/copilot/approve/+server.ts
/**
* POST /api/ai/copilot/approve
*
* Confirms a previously-staged mutating Copilot action (previewBan,
* previewRefund, etc.). The streaming tool's `execute()` already inserted
* an `ai_action_log` row with `approved: false` and returned an
* `{ approval: 'required', actionId, ... }` payload that the UI rendered
* as a Confirm/Decline card. This endpoint flips `approved=true` and
* records the timestamp.
*
* The actual side effect (ban / refund) is NOT executed here — it routes
* through the existing admin endpoints (`/api/admin/users/:id/ban`,
* `/api/admin/refunds`, etc.). Keeping the Copilot non-mutating preserves
* the strict separation between "AI helper" and "platform mutation".
*
* Body: { actionId: string }
*/
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const body = await request.json().catch(() => ({}));
	if (!body.actionId) return json({ error: "actionId required" }, { status: 400 });
	const [row] = await db.select().from(aiActionLog).where(and(eq(aiActionLog.id, body.actionId), eq(aiActionLog.userId, session.user.id))).limit(1);
	if (!row) return json({ error: "Action not found" }, { status: 404 });
	if (row.approved) return json({ error: "Action already approved" }, { status: 400 });
	await db.update(aiActionLog).set({
		approved: true,
		executedAt: /* @__PURE__ */ new Date()
	}).where(eq(aiActionLog.id, body.actionId));
	if (row.conversationId) await db.insert(copilotMessages).values({
		conversationId: row.conversationId,
		role: "assistant",
		content: `✓ Approved ${row.tool}. To execute, use the corresponding admin surface (the Copilot does not directly mutate state).`
	});
	return json({
		ok: true,
		tool: row.tool,
		actionId: body.actionId
	});
};
//#endregion
export { POST };
