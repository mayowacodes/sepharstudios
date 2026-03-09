import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';
import { PLAN_PRICES_CENTS, type PlanName } from '$lib/payment/paystack';

const VALID_PLANS = new Set<PlanName>(['basic', 'premium', 'creator']);

// POST /api/subscriptions/change-plan
// Changes plan for the current subscription. The new plan applies immediately in account state
// and on the next billing cycle charge.
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

	await db.update(paystackSubscriptions)
		.set({
			plan,
			updatedAt: new Date()
		})
		.where(eq(paystackSubscriptions.id, sub.id));

	return json({
		success: true,
		plan,
		monthlyPriceCents: PLAN_PRICES_CENTS[plan],
		effective: 'next_billing_cycle'
	});
};

