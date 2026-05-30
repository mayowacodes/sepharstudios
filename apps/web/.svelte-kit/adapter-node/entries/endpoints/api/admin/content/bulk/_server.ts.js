import { j as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { inArray } from "drizzle-orm";
//#region src/routes/api/admin/content/bulk/+server.ts
/**
* POST /api/admin/content/bulk
*
* Performs a single action on multiple media_library items at once.
*
* Body: { ids: string[], action: 'approve' | 'reject' | 'delete' | 'archive' | 'priority-high' | 'priority-medium' | 'priority-low' }
*
* Wired from the admin content moderation page's bulk-action UI. Admin only.
*/
var VALID_ACTIONS = new Set([
	"approve",
	"reject",
	"delete",
	"archive",
	"priority-high",
	"priority-medium",
	"priority-low"
]);
var MAX_BATCH_SIZE = 100;
var POST = async ({ locals, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error;
	const body = await request.json();
	if (!Array.isArray(body.ids) || body.ids.length === 0) return json({ error: "ids[] is required" }, { status: 400 });
	if (body.ids.length > MAX_BATCH_SIZE) return json({ error: `Batch limited to ${MAX_BATCH_SIZE} items` }, { status: 400 });
	if (!body.action || !VALID_ACTIONS.has(body.action)) return json({ error: `action must be one of: ${Array.from(VALID_ACTIONS).join(", ")}` }, { status: 400 });
	const now = /* @__PURE__ */ new Date();
	let affected = 0;
	switch (body.action) {
		case "approve":
			affected = (await db.update(mediaLibrary).set({
				status: "published",
				isActive: true,
				reviewedAt: now,
				reviewedBy: session.user.id,
				updatedAt: now
			}).where(inArray(mediaLibrary.id, body.ids)).returning({ id: mediaLibrary.id })).length;
			break;
		case "reject":
			affected = (await db.update(mediaLibrary).set({
				status: "rejected",
				isActive: false,
				reviewedAt: now,
				reviewedBy: session.user.id,
				updatedAt: now
			}).where(inArray(mediaLibrary.id, body.ids)).returning({ id: mediaLibrary.id })).length;
			break;
		case "archive":
			affected = (await db.update(mediaLibrary).set({
				status: "archived",
				isActive: false,
				updatedAt: now
			}).where(inArray(mediaLibrary.id, body.ids)).returning({ id: mediaLibrary.id })).length;
			break;
		case "delete":
			affected = (await db.delete(mediaLibrary).where(inArray(mediaLibrary.id, body.ids)).returning({ id: mediaLibrary.id })).length;
			break;
		case "priority-high":
		case "priority-medium":
		case "priority-low": {
			const featured = body.action === "priority-high";
			affected = (await db.update(mediaLibrary).set({
				featured,
				updatedAt: now
			}).where(inArray(mediaLibrary.id, body.ids)).returning({ id: mediaLibrary.id })).length;
			break;
		}
	}
	return json({
		success: true,
		action: body.action,
		affected
	});
};
//#endregion
export { POST };
