import { d as db, f as forumThreads } from './drizzle-CsnNxG5m.js';
import { R as Role } from './constants-DSOCQRom.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

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
//# sourceMappingURL=_server.ts-BN7rEz6h.js.map
