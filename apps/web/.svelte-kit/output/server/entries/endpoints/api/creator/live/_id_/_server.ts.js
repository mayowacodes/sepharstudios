import { V as liveStreams, t as db } from "../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { randomBytes } from "node:crypto";
//#region src/routes/api/creator/live/[id]/+server.ts
/**
* PATCH  /api/creator/live/[id] — edit metadata or rotate stream key
*   body: { title?, description?, visibility?, rotateKey?: true }
* DELETE /api/creator/live/[id] — delete stream (only when not 'live')
*/
async function ownerCheck(id, userId) {
	const [row] = await db.select({
		creatorId: liveStreams.creatorId,
		status: liveStreams.status
	}).from(liveStreams).where(eq(liveStreams.id, id)).limit(1);
	if (!row) return {
		ok: false,
		status: 404,
		row: null
	};
	if (row.creatorId !== userId) return {
		ok: false,
		status: 403,
		row: null
	};
	return {
		ok: true,
		status: 200,
		row
	};
}
var PATCH = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const check = await ownerCheck(params.id, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	const body = await request.json().catch(() => ({}));
	const updates = { updatedAt: /* @__PURE__ */ new Date() };
	if (typeof body.title === "string") updates.title = body.title.trim().slice(0, 255);
	if (typeof body.description === "string") updates.description = body.description.trim();
	if (typeof body.visibility === "string" && [
		"public",
		"unlisted",
		"private"
	].includes(body.visibility)) updates.visibility = body.visibility;
	if (body.rotateKey === true) updates.streamKey = `seph_${randomBytes(16).toString("hex")}`;
	const [updated] = await db.update(liveStreams).set(updates).where(eq(liveStreams.id, params.id)).returning();
	return json({
		success: true,
		stream: updated
	});
};
var DELETE = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const check = await ownerCheck(params.id, session.user.id);
	if (!check.ok) return json({ error: check.status === 404 ? "Not found" : "Forbidden" }, { status: check.status });
	if (check.row?.status === "live" || check.row?.status === "ingest") return json({ error: "Cannot delete a stream that is currently live" }, { status: 400 });
	await db.delete(liveStreams).where(eq(liveStreams.id, params.id));
	return json({ success: true });
};
//#endregion
export { DELETE, PATCH };
