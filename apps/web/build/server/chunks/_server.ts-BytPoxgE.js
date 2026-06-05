import { e as adminMessages, w as db, ag as user, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, sql, and, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/messages/+server.ts
/**
* GET /api/creator/messages?status=unread|read|archived|all&countOnly=1
*
* Returns admin → creator messages addressed to the current signed-in user.
* `status='sent'` is the unread state in `admin_messages`; this endpoint maps
* the URL filter to that storage convention.
*/
var STATUS_MAP = {
	unread: "sent",
	read: "read",
	archived: "archived",
	all: null
};
var GET = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const requested = url.searchParams.get("status") ?? "all";
	const wantCountOnly = url.searchParams.get("countOnly") === "1";
	const storageStatus = STATUS_MAP[requested] ?? null;
	const conds = [eq(adminMessages.creatorId, session.user.id)];
	if (storageStatus) conds.push(eq(adminMessages.status, storageStatus));
	if (wantCountOnly) {
		const [row] = await db.select({ count: sql`count(*)::int` }).from(adminMessages).where(and(...conds));
		return json({ count: Number(row?.count ?? 0) });
	}
	return json({ messages: await db.select({
		id: adminMessages.id,
		subject: adminMessages.subject,
		message: adminMessages.message,
		type: adminMessages.type,
		status: adminMessages.status,
		isFromAdmin: adminMessages.isFromAdmin,
		attachments: adminMessages.attachments,
		contentId: adminMessages.contentId,
		contentTitle: mediaLibrary.title,
		adminId: adminMessages.adminId,
		adminName: user.name,
		createdAt: adminMessages.createdAt
	}).from(adminMessages).leftJoin(mediaLibrary, eq(mediaLibrary.id, adminMessages.contentId)).leftJoin(user, eq(user.id, adminMessages.adminId)).where(and(...conds)).orderBy(desc(adminMessages.createdAt)).limit(100) });
};

export { GET };
//# sourceMappingURL=_server.ts-BytPoxgE.js.map
