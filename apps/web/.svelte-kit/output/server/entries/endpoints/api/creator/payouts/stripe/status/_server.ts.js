import { T as creators, t as db } from "../../../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../../../chunks/constants.js";
import { r as isStripeConfigured, t as getStripe } from "../../../../../../../chunks/stripe2.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
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
//#endregion
export { GET };
