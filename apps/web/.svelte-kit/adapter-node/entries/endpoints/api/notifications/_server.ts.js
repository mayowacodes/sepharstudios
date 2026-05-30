import { F as notifications, t as db } from "../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
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
//#endregion
export { GET };
