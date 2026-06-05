import { w as db, E as forumThreads } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-DEv9Xo2l.js.map
