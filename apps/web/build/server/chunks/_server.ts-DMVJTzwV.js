import { d as db, x as notificationPreferences } from './drizzle-DlGuU73K.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/notifications/preferences/+server.ts
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [prefs] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, session.user.id)).limit(1);
	if (!prefs) return json({
		newReleases: true,
		trialExpiry: true,
		paymentConfirmation: true,
		weeklyDigest: false,
		creatorUpdates: false,
		eventReminders: true
	});
	return json(prefs);
};
var PUT = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const data = await request.json();
	const [existing] = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userId, session.user.id)).limit(1);
	if (existing) {
		const [updated] = await db.update(notificationPreferences).set({
			...data,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(notificationPreferences.userId, session.user.id)).returning();
		return json(updated);
	}
	const [created] = await db.insert(notificationPreferences).values({
		userId: session.user.id,
		...data
	}).returning();
	return json(created);
};

export { GET, PUT };
//# sourceMappingURL=_server.ts-DMVJTzwV.js.map
