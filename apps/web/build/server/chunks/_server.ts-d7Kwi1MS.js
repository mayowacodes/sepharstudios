import { d as db, C as creators } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

//#region src/routes/api/creator/payouts/method/+server.ts
/**
* GET/PUT /api/creator/payouts/method
*
* Lets a creator choose between Paystack (default, for NGN / African
* region) and Stripe (USD / global) for payouts.
*
* PUT body: { payoutProcessor: 'paystack' | 'stripe', preferredPayoutCurrency?: string }
*
* Switching to Stripe requires a verified Connect account — we block the
* switch otherwise so the cron doesn't try to pay an unverified creator.
*/
var VALID_PROCESSORS = /* @__PURE__ */ new Set(["paystack", "stripe"]);
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const [creator] = await db.select({
		payoutProcessor: creators.payoutProcessor,
		preferredPayoutCurrency: creators.preferredPayoutCurrency,
		stripeAccountStatus: creators.stripeAccountStatus,
		stripePayoutsEnabled: creators.stripePayoutsEnabled
	}).from(creators).where(eq(creators.userId, session.user.id)).limit(1);
	if (!creator) return json({ error: "Creator profile not found" }, { status: 404 });
	return json(creator);
};
var PUT = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	if (!body.payoutProcessor || !VALID_PROCESSORS.has(body.payoutProcessor)) return json({ error: "Invalid payoutProcessor" }, { status: 400 });
	const [creator] = await db.select().from(creators).where(eq(creators.userId, session.user.id)).limit(1);
	if (!creator) return json({ error: "Creator profile not found" }, { status: 404 });
	if (body.payoutProcessor === "stripe" && !creator.stripePayoutsEnabled) return json({ error: "Complete Stripe onboarding before switching to Stripe payouts" }, { status: 400 });
	const updates = {
		payoutProcessor: body.payoutProcessor,
		updatedAt: /* @__PURE__ */ new Date()
	};
	if (typeof body.preferredPayoutCurrency === "string" && /^[A-Z]{3}$/.test(body.preferredPayoutCurrency)) updates.preferredPayoutCurrency = body.preferredPayoutCurrency;
	await db.update(creators).set(updates).where(eq(creators.id, creator.id));
	return json({ success: true });
};

export { GET, PUT };
//# sourceMappingURL=_server.ts-d7Kwi1MS.js.map
