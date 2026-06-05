import { w as db, Q as notifications } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/notifications/+server.ts
var GET = async ({ locals, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 200);
	return json(await db.select({
		id: notifications.id,
		kind: notifications.kind,
		title: notifications.title,
		message: notifications.message,
		actionUrl: notifications.actionUrl,
		read: notifications.read,
		createdAt: notifications.createdAt
	}).from(notifications).where(eq(notifications.userId, session.user.id)).orderBy(desc(notifications.createdAt)).limit(limit));
};

export { GET };
//# sourceMappingURL=_server.ts-CqTcwiXu.js.map
