import { w as db, M as mediaLibrary, ag as user } from './drizzle-CKUH7ukq.js';
import { r as requireAdmin } from './admin-auth-DwogZLlW.js';
import { n as notify } from './notify-DpHZNtZn.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/content/[id]/assign/+server.ts
/**
* POST /api/admin/content/[id]/assign
*
* Assign a media item to a specific admin reviewer. Admin only.
* Body: { adminId: string }  — must reference a user with role='admin'.
*
* DELETE /api/admin/content/[id]/assign — unassign (sets back to null).
*/
var POST = async ({ params, request, locals }) => {
	const { error: authError, session } = await requireAdmin(locals);
	if (authError || !session) return authError;
	const { adminId } = await request.json();
	if (!adminId) return json({ error: "adminId is required" }, { status: 400 });
	const [target] = await db.select({
		id: user.id,
		role: user.role,
		name: user.name
	}).from(user).where(eq(user.id, adminId)).limit(1);
	if (!target) return json({ error: "Admin not found" }, { status: 404 });
	if (target.role !== "admin") return json({ error: "Target user is not an admin" }, { status: 400 });
	const now = /* @__PURE__ */ new Date();
	const [updated] = await db.update(mediaLibrary).set({
		assignedTo: adminId,
		assignedBy: session.user.id,
		assignedAt: now,
		updatedAt: now
	}).where(eq(mediaLibrary.id, params.id)).returning({
		id: mediaLibrary.id,
		title: mediaLibrary.title
	});
	if (!updated) return json({ error: "Content not found" }, { status: 404 });
	if (adminId !== session.user.id) await notify({
		userId: adminId,
		kind: "system",
		title: "Review assigned to you",
		message: `"${updated.title}" has been assigned to you for review by ${session.user.name ?? "an admin"}.`,
		actionUrl: `/admin/review/${updated.id}`
	});
	return json({
		success: true,
		assignedTo: adminId,
		assignedAt: now
	});
};
var DELETE = async ({ params, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const [updated] = await db.update(mediaLibrary).set({
		assignedTo: null,
		assignedBy: null,
		assignedAt: null,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, params.id)).returning({ id: mediaLibrary.id });
	if (!updated) return json({ error: "Content not found" }, { status: 404 });
	return json({ success: true });
};

export { DELETE, POST };
//# sourceMappingURL=_server.ts-BOu-UaYm.js.map
