import { d as db, P as paystackSubscriptions } from './drizzle-C3SH12nS.js';
import { c as sendCancellationConfirmation } from './notifications-D7O_W_b8.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './server2-C3RwuLls.js';

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
//# sourceMappingURL=_server.ts-DTU31H8t.js.map
