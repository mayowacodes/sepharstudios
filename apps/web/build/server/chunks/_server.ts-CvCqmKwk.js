import { n as db, I as paystackSubscriptions } from './drizzle-BjmsPAPl.js';
import { P as PLAN_FEATURES, a as PLAN_PRICES_CENTS } from './paystack-qQiFeBwj.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/subscriptions/change-plan/+server.ts
var VALID_PLANS = new Set([
	"freemium",
	"basic",
	"premium",
	"creator"
]);
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { plan } = await request.json();
	if (!plan || !VALID_PLANS.has(plan)) return json({ error: "Invalid plan" }, { status: 400 });
	const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	if (!sub || !["trial", "active"].includes(sub.status ?? "")) return json({ error: "No active subscription to change" }, { status: 404 });
	if (sub.plan === plan) return json({ error: `You are already on the ${plan} plan` }, { status: 409 });
	if (!sub.paystackAuthorizationCode) return json({
		error: "Add a payment method before changing your plan.",
		redirectTo: "/settings"
	}, { status: 402 });
	const features = PLAN_FEATURES[plan];
	await db.update(paystackSubscriptions).set({
		plan,
		maxProfiles: features.maxProfiles,
		kidsAllowed: features.kidsAllowed,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(paystackSubscriptions.id, sub.id));
	return json({
		success: true,
		plan,
		priceCents: PLAN_PRICES_CENTS[plan],
		renewalIntervalMonths: features.renewalIntervalMonths,
		effective: "next_billing_cycle"
	});
};

export { POST };
//# sourceMappingURL=_server.ts-CvCqmKwk.js.map
