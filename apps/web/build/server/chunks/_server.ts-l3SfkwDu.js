import { w as db, V as paystackSubscriptions } from './drizzle-CKUH7ukq.js';
import { s as sendCancellationConfirmation } from './notifications-CKo51rvz.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './server2-D6YOLBns.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
//# sourceMappingURL=_server.ts-l3SfkwDu.js.map
