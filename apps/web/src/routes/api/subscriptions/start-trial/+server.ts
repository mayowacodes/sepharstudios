import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { trialBlacklist, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, or, and, inArray } from 'drizzle-orm';
import { verifyOtp, getPhoneHash } from '$lib/server/otp';
import { createCustomer, type PlanName, PLAN_PRICES_CENTS } from '$lib/payment/paystack';

/**
 * POST /api/subscriptions/start-trial
 *
 * Pre-flight check before Paystack card entry.
 * Verifies OTP, runs all three anti-abuse layers, creates Paystack customer.
 * Returns { eligible: true, customerCode } or an error.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { plan, phone, otp, deviceFingerprint } = await request.json() as {
		plan: string;
		phone: string;
		otp: string;
		deviceFingerprint?: string;
	};

	if (!plan || !PLAN_PRICES_CENTS[plan as PlanName]) {
		return json({ error: 'Invalid plan' }, { status: 400 });
	}

	if (!phone?.trim() || !otp?.trim()) {
		return json({ error: 'Phone number and verification code are required' }, { status: 400 });
	}

	// 1. Verify OTP
	const otpValid = verifyOtp(phone, otp);
	if (!otpValid) {
		return json({ error: 'Invalid or expired verification code' }, { status: 400 });
	}

	// 2. Check if user already has an active or trial subscription
	const existingSub = await db
		.select({ id: paystackSubscriptions.id, status: paystackSubscriptions.status })
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, session.user.id))
		.limit(1)
		.then((r) => r[0] ?? null);

	if (existingSub && inArray(existingSub.status as string, ['trial', 'active'])) {
		return json({ error: 'You already have an active subscription' }, { status: 409 });
	}

	// 3. Anti-abuse: phone hash check
	const phoneHash = getPhoneHash(phone);
	const blacklistConditions = [eq(trialBlacklist.phoneHash, phoneHash)];
	if (deviceFingerprint) {
		blacklistConditions.push(eq(trialBlacklist.deviceFingerprint, deviceFingerprint));
	}

	const blacklisted = await db
		.select({ id: trialBlacklist.id })
		.from(trialBlacklist)
		.where(or(...blacklistConditions))
		.limit(1)
		.then((r) => r[0] ?? null);

	if (blacklisted) {
		return json(
			{ error: 'This account is not eligible for a free trial' },
			{ status: 409 }
		);
	}

	// 4. Pre-register device fingerprint in blacklist (card sig added after Paystack verify)
	if (deviceFingerprint) {
		await db.insert(trialBlacklist).values({
			phoneHash,
			deviceFingerprint,
			reason: `trial_preflight_${session.user.id}`
		});
	}

	// 5. Create Paystack customer so the checkout flow has a customer code
	try {
		const customer = await createCustomer(session.user.email, session.user.name ?? session.user.email);
		return json({ eligible: true, customerCode: customer.customer_code });
	} catch (err) {
		console.error('Paystack createCustomer error:', err);
		// Non-fatal: customer creation failure doesn't block trial; Paystack creates one during payment
		return json({ eligible: true, customerCode: null });
	}
};
