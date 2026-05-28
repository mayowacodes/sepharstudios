import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';
import { PLAN_PRICES_CENTS, PLAN_FEATURES, type PlanName } from '$lib/payment/paystack';

const VALID_PLANS = new Set<PlanName>(['freemium', 'basic', 'premium', 'creator']);

// POST /api/subscriptions/change-plan
// Switches the current subscription to a different plan. The new plan applies
// immediately for entitlements (max_profiles, kids_allowed) and the new
// price/cadence is charged on the next renewal by the cron worker.
export const POST: RequestHandler = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { plan } = await request.json() as { plan?: PlanName };
	if (!plan || !VALID_PLANS.has(plan)) {
		return json({ error: 'Invalid plan' }, { status: 400 });
	}

	const [sub] = await db.select()
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	if (!sub || !['trial', 'active'].includes(sub.status ?? '')) {
		return json({ error: 'No active subscription to change' }, { status: 404 });
	}

	if (sub.plan === plan) {
		return json({ error: `You are already on the ${plan} plan` }, { status: 409 });
	}

	// Hard gate: a plan switch only makes sense if the cron worker can actually
	// charge the user on the next cycle. No saved card = no renewal = a broken
	// state where the user's plan changes but they never get charged for it.
	if (!sub.paystackAuthorizationCode) {
		return json({
			error: 'Add a payment method before changing your plan.',
			redirectTo: '/settings'
		}, { status: 402 });
	}

	const features = PLAN_FEATURES[plan];

	await db.update(paystackSubscriptions)
		.set({
			plan,
			// Snapshot the new plan's entitlements onto the row immediately so
			// access checks (profile cap, kids gate) reflect the change. The
			// price change happens on the next charge via the cron worker.
			maxProfiles: features.maxProfiles,
			kidsAllowed: features.kidsAllowed,
			updatedAt: new Date()
		})
		.where(eq(paystackSubscriptions.id, sub.id));

	return json({
		success: true,
		plan,
		priceCents: PLAN_PRICES_CENTS[plan],
		renewalIntervalMonths: features.renewalIntervalMonths,
		effective: 'next_billing_cycle'
	});
};

