import { R as paystackSubscriptions, t as db } from "../../../../../chunks/drizzle.js";
import { t as sendCancellationConfirmation } from "../../../../../chunks/notifications.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
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
//#endregion
export { POST };
