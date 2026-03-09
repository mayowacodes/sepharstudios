import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { ppvContent, ppvPurchases, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { and, eq, desc } from 'drizzle-orm';
import { initializeTransaction } from '$lib/payment/paystack';
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

	try {
		// Try to charge saved card first
		const [sub] = await db.select()
			.from(paystackSubscriptions)
			.where(eq(paystackSubscriptions.userId, userId))
			.orderBy(desc(paystackSubscriptions.createdAt))
			.limit(1);

		if (sub?.paystackAuthorizationCode) {
			// Use saved card — will be handled by webhook
			const tx = await initializeTransaction({
				email: session.user.email,
				amountKobo: ppv.finalPriceCents,
				metadata: { userId, contentId, type: 'ppv' }
			});
			return json({ authorizationUrl: tx.authorization_url, reference: tx.reference, priceCents: ppv.finalPriceCents });
		}

		// No saved card — redirect to payment
		const tx = await initializeTransaction({
			email: session.user.email,
			amountKobo: ppv.finalPriceCents,
			callbackUrl: `${env.PUBLIC_SITE_URL ?? 'http://localhost:5173'}/api/ppv/complete`,
			metadata: { userId, contentId, type: 'ppv' }
		});

		return json({ authorizationUrl: tx.authorization_url, reference: tx.reference, priceCents: ppv.finalPriceCents });
	} catch (err) {
		console.error('PPV purchase error:', err);
		return json({ error: 'Payment initialization failed' }, { status: 500 });
	}
};
