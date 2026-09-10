import { d as db, f as forumThreads } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

//#region src/routes/api/creator/moderation/forum/threads/[id]/+server.ts
/**
* PATCH /api/creator/moderation/forum/threads/[id]
*
* Body: { isLocked?: boolean }
*
* Creator-side lock toggle on their own threads. Admin-only fields
* (isSticky, status, moderationNote) are routed through the admin
* endpoint, not this one.
*/
var PATCH = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const [row] = await db.select({
		id: forumThreads.id,
		authorId: forumThreads.authorId
	}).from(forumThreads).where(eq(forumThreads.id, params.id)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	if (row.authorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	const updates = {};
	if (typeof body.isLocked === "boolean") updates.isLocked = body.isLocked;
	if (Object.keys(updates).length === 0) return json({ error: "No updatable fields supplied" }, { status: 400 });
	await db.update(forumThreads).set(updates).where(eq(forumThreads.id, row.id));
	return json({ success: true });
};

export { PATCH };
//# sourceMappingURL=_server.ts-ckH_AcJG.js.map
