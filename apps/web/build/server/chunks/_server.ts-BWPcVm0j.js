import { d as db, N as paystackSubscriptions } from './drizzle-DlGuU73K.js';
import { c as sendCancellationConfirmation } from './notifications-DAwU5R_w.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './server2-K9pj3rZ3.js';

//#region src/routes/api/subscriptions/cancel/+server.ts
var POST = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	if (!sub) return json({ error: "No active subscription" }, { status: 404 });
	await db.update(paystackSubscriptions).set({
		status: "cancelled",
		cancelledAt: /* @__PURE__ */ new Date(),
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(paystackSubscriptions.id, sub.id));
	const accessUntil = sub.trialEndDate ?? sub.currentPeriodEnd ?? /* @__PURE__ */ new Date();
	await sendCancellationConfirmation(session.user.email, session.user.name, accessUntil);
	return json({
		success: true,
		accessUntil
	});
};

export { POST };
//# sourceMappingURL=_server.ts-BWPcVm0j.js.map
