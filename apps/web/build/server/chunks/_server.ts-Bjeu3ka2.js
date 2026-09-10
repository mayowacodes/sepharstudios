import { d as db, j as adminMessages } from './drizzle-DlGuU73K.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { and, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/creator/messages/[id]/archive/+server.ts
var PATCH = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.update(adminMessages).set({ status: "archived" }).where(and(eq(adminMessages.id, params.id), eq(adminMessages.creatorId, session.user.id))).returning({ id: adminMessages.id })).length === 0) return json({ error: "Not found" }, { status: 404 });
	return json({ success: true });
};

export { PATCH };
//# sourceMappingURL=_server.ts-Bjeu3ka2.js.map
