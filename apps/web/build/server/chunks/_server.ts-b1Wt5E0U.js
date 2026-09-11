import { d as db, E as creators } from './drizzle-CsnNxG5m.js';
import { R as Role } from './constants-DSOCQRom.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-BWq_Qfpf.js';
import './Icon-DOH8dWtn.js';
import './house-CsvPkjXR.js';
import './layout-dashboard-BBz-1-70.js';
import './user-BOId-Hm8.js';
import './users-C2Q26AgN.js';

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
//# sourceMappingURL=_server.ts-b1Wt5E0U.js.map
