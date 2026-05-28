import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { ppvContent, ppvPurchases, paystackSubscriptions, paymentIntents } from '$lib/db/schema/sepharstudios';
import { and, eq, desc } from 'drizzle-orm';
import { chargeAuthorization, initializeTransaction } from '$lib/payment/paystack';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { contentId } = await request.json() as { contentId: string };
	const userId = session.user.id;

	const [ppv] = await db.select()
		.from(ppvContent)
		.where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true)))
		.limit(1);

	if (!ppv) return json({ error: 'Content is not PPV' }, { status: 400 });

	// Already purchased?
	const [existing] = await db.select()
		.from(ppvPurchases)
		.where(and(eq(ppvPurchases.userId, userId), eq(ppvPurchases.contentId, contentId)))
		.limit(1);
	if (existing) return json({ error: 'Already purchased' }, { status: 409 });

	const [sub] = await db.select()
		.from(paystackSubscriptions)
		.where(eq(paystackSubscriptions.userId, userId))
		.orderBy(desc(paystackSubscriptions.createdAt))
		.limit(1);

	const reference = `ppv_${userId.slice(0, 8)}_${contentId.slice(0, 8)}_${Date.now()}`;

	try {
		// Record the intent before any payment-side action so we have a server-
		// side source of truth for what was attempted.
		await db.insert(paymentIntents).values({
			reference,
			userId,
			kind: 'ppv',
			amountCents: ppv.finalPriceCents,
			contentId
		});

		// Path A: charge the saved card directly. No Paystack checkout, no
		// redirect — the user is back inside the app immediately. We only
		// allow this when the prior auth has cleared (status='active' or
		// 'trial'); a paused/cancelled sub means the card is suspect, so we
		// fall through to the full checkout path.
		if (
			sub?.paystackAuthorizationCode &&
			(sub.status === 'active' || sub.status === 'trial')
		) {
			const tx = await chargeAuthorization({
				authorizationCode: sub.paystackAuthorizationCode,
				email: session.user.email,
				amountKobo: ppv.finalPriceCents,
				reference,
				metadata: { userId, contentId, type: 'ppv' }
			});

			if (tx.status !== 'success') {
				throw new Error(`Charge failed with status: ${tx.status}`);
			}

			// Record the purchase + consume the intent atomically.
			await db.transaction(async (txDb) => {
				await txDb.insert(ppvPurchases).values({
					userId,
					contentId,
					amountPaidCents: ppv.finalPriceCents,
					paystackReference: reference
				});
				await txDb.update(paymentIntents)
					.set({ status: 'consumed', consumedAt: new Date() })
					.where(eq(paymentIntents.reference, reference));
			});

			return json({
				success: true,
				purchased: true,
				reference,
				priceCents: ppv.finalPriceCents,
				method: 'saved_card'
			});
		}

		// Path B: no saved card → full Paystack checkout. The /api/ppv/complete
		// callback verifies the transaction and inserts the ppvPurchases row.
		const initTx = await initializeTransaction({
			email: session.user.email,
			amountKobo: ppv.finalPriceCents,
			reference,
			callbackUrl: `${env.PUBLIC_SITE_URL ?? 'http://localhost:5173'}/api/ppv/complete`,
			metadata: { userId, contentId, type: 'ppv' }
		});

		return json({
			authorizationUrl: initTx.authorization_url,
			reference,
			priceCents: ppv.finalPriceCents,
			method: 'checkout'
		});
	} catch (err) {
		console.error('PPV purchase error:', err);
		// Best-effort: mark intent as expired so it doesn't stay 'pending' forever.
		await db.update(paymentIntents)
			.set({ status: 'expired' })
			.where(eq(paymentIntents.reference, reference))
			.catch(() => {});
		return json({ error: 'Payment failed. Please try again.' }, { status: 500 });
	}
};
