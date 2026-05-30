import { F as notifications, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/notifications/[id]/+server.ts
var DELETE = async ({ locals, params }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (!params.id) return json({ error: "id required" }, { status: 400 });
	if ((await db.delete(notifications).where(and(eq(notifications.id, params.id), eq(notifications.userId, session.user.id))).returning({ id: notifications.id })).length === 0) return json({ error: "Not found" }, { status: 404 });
	return new Response(null, { status: 204 });
};
//#endregion
export { DELETE };
