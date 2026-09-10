import { ct as paystackSubscriptions, t as db } from "../../../../../chunks/drizzle.js";
import { t as PLAN_FEATURES } from "../../../../../chunks/paystack.js";
import { t as track } from "../../../../../chunks/analytics.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/routes/api/subscriptions/start-free/+server.ts
var FREE_PLAN = "freemium";
/**
* POST /api/subscriptions/start-free  →  { plan, status, maxProfiles, kidsAllowed }
*
* Activates the free, ad-supported tier.
*
* Deliberately separate from the paid flows. `/api/payment/initialize` and
* `/api/subscriptions/start-trial` both reach Paystack — they take a $0.50 card
* verification charge, store an authorization code and schedule a renewal. None
* of that applies here: there is no charge, no card, and no renewal, so routing
* the free tier through them would bill users to activate a free plan.
*
* No OTP and no device-fingerprint blacklist either. Those exist to stop trial
* farming — someone cycling phone numbers to keep re-claiming a paid tier for
* free. The free tier has nothing to farm; it is permanently free by design,
* and gating signup behind an SMS would tax the exact acquisition funnel this
* tier exists to widen.
*
* The row is created with `nextChargeAt: null` and no authorization code, which
* is what keeps it out of the renewal cron's query
* (see /api/cron/renew-subscriptions — it requires both to be non-null).
*/
var POST = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const userId = session.user.id;
	const [existing] = await db.select({
		id: paystackSubscriptions.id,
		plan: paystackSubscriptions.plan,
		status: paystackSubscriptions.status
	}).from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, userId)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	if (existing && (existing.status === "active" || existing.status === "trial")) return json({
		plan: existing.plan,
		status: existing.status,
		alreadySubscribed: true
	});
	const features = PLAN_FEATURES[FREE_PLAN];
	const now = /* @__PURE__ */ new Date();
	const [row] = await db.insert(paystackSubscriptions).values({
		userId,
		plan: FREE_PLAN,
		status: "active",
		currentPeriodStart: now,
		currentPeriodEnd: null,
		maxProfiles: features.maxProfiles,
		kidsAllowed: features.kidsAllowed,
		nextChargeAt: null,
		paystackAuthorizationCode: null
	}).returning();
	track(userId, "subscribe", {
		plan: FREE_PLAN,
		free: true
	});
	return json({
		plan: FREE_PLAN,
		status: row?.status ?? "active",
		maxProfiles: features.maxProfiles,
		kidsAllowed: features.kidsAllowed
	});
};
//#endregion
export { POST };
