import { d as db, y as notifications } from './drizzle-C3SH12nS.js';
import { j as json } from './index.js-CxPEndTa.js';
import { and, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/notifications/[id]/read/+server.ts
var POST = async ({ locals, params }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (!params.id) return json({ error: "id required" }, { status: 400 });
	if ((await db.update(notifications).set({ read: true }).where(and(eq(notifications.id, params.id), eq(notifications.userId, session.user.id))).returning({ id: notifications.id })).length === 0) return json({ error: "Not found" }, { status: 404 });
	return new Response(null, { status: 204 });
};

export { POST };
//# sourceMappingURL=_server.ts-B3Imx8Eo.js.map
