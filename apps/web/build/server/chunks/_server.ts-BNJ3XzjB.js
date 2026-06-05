import { w as db, Q as notifications } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/notifications/[id]/read/+server.ts
var POST = async ({ locals, params }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (!params.id) return json({ error: "id required" }, { status: 400 });
	if ((await db.update(notifications).set({ read: true }).where(and(eq(notifications.id, params.id), eq(notifications.userId, session.user.id))).returning({ id: notifications.id })).length === 0) return json({ error: "Not found" }, { status: 404 });
	return new Response(null, { status: 204 });
};

export { POST };
//# sourceMappingURL=_server.ts-BNJ3XzjB.js.map
