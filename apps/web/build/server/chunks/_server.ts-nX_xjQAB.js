import { w as db, e as adminMessages } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/messages/[id]/read/+server.ts
var PATCH = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.update(adminMessages).set({ status: "read" }).where(and(eq(adminMessages.id, params.id), eq(adminMessages.creatorId, session.user.id))).returning({ id: adminMessages.id })).length === 0) return json({ error: "Not found" }, { status: 404 });
	return json({ success: true });
};

export { PATCH };
//# sourceMappingURL=_server.ts-nX_xjQAB.js.map
