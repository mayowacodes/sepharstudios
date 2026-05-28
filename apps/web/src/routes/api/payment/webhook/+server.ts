import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { notify } from '$lib/server/notify';

interface PaystackEvent {
	event: string;
	data: Record<string, unknown>;
}

function isPaystackEvent(value: unknown): value is PaystackEvent {
	return (
		!!value &&
		typeof value === 'object' &&
		typeof (value as { event?: unknown }).event === 'string' &&
		typeof (value as { data?: unknown }).data === 'object'
	);
}

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

	// Guard against malformed JSON — webhook bodies are attacker-controlled at the
	// transport level even though we verified the signature, and a parse crash
	// here would 500 to Paystack, who would then retry forever.
	let event: PaystackEvent;
	try {
		const parsed = JSON.parse(body) as unknown;
		if (!isPaystackEvent(parsed)) {
			return json({ error: 'Malformed webhook body' }, { status: 400 });
		}
		event = parsed;
	} catch {
		return json({ error: 'Webhook body is not valid JSON' }, { status: 400 });
	}

	switch (event.event) {
		case 'charge.success': {
			const data = event.data as { metadata?: { userId?: string; plan?: string }; authorization?: { authorization_code?: string } };
			const userId = data.metadata?.userId;
			if (!userId) {
				console.warn('charge.success without metadata.userId — skipping');
				break;
			}

			// Update subscription to active on successful charge
			await db.update(paystackSubscriptions)
				.set({ status: 'active', updatedAt: new Date() })
				.where(eq(paystackSubscriptions.userId, userId));

			await notify({
				userId,
				kind: 'subscription',
				title: 'Payment successful',
				message: 'Your Sephar Studios subscription is active. Enjoy unlimited faith-based content.',
				actionUrl: '/browse'
			});
			break;
		}

		case 'subscription.disable': {
			const data = event.data as { customer?: { id?: string }; subscription_code?: string };
			if (!data.subscription_code) {
				console.warn('subscription.disable without subscription_code — skipping');
				break;
			}
			const [sub] = await db.update(paystackSubscriptions)
				.set({ status: 'cancelled', cancelledAt: new Date(), updatedAt: new Date() })
				.where(eq(paystackSubscriptions.paystackSubscriptionCode, data.subscription_code))
				.returning({ userId: paystackSubscriptions.userId });

			if (sub?.userId) {
				await notify({
					userId: sub.userId,
					kind: 'subscription',
					title: 'Subscription cancelled',
					message: 'Your subscription has been cancelled. You can resubscribe anytime.',
					actionUrl: '/plans'
				});
			}
			break;
		}

		case 'invoice.payment_failed': {
			const data = event.data as { subscription?: { subscription_code?: string } };
			const code = data.subscription?.subscription_code;
			if (!code) {
				console.warn('invoice.payment_failed without subscription.subscription_code — skipping');
				break;
			}
			const [sub] = await db.update(paystackSubscriptions)
				.set({ status: 'paused', updatedAt: new Date() })
				.where(eq(paystackSubscriptions.paystackSubscriptionCode, code))
				.returning({ userId: paystackSubscriptions.userId });

			if (sub?.userId) {
				await notify({
					userId: sub.userId,
					kind: 'subscription',
					title: 'Payment failed',
					message: "We couldn't process your subscription payment. Update your card to keep your access active.",
					actionUrl: '/settings'
				});
			}
			break;
		}

		default:
			// Unknown event — ack so Paystack stops retrying, but log for visibility.
			console.info('Unhandled Paystack webhook event:', event.event);
	}

	return json({ received: true });
};
