import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';
import { PLAN_FEATURES } from '$lib/payment/paystack';
import { track } from '$lib/server/analytics';

// `basic` is the free tier since the 2026-09-10 merge of freemium into it.
const FREE_PLAN = 'basic' as const;

/**
 * POST /api/subscriptions/start-free  →  { plan, status, maxProfiles, kidsAllowed }
 *
 * Activates the free, ad-supported tier.
 *
 * Deliberately separate from the paid flows. `/api/payment/initialize` and
 * `/api/subscriptions/start-trial` both reach Paystack — they take a $0.50 card
 * verification charge, store an authorization code and schedule a renewal. None
 * of that applies here: there is no charge, no card, and no renewal, so routing
 * the free tier through them would bill users to activate a free plan.
 *
 * No OTP and no device-fingerprint blacklist either. Those exist to stop trial
 * farming — someone cycling phone numbers to keep re-claiming a paid tier for
 * free. The free tier has nothing to farm; it is permanently free by design,
 * and gating signup behind an SMS would tax the exact acquisition funnel this
 * tier exists to widen.
 *
 * The row is created with `nextChargeAt: null` and no authorization code, which
 * is what keeps it out of the renewal cron's query
 * (see /api/cron/renew-subscriptions — it requires both to be non-null).
 */
export const POST: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const userId = session.user.id;

	// Newest row first — the same ordering the entitlement checks use.
	const [existing] = await db
		.select({ id: paystackSubscriptions.id, plan: paystackSubscriptions.plan, status: paystackSubscriptions.status })
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, userId))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	// Already entitled to something. Never downgrade a paying customer to free
	// as a side effect of them hitting this endpoint.
	if (existing && (existing.status === 'active' || existing.status === 'trial')) {
		return json({
			plan: existing.plan,
			status: existing.status,
			alreadySubscribed: true
		});
	}

	const features = PLAN_FEATURES[FREE_PLAN];
	const now = new Date();

	const [row] = await db
		.insert(paystackSubscriptions)
		.values({
			userId,
			plan: FREE_PLAN,
			status: 'active',
			currentPeriodStart: now,
			// No period end: the free tier does not expire. The entitlement
			// checks read `status`, not the period window, so leaving this open
			// is what makes "free forever" true rather than a rolling renewal
			// that silently lapses if the cron ever stops running.
			currentPeriodEnd: null,
			// Capability snapshot, same as the paid path — a future
			// PLAN_FEATURES change must not retroactively alter entitlements.
			maxProfiles: features.maxProfiles,
			kidsAllowed: features.kidsAllowed,
			// Both null on purpose — this is what excludes the row from the
			// renewal cron. Do not populate them "for consistency".
			nextChargeAt: null,
			paystackAuthorizationCode: null
		})
		.returning();

	void track(userId, 'subscribe', { plan: FREE_PLAN, free: true });

	return json({
		plan: FREE_PLAN,
		status: row?.status ?? 'active',
		maxProfiles: features.maxProfiles,
		kidsAllowed: features.kidsAllowed
	});
};
