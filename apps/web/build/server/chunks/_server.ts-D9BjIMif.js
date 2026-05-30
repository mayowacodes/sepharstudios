import { n as db, v as forumThreads } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

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

export { PATCH };
//# sourceMappingURL=_server.ts-D9BjIMif.js.map
