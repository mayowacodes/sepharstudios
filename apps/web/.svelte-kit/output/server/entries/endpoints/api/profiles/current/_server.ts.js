import { nt as profiles, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/api/profiles/current/+server.ts
var GET = async ({ locals, cookies }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const activeId = cookies.get("activeProfileId");
	const userId = session.user.id;
	let row;
	if (activeId) [row] = await db.select().from(profiles).where(and(eq(profiles.userId, userId), eq(profiles.id, activeId))).limit(1);
	if (!row) [row] = await db.select().from(profiles).where(eq(profiles.userId, userId)).orderBy(desc(profiles.isDefault)).limit(1);
	if (!row) return json({ error: "No profile found" }, { status: 404 });
	return json({
		...row,
		hasPin: !!row.pin
	});
};
var PATCH = async ({ locals, cookies, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const activeId = cookies.get("activeProfileId");
	if (!activeId) return json({ error: "No active profile selected" }, { status: 400 });
	const payload = await request.json().catch(() => ({}));
	const updates = {};
	if (payload.name !== void 0) updates.name = payload.name;
	if (payload.avatarColor !== void 0) updates.avatarColor = payload.avatarColor;
	if (payload.avatarEmoji !== void 0) updates.avatarEmoji = payload.avatarEmoji;
	if (payload.contentRating !== void 0) updates.contentRating = payload.contentRating;
	if (payload.safeModeEnabled !== void 0) updates.safeModeEnabled = payload.safeModeEnabled;
	if (Object.keys(updates).length === 0) return json({ error: "Nothing to update" }, { status: 400 });
	const [updated] = await db.update(profiles).set(updates).where(and(eq(profiles.userId, session.user.id), eq(profiles.id, activeId))).returning();
	if (!updated) return json({ error: "Profile not found" }, { status: 404 });
	return json({
		...updated,
		hasPin: !!updated.pin
	});
};
//#endregion
export { GET, PATCH };
