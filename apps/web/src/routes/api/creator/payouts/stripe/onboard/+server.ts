import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { Role } from '$lib/constants';
import { getStripe, isStripeConfigured } from '$lib/server/stripe';
import { SiteMeta } from '$lib/constants';

/**
 * POST /api/creator/payouts/stripe/onboard
 *
 * Creates a Stripe Connect Express account if the creator doesn't have one
 * yet, then returns a fresh AccountLink URL the client redirects to.
 *
 * Body: { country?: string }  (ISO 3166-1 alpha-2, defaults to 'US')
 *
 * AccountLink URLs are single-use and expire in 5 minutes — the client
 * calls this endpoint each time it needs to redirect.
 */

const VALID_COUNTRIES = new Set([
	'US', 'GB', 'CA', 'AU', 'NZ', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE',
	'IE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PT', 'JP', 'SG', 'HK'
]);

export const POST: RequestHandler = async ({ locals, request, url }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role as Role)) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}
	if (!isStripeConfigured()) {
		return json({ error: 'Stripe is not configured on this deployment' }, { status: 503 });
	}

	const body = await request.json().catch(() => ({})) as { country?: string };
	const country = (body.country ?? 'US').toUpperCase();
	if (!VALID_COUNTRIES.has(country)) {
		return json({ error: 'Country not supported for Stripe Connect' }, { status: 400 });
	}

	const [creator] = await db.select()
		.from(creators)
		.where(eq(creators.userId, session.user.id))
		.limit(1);
	if (!creator) return json({ error: 'Creator profile not found' }, { status: 404 });

	const stripe = getStripe();
	let accountId = creator.stripeAccountId;

	if (!accountId) {
		const account = await stripe.accounts.create({
			type: 'express',
			country,
			email: creator.contactEmail ?? session.user.email,
			capabilities: {
				transfers: { requested: true },
				card_payments: { requested: true }
			},
			business_type: creator.creatorType === 'organization' ? 'company' : 'individual',
			metadata: { creatorId: creator.id }
		});
		accountId = account.id;
		await db.update(creators)
			.set({
				stripeAccountId: accountId,
				stripeAccountStatus: 'pending',
				stripeCountry: country,
				updatedAt: new Date()
			})
			.where(eq(creators.id, creator.id));
	}

	const origin = url.origin || SiteMeta.link;
	const link = await stripe.accountLinks.create({
		account: accountId,
		refresh_url: `${origin}/creator/earnings?stripe=refresh`,
		return_url: `${origin}/creator/earnings?stripe=complete`,
		type: 'account_onboarding'
	});

	return json({ url: link.url });
};
