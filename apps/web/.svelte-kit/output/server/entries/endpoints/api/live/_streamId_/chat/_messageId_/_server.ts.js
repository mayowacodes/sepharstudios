import { U as liveChatMessages, W as liveStreams, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as publish } from "../../../../../../../chunks/sse.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/live/[streamId]/chat/[messageId]/+server.ts
/**
* PATCH  /api/live/[streamId]/chat/[messageId] — pin / approve / hide
*   body: { action: 'pin' | 'unpin' | 'approve' | 'hide' }
* DELETE /api/live/[streamId]/chat/[messageId] — remove
*
* Creator-of-stream OR admin only.
*/
var ALLOWED_ACTIONS = new Set([
	"pin",
	"unpin",
	"approve",
	"hide"
]);
async function streamOwnerCheck(streamId, userId, role) {
	const [stream] = await db.select({ creatorId: liveStreams.creatorId }).from(liveStreams).where(eq(liveStreams.id, streamId)).limit(1);
	if (!stream) return {
		ok: false,
		status: 404
	};
	if (role !== "admin" && stream.creatorId !== userId) return {
		ok: false,
		status: 403
	};
	return { ok: true };
}
var PATCH = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const check = await streamOwnerCheck(params.streamId, session.user.id, session.user.role ?? null);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	const body = await request.json().catch(() => ({}));
	if (!body.action || !ALLOWED_ACTIONS.has(body.action)) return json({ error: "Invalid action" }, { status: 400 });
	const updates = {};
	if (body.action === "pin") updates.pinned = true;
	if (body.action === "unpin") updates.pinned = false;
	if (body.action === "approve") updates.status = "published";
	if (body.action === "hide") updates.status = "hidden";
	await db.update(liveChatMessages).set(updates).where(and(eq(liveChatMessages.id, params.messageId), eq(liveChatMessages.streamId, params.streamId)));
	publish(`live-chat:${params.streamId}`, {
		type: "update",
		id: params.messageId,
		...updates
	});
	publish(`live-chat-mod:${params.streamId}`, {
		type: "update",
		id: params.messageId,
		...updates
	});
	return json({ success: true });
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const check = await streamOwnerCheck(params.streamId, session.user.id, session.user.role ?? null);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	await db.update(liveChatMessages).set({ status: "removed" }).where(and(eq(liveChatMessages.id, params.messageId), eq(liveChatMessages.streamId, params.streamId)));
	publish(`live-chat:${params.streamId}`, {
		type: "removed",
		id: params.messageId
	});
	publish(`live-chat-mod:${params.streamId}`, {
		type: "removed",
		id: params.messageId
	});
	return json({ success: true });
};
//#endregion
export { DELETE, PATCH };
