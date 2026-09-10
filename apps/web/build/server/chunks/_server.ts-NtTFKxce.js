import { d as db, C as creators } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { i as isStripeConfigured, g as getStripe } from './stripe2-BZ_lGXG6.js';
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
import 'stripe';

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
//# sourceMappingURL=_server.ts-NtTFKxce.js.map
