import { T as forumThreads, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/forum/threads/[id]/+server.ts
/**
* PATCH /api/admin/forum/threads/[id]
*
* Admin-only thread mod: { isSticky?, isLocked?, status?, moderationNote? }.
*/
var ALLOWED_STATUSES = new Set([
	"published",
	"hidden",
	"removed"
]);
var PATCH = async ({ params, locals, request }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const body = await request.json().catch(() => ({}));
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	if (typeof body.isSticky === "boolean") updates.isSticky = body.isSticky;
	if (typeof body.isLocked === "boolean") updates.isLocked = body.isLocked;
	if (body.status && ALLOWED_STATUSES.has(body.status)) updates.status = body.status;
	if (typeof body.moderationNote === "string") updates.moderationNote = body.moderationNote;
	if (Object.keys(updates).length === 1) return json({ error: "No updatable fields supplied" }, { status: 400 });
	const [updated] = await db.update(forumThreads).set(updates).where(eq(forumThreads.id, params.id)).returning();
	if (!updated) return json({ error: "Thread not found" }, { status: 404 });
	return json({
		success: true,
		thread: updated
	});
};
//#endregion
export { PATCH };
