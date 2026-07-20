import { I as forumReplies, K as mediaLibrary, L as forumThreads, dt as reviews, o as abuseReports, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/abuse/[id]/+server.ts
/**
* PATCH /api/admin/abuse/[id]
*
* Body: { status: 'resolved' | 'dismissed' | 'escalated', resolution?, applyAction?: boolean }
*
* When `applyAction=true` AND resolution implies a content change
* ('hidden' / 'removed'), this also mutates the target — saves the admin
* a click. The resolution becomes a single source of truth for what
* happened to the target.
*/
var ALLOWED_STATUS = new Set([
	"resolved",
	"dismissed",
	"escalated"
]);
var ALLOWED_RESOLUTIONS = new Set([
	"hidden",
	"removed",
	"warned",
	"banned",
	"no_action"
]);
async function applyResolutionToTarget(targetType, targetId, resolution) {
	if (resolution !== "hidden" && resolution !== "removed") return;
	if (targetType === "review") {
		if (resolution === "removed") await db.delete(reviews).where(eq(reviews.id, targetId));
		else await db.update(reviews).set({ isApproved: false }).where(eq(reviews.id, targetId));
		return;
	}
	if (targetType === "forum_thread") {
		await db.update(forumThreads).set({ status: resolution === "removed" ? "removed" : "hidden" }).where(eq(forumThreads.id, targetId));
		return;
	}
	if (targetType === "forum_reply") {
		await db.update(forumReplies).set({ status: resolution === "removed" ? "removed" : "hidden" }).where(eq(forumReplies.id, targetId));
		return;
	}
	if (targetType === "content") await db.update(mediaLibrary).set({
		isActive: false,
		visibility: "private",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, targetId));
}
var PATCH = async ({ params, locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	if (!body.status || !ALLOWED_STATUS.has(body.status)) return json({ error: "Invalid status" }, { status: 400 });
	if (body.resolution && !ALLOWED_RESOLUTIONS.has(body.resolution)) return json({ error: "Invalid resolution" }, { status: 400 });
	const [row] = await db.select().from(abuseReports).where(eq(abuseReports.id, params.id)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	await db.update(abuseReports).set({
		status: body.status,
		resolution: body.resolution ?? null,
		resolvedBy: locals.user.id,
		resolvedAt: /* @__PURE__ */ new Date()
	}).where(eq(abuseReports.id, row.id));
	if (body.applyAction && body.resolution) await applyResolutionToTarget(row.targetType, row.targetId, body.resolution);
	return json({ success: true });
};
//#endregion
export { PATCH };
