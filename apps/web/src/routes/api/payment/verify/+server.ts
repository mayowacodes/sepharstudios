import { json, type RequestHandler } from '@sveltejs/kit';
import { verifyTransaction } from '$lib/payment/paystack';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, trialBlacklist, familyAddons, notificationPreferences } from '$lib/db/schema/sepharstudios';
import { eq, or } from 'drizzle-orm';
import { sendTrialWelcome } from '$lib/server/notifications';
import { user } from '$lib/db/schema';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const reference = url.searchParams.get('reference') ?? url.searchParams.get('trxref');
	if (!reference) return json({ error: 'Missing reference' }, { status: 400 });

	try {
		const tx = await verifyTransaction(reference);

		if (tx.status !== 'success') {
			return json({ error: 'Payment not successful' }, { status: 402 });
		}

		const meta = tx as unknown as { metadata: { userId: string; plan: string; addFamily: boolean; isTrial: boolean } };
		const { plan, addFamily, isTrial } = meta.metadata;
		const userId = session.user.id;
		const cardSig = tx.authorization?.signature;

		// Anti-abuse: block reused cards
		if (cardSig && isTrial) {
			const blocked = await db.select().from(trialBlacklist)
				.where(eq(trialBlacklist.cardSignature, cardSig))
				.limit(1);
			if (blocked.length > 0) {
				return json({ error: 'This payment method has already been used for a free trial.' }, { status: 409 });
			}
		}

		// Trial dates: 3 months from now
		const now = new Date();
		const trialEnd = new Date(now);
		trialEnd.setMonth(trialEnd.getMonth() + 3);

		// Create subscription record
		const [sub] = await db.insert(paystackSubscriptions).values({
			userId,
			plan,
			status: isTrial ? 'trial' : 'active',
			trialStartDate: isTrial ? now : null,
			trialEndDate: isTrial ? trialEnd : null,
			currentPeriodStart: now,
			currentPeriodEnd: isTrial ? trialEnd : new Date(now.setMonth(now.getMonth() + 1)),
			paystackCustomerCode: tx.customer?.customer_code,
			paystackAuthorizationCode: tx.authorization?.authorization_code,
			cardSignature: cardSig,
			cardLast4: tx.authorization?.last4,
			cardBrand: tx.authorization?.brand
		}).returning();

		// Add family add-on if requested
		if (addFamily && sub) {
			await db.insert(familyAddons).values({
				subscriptionId: sub.id,
				userId,
				paystackAuthorizationCode: tx.authorization?.authorization_code
			});
		}

		// Record card in blacklist (for future trial abuse prevention)
		if (cardSig && isTrial) {
			await db.insert(trialBlacklist).values({
				cardSignature: cardSig,
				reason: `trial_started_by_${userId}`
			});
		}

		// Create default notification preferences
		await db.insert(notificationPreferences).values({ userId }).onConflictDoNothing();

		// Send welcome email
		await sendTrialWelcome(session.user.email, session.user.name, plan, trialEnd);

		return json({ success: true, plan, trialEndDate: trialEnd });
	} catch (err) {
		console.error('Payment verify error:', err);
		return json({ error: 'Verification failed' }, { status: 500 });
	}
};
