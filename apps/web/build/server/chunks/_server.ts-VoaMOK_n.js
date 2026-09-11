import { d as db, f as forumThreads } from './drizzle-C3SH12nS.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

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
//# sourceMappingURL=_server.ts-VoaMOK_n.js.map
