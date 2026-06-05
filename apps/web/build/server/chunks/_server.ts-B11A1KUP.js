import { w as db, E as forumThreads, D as forumReplies, a as abuseReports } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, and } from 'drizzle-orm';
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

//#region src/routes/api/creator/moderation/forum/replies/[id]/+server.ts
/**
* PATCH /api/creator/moderation/forum/replies/[id]
*
* Body: { action: 'hide' }
*
* Ownership: the reply must live on a thread the creator authored.
* Resolves any open abuse reports against the reply as a side effect.
*/
var PATCH = async ({ params, locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	if ((await request.json().catch(() => ({}))).action !== "hide") return json({ error: "Invalid action" }, { status: 400 });
	const [row] = await db.select({
		id: forumReplies.id,
		threadAuthorId: forumThreads.authorId
	}).from(forumReplies).leftJoin(forumThreads, eq(forumReplies.threadId, forumThreads.id)).where(eq(forumReplies.id, params.id)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	if (row.threadAuthorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	await db.update(forumReplies).set({ status: "hidden" }).where(eq(forumReplies.id, row.id));
	await db.update(abuseReports).set({
		status: "resolved",
		resolution: "hidden",
		resolvedBy: session.user.id,
		resolvedAt: /* @__PURE__ */ new Date()
	}).where(and(eq(abuseReports.targetType, "forum_reply"), eq(abuseReports.targetId, row.id), eq(abuseReports.status, "open")));
	return json({ success: true });
};

export { PATCH };
//# sourceMappingURL=_server.ts-B11A1KUP.js.map
