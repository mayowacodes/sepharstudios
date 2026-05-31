import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { Role } from '$lib/constants';
import { getStripe, isStripeConfigured } from '$lib/server/stripe';

/**
 * GET /api/creator/payouts/stripe/status
 *
 * Pulls current Connect account state from Stripe and mirrors it onto the
 * creators row. The mirror lets the UI render without round-tripping to
 * Stripe on every render; this endpoint is what the dashboard polls after
 * onboarding completes (and what the webhook also writes).
 */

function mapStatus(account: { charges_enabled: boolean; payouts_enabled: boolean; requirements?: { disabled_reason?: string | null; currently_due?: string[] | null; past_due?: string[] | null } | null }) {
	const reqs = account.requirements;
	if (reqs?.disabled_reason) return 'restricted';
	if (account.payouts_enabled && account.charges_enabled) return 'verified';
	if (reqs?.past_due && reqs.past_due.length > 0) return 'restricted';
	return 'pending';
}

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const [creator] = await db.select()
		.from(creators)
		.where(eq(creators.userId, session.user.id))
		.limit(1);
	if (!creator) return json({ error: 'Creator profile not found' }, { status: 404 });

	// No account yet — return the mirrored state (likely all-null).
	if (!creator.stripeAccountId || !isStripeConfigured()) {
		return json({
			stripeAccountId: creator.stripeAccountId,
			status: creator.stripeAccountStatus,
			payoutsEnabled: !!creator.stripePayoutsEnabled,
			chargesEnabled: !!creator.stripeChargesEnabled,
			country: creator.stripeCountry,
			source: 'mirror'
		});
	}

	const stripe = getStripe();
	const account = await stripe.accounts.retrieve(creator.stripeAccountId);
	const status = mapStatus(account);

	await db.update(creators)
		.set({
			stripeAccountStatus: status,
			stripePayoutsEnabled: account.payouts_enabled,
			stripeChargesEnabled: account.charges_enabled,
			stripeCountry: account.country ?? creator.stripeCountry,
			updatedAt: new Date()
		})
		.where(eq(creators.id, creator.id));

	return json({
		stripeAccountId: creator.stripeAccountId,
		status,
		payoutsEnabled: account.payouts_enabled,
		chargesEnabled: account.charges_enabled,
		country: account.country,
		requirementsDueNow: account.requirements?.currently_due ?? [],
		requirementsPastDue: account.requirements?.past_due ?? [],
		source: 'stripe'
	});
};
