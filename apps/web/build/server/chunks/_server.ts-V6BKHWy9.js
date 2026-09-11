import { d as db, P as paystackSubscriptions } from './drizzle-CsnNxG5m.js';
import { c as sendCancellationConfirmation } from './notifications-_1tyaY7R.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './server2-DXxZNCEI.js';

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
//# sourceMappingURL=_server.ts-V6BKHWy9.js.map
