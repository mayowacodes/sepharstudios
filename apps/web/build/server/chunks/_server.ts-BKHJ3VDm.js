import { w as db, u as creators } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { i as isStripeConfigured, g as getStripe } from './stripe2-CDDbjsFl.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import 'stripe';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/creator/payouts/stripe/status/+server.ts
/**
* GET /api/creator/payouts/stripe/status
*
* Pulls current Connect account state from Stripe and mirrors it onto the
* creators row. The mirror lets the UI render without round-tripping to
* Stripe on every render; this endpoint is what the dashboard polls after
* onboarding completes (and what the webhook also writes).
*/
function mapStatus(account) {
	const reqs = account.requirements;
	if (reqs?.disabled_reason) return "restricted";
	if (account.payouts_enabled && account.charges_enabled) return "verified";
	if (reqs?.past_due && reqs.past_due.length > 0) return "restricted";
	return "pending";
}
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const [creator] = await db.select().from(creators).where(eq(creators.userId, session.user.id)).limit(1);
	if (!creator) return json({ error: "Creator profile not found" }, { status: 404 });
	if (!creator.stripeAccountId || !isStripeConfigured()) return json({
		stripeAccountId: creator.stripeAccountId,
		status: creator.stripeAccountStatus,
		payoutsEnabled: !!creator.stripePayoutsEnabled,
		chargesEnabled: !!creator.stripeChargesEnabled,
		country: creator.stripeCountry,
		source: "mirror"
	});
	const account = await getStripe().accounts.retrieve(creator.stripeAccountId);
	const status = mapStatus(account);
	await db.update(creators).set({
		stripeAccountStatus: status,
		stripePayoutsEnabled: account.payouts_enabled,
		stripeChargesEnabled: account.charges_enabled,
		stripeCountry: account.country ?? creator.stripeCountry,
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(creators.id, creator.id));
	return json({
		stripeAccountId: creator.stripeAccountId,
		status,
		payoutsEnabled: account.payouts_enabled,
		chargesEnabled: account.charges_enabled,
		country: account.country,
		requirementsDueNow: account.requirements?.currently_due ?? [],
		requirementsPastDue: account.requirements?.past_due ?? [],
		source: "stripe"
	});
};

export { GET };
//# sourceMappingURL=_server.ts-BKHJ3VDm.js.map
