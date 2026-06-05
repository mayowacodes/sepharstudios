import { l as adminMessages, t as db } from "../../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/creator/messages/[id]/read/+server.ts
var PATCH = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.update(adminMessages).set({ status: "read" }).where(and(eq(adminMessages.id, params.id), eq(adminMessages.creatorId, session.user.id))).returning({ id: adminMessages.id })).length === 0) return json({ error: "Not found" }, { status: 404 });
	return json({ success: true });
};
//#endregion
export { PATCH };
