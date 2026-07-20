import { K as mediaLibrary, a as user, l as adminMessages, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as publish } from "../../../../../../../chunks/sse.js";
import { t as notify } from "../../../../../../../chunks/notify.js";
import { json } from "@sveltejs/kit";
import { asc, eq, inArray } from "drizzle-orm";
//#region src/routes/api/admin/content/[id]/thread/+server.ts
/**
* GET  /api/admin/content/[id]/thread
* POST /api/admin/content/[id]/thread
*
* Admin-facing thread on a specific content row. Reuses `admin_messages`:
* a "thread" is all rows with the same contentId, ordered chronologically.
* No new schema.
*/
var GET = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		title: mediaLibrary.title
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ error: "Not found" }, { status: 404 });
	const rows = await db.select().from(adminMessages).where(eq(adminMessages.contentId, content.id)).orderBy(asc(adminMessages.createdAt));
	const senderIds = Array.from(new Set(rows.flatMap((r) => [r.isFromAdmin ? r.adminId : r.creatorId]).filter((id) => !!id)));
	const senders = senderIds.length > 0 ? await db.select({
		id: user.id,
		name: user.name,
		image: user.image
	}).from(user).where(inArray(user.id, senderIds)) : [];
	const senderMap = new Map(senders.map((s) => [s.id, s]));
	const messages = rows.map((r) => {
		const senderId = r.isFromAdmin ? r.adminId : r.creatorId;
		const sender = senderId ? senderMap.get(senderId) : null;
		return {
			id: r.id,
			message: r.message,
			subject: r.subject,
			type: r.type,
			status: r.status,
			isFromAdmin: r.isFromAdmin,
			attachments: r.attachments,
			createdAt: r.createdAt,
			senderName: sender?.name ?? null,
			senderImage: sender?.image ?? null
		};
	});
	return json({
		content: {
			id: content.id,
			title: content.title,
			creatorId: content.creatorId
		},
		messages
	});
};
var POST = async ({ params, locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const message = body.message?.trim();
	if (!message) return json({ error: "message is required" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		title: mediaLibrary.title
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).limit(1);
	if (!content) return json({ error: "Not found" }, { status: 404 });
	if (!content.creatorId) return json({ error: "Content has no creator" }, { status: 400 });
	const subject = body.subject?.trim() || `Note on "${content.title.slice(0, 80)}"`;
	const attachments = Array.isArray(body.attachments) ? body.attachments.filter((a) => typeof a === "string") : [];
	const [inserted] = await db.insert(adminMessages).values({
		contentId: content.id,
		creatorId: content.creatorId,
		adminId: locals.user.id,
		subject,
		message,
		type: "thread",
		status: "sent",
		isFromAdmin: true,
		attachments
	}).returning({ id: adminMessages.id });
	notify({
		userId: content.creatorId,
		kind: "admin_message",
		title: `Note from admin on "${content.title.slice(0, 50)}"`,
		message: message.slice(0, 140),
		actionUrl: `/creator/content/${content.id}?tab=thread`
	}).catch(() => void 0);
	publish(`thread:${content.id}`, {
		type: "new-message",
		messageId: inserted.id,
		isFromAdmin: true
	});
	return json({
		success: true,
		id: inserted.id
	});
};
//#endregion
export { GET, POST };
