import { K as mediaLibrary, _ as bibleStoryProgress, at as ppvPurchases, ct as quizSessions, t as db } from "../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { and, eq, inArray } from "drizzle-orm";
//#region src/routes/api/creator/content/bulk/+server.ts
/**
* POST /api/creator/content/bulk
*
* Body: { ids: string[], action: 'publish'|'unlist'|'private'|'archive'|'delete'|'delete-permanent' }
*
* Applies a single action across many content rows in one go. Every id must
* belong to the signed-in creator — if any fails the ownership check we
* return 403 and skip the whole batch (no partial writes).
*
* Two destructive options:
*   - `archive` / `delete` (legacy alias) — soft delete. Sets status=archived,
*      isActive=false, visibility=private. Hides from viewers but the row
*      stays in the DB so PPV purchases remain valid, scan/encoder artifacts
*      can be inspected, and the creator can un-archive later.
*   - `delete-permanent` — hard DELETE FROM media_library. Disallowed if any
*      PPV purchase exists for any of the rows (paying customers expected
*      access; refunding/voiding those is an admin concern, not a one-click
*      creator action). Dependent rows in quiz_sessions / bible_story_progress
*      are nulled (the FK columns are nullable) so historical session data
*      survives without pointing at a missing row.
*
* Cap: 100 ids per call (matches the admin bulk endpoint).
*/
var VALID_ACTIONS = new Set([
	"publish",
	"unlist",
	"private",
	"archive",
	"delete",
	"delete-permanent"
]);
var BATCH_MAX = 100;
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	if (!Array.isArray(body.ids) || body.ids.length === 0) return json({ error: "ids is required" }, { status: 400 });
	if (body.ids.length > BATCH_MAX) return json({ error: `Maximum batch size is ${BATCH_MAX}` }, { status: 400 });
	if (!body.action || !VALID_ACTIONS.has(body.action)) return json({ error: "Invalid action" }, { status: 400 });
	const ids = [...new Set(body.ids.filter((id) => typeof id === "string" && id.length > 0))];
	if ((await db.select({ id: mediaLibrary.id }).from(mediaLibrary).where(and(inArray(mediaLibrary.id, ids), eq(mediaLibrary.creatorId, session.user.id)))).length !== ids.length) return json({ error: "One or more content items are not yours" }, { status: 403 });
	if (body.action === "delete-permanent") {
		if ((await db.select({ contentId: ppvPurchases.contentId }).from(ppvPurchases).where(inArray(ppvPurchases.contentId, ids)).limit(1)).length > 0) return json({
			error: "Cannot permanently delete content with existing PPV purchases. Archive instead, or contact support to void the purchases first.",
			blockedBy: "ppv_purchases"
		}, { status: 409 });
		await db.update(quizSessions).set({ contentId: null }).where(inArray(quizSessions.contentId, ids));
		await db.update(bibleStoryProgress).set({ contentId: null }).where(inArray(bibleStoryProgress.contentId, ids));
		return json({
			success: true,
			affected: (await db.delete(mediaLibrary).where(inArray(mediaLibrary.id, ids))).rowCount ?? ids.length,
			action: "delete-permanent"
		});
	}
	const now = /* @__PURE__ */ new Date();
	let updates;
	switch (body.action) {
		case "publish":
			updates = {
				visibility: "public",
				isActive: true,
				updatedAt: now
			};
			break;
		case "unlist":
			updates = {
				visibility: "unlisted",
				updatedAt: now
			};
			break;
		case "private":
			updates = {
				visibility: "private",
				updatedAt: now
			};
			break;
		case "archive":
			updates = {
				status: "archived",
				isActive: false,
				updatedAt: now
			};
			break;
		case "delete":
			updates = {
				status: "archived",
				isActive: false,
				visibility: "private",
				updatedAt: now
			};
			break;
		default: return json({ error: "Invalid action" }, { status: 400 });
	}
	await db.update(mediaLibrary).set(updates).where(inArray(mediaLibrary.id, ids));
	return json({
		success: true,
		affected: ids.length,
		action: body.action
	});
};
//#endregion
export { POST };
