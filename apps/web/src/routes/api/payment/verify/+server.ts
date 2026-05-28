import { json, type RequestHandler } from '@sveltejs/kit';
import { verifyTransaction, PLAN_FEATURES, type PlanName } from '$lib/payment/paystack';
import { db } from '$lib/db/drizzle';
import {
	paystackSubscriptions,
	trialBlacklist,
	familyAddons,
	notificationPreferences,
	paymentIntents
} from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { sendTrialWelcome } from '$lib/server/notifications';
import { track } from '$lib/server/analytics';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const reference = url.searchParams.get('reference') ?? url.searchParams.get('trxref');
	if (!reference) return json({ error: 'Missing reference' }, { status: 400 });

	// Idempotency: if this reference was already consumed (user refreshed the
	// callback URL), surface the prior subscription instead of creating a duplicate.
	const [intent] = await db.select()
		.from(paymentIntents)
		.where(eq(paymentIntents.reference, reference))
		.limit(1);

	if (!intent) {
		return json({ error: 'Unknown payment reference' }, { status: 404 });
	}
	if (intent.userId !== session.user.id) {
		// Another user's intent — never let cross-user verification succeed.
		return json({ error: 'Reference does not belong to this account' }, { status: 403 });
	}
	if (intent.status === 'consumed') {
		// Already verified once. Return success-shaped response so a refresh of the
		// callback URL just no-ops instead of erroring.
		const [existingSub] = await db.select()
			.from(paystackSubscriptions)
			.where(eq(paystackSubscriptions.userId, session.user.id))
			.limit(1);
		return json({
			success: true,
			plan: intent.plan,
			trialEndDate: existingSub?.trialEndDate,
			alreadyConsumed: true
		});
	}

	try {
		const tx = await verifyTransaction(reference);

		if (tx.status !== 'success') {
			return json({ error: 'Payment not successful' }, { status: 402 });
		}

		// SERVER-SIDE source of truth: use the payment_intent (which we wrote in
		// initialize before redirecting) rather than client-controlled Paystack
		// metadata. The metadata is treated as advisory only.
		const plan = intent.plan as PlanName;
		const features = PLAN_FEATURES[plan];
		if (!features) {
			console.error('Unknown plan in intent:', { reference, plan });
			return json({ error: 'Unknown plan' }, { status: 502 });
		}

		const addFamily = intent.addFamily;
		const isTrial = intent.isTrial;
		const userId = session.user.id;
		const cardSig = tx.authorization?.signature;

		// Anti-abuse: block reused cards on trial signups. The unique constraint on
		// trial_blacklist.card_signature (migration 0016) makes the subsequent
		// insert atomic — no TOCTOU between the check and the insert.
		if (cardSig && isTrial) {
			const blocked = await db.select().from(trialBlacklist)
				.where(eq(trialBlacklist.cardSignature, cardSig))
				.limit(1);
			if (blocked.length > 0) {
				return json({ error: 'This payment method has already been used for a free trial.' }, { status: 409 });
			}
		}

		const now = new Date();
		const trialEnd = new Date(now);
		trialEnd.setMonth(trialEnd.getMonth() + 3);

		// Wrap subscription create + blacklist insert + intent consume in a
		// transaction. If any step fails, rollback so a partial state can't
		// strand the user with a card in the blacklist but no subscription
		// (or vice versa).
		const [sub] = await db.transaction(async (tx2) => {
			const periodEnd = isTrial
				? trialEnd
				: (() => {
					const d = new Date(now);
					d.setMonth(d.getMonth() + features.renewalIntervalMonths);
					return d;
				})();

			const subRow = await tx2.insert(paystackSubscriptions).values({
				userId,
				plan,
				status: isTrial ? 'trial' : 'active',
				trialStartDate: isTrial ? now : null,
				trialEndDate: isTrial ? trialEnd : null,
				currentPeriodStart: now,
				currentPeriodEnd: periodEnd,
				// Capability snapshot — locks the user's entitlements at sub-creation
				// time so a future PLAN_FEATURES change doesn't silently change
				// existing subscribers' access.
				maxProfiles: features.maxProfiles,
				kidsAllowed: features.kidsAllowed,
				// Next renewal: same as period end (covers trial and paid alike)
				nextChargeAt: periodEnd,
				paystackCustomerCode: tx.customer?.customer_code,
				paystackAuthorizationCode: tx.authorization?.authorization_code,
				cardSignature: cardSig,
				cardLast4: tx.authorization?.last4,
				cardBrand: tx.authorization?.brand
			}).returning();

			if (addFamily && subRow[0]) {
				await tx2.insert(familyAddons).values({
					subscriptionId: subRow[0].id,
					userId,
					paystackAuthorizationCode: tx.authorization?.authorization_code
				});
			}

			if (cardSig && isTrial) {
				// Unique constraint enforces atomicity vs. parallel calls; onConflict
				// silently drops a duplicate (already blacklisted from a concurrent
				// successful trial) so the flow doesn't error out.
				await tx2.insert(trialBlacklist).values({
					cardSignature: cardSig,
					reason: `trial_started_by_${userId}`
				}).onConflictDoNothing();
			}

			await tx2.update(paymentIntents)
				.set({ status: 'consumed', consumedAt: new Date() })
				.where(eq(paymentIntents.reference, reference));

			return subRow;
		});

		// Default notification prefs + welcome email + analytics happen outside the
		// transaction — best-effort side-effects.
		await db.insert(notificationPreferences).values({ userId }).onConflictDoNothing();
		await sendTrialWelcome(session.user.email, session.user.name, plan, trialEnd);
		await track(userId, 'subscribe', { plan, isTrial, addFamily });

		return json({ success: true, plan, trialEndDate: trialEnd });
	} catch (err) {
		console.error('Payment verify error:', err);
		return json({ error: 'Verification failed' }, { status: 500 });
	}
};
