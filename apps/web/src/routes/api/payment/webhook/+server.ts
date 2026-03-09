import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('x-paystack-signature');
	const secret = env.PAYSTACK_SECRET_KEY;

	if (!secret) {
		return json({ error: 'PAYSTACK_SECRET_KEY is not configured' }, { status: 500 });
	}

	// Verify webhook authenticity
	const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
	if (hash !== signature) {
		return json({ error: 'Invalid signature' }, { status: 401 });
	}

	const event = JSON.parse(body) as { event: string; data: Record<string, unknown> };

	switch (event.event) {
		case 'charge.success': {
			const data = event.data as { metadata: { userId: string; plan: string }; authorization: { authorization_code: string } };
			const userId = data.metadata?.userId;
			if (!userId) break;

			// Update subscription to active on successful charge
			await db.update(paystackSubscriptions)
				.set({ status: 'active', updatedAt: new Date() })
				.where(eq(paystackSubscriptions.userId, userId));
			break;
		}

		case 'subscription.disable': {
			const data = event.data as { customer: { id: string }; subscription_code: string };
			await db.update(paystackSubscriptions)
				.set({ status: 'cancelled', cancelledAt: new Date(), updatedAt: new Date() })
				.where(eq(paystackSubscriptions.paystackSubscriptionCode, data.subscription_code));
			break;
		}

		case 'invoice.payment_failed': {
			const data = event.data as { subscription: { subscription_code: string } };
			await db.update(paystackSubscriptions)
				.set({ status: 'paused', updatedAt: new Date() })
				.where(eq(paystackSubscriptions.paystackSubscriptionCode, data.subscription.subscription_code));
			break;
		}
	}

	return json({ received: true });
};
