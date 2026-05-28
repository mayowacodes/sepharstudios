import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, paystackEvents } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import { notify } from '$lib/server/notify';

interface PaystackEvent {
	event: string;
	data: Record<string, unknown> & { id?: string | number; reference?: string };
}

function isPaystackEvent(value: unknown): value is PaystackEvent {
	return (
		!!value &&
		typeof value === 'object' &&
		typeof (value as { event?: unknown }).event === 'string' &&
		typeof (value as { data?: unknown }).data === 'object'
	);
}

/**
 * Derive a stable dedup key from a Paystack webhook payload. Paystack doesn't
 * send an explicit event-id at the envelope level, but the `data.id` (numeric
 * transaction/event ID) or `data.reference` is stable across retries of the
 * same event. We prefer `data.id`, falling back to a composite key.
 */
function deriveEventId(event: PaystackEvent): string {
	if (event.data.id !== undefined && event.data.id !== null) {
		return `${event.event}:${event.data.id}`;
	}
	if (typeof event.data.reference === 'string') {
		return `${event.event}:${event.data.reference}`;
	}
	// Last-resort fallback: hash the JSON body. Same payload → same id.
	const json = JSON.stringify(event);
	return `${event.event}:hash:${crypto.createHash('sha256').update(json).digest('hex').slice(0, 32)}`;
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

	// Idempotency: Paystack retries every webhook 3+ times with backoff. The
	// insert below relies on the PRIMARY KEY of paystack_events to atomically
	// detect duplicates — a unique-violation = "already processed", just ack.
	const eventId = deriveEventId(event);
	try {
		await db.insert(paystackEvents).values({
			eventId,
			eventType: event.event,
			payload: event as unknown as Record<string, unknown>
		});
	} catch (err) {
		// Postgres unique_violation = duplicate webhook — return 200 so Paystack
		// stops retrying. Any other error is a real DB failure → bubble as 500.
		const code = (err as { code?: string })?.code;
		if (code === '23505') {
			return json({ received: true, duplicate: true });
		}
		console.error('[webhook] event dedup insert failed:', err);
		return json({ error: 'Internal error' }, { status: 500 });
	}

	// Sephar Studios doesn't create Paystack Subscriptions (we run our own cron-
	// driven renewal — see api/cron/renew-subscriptions). The only event Paystack
	// will actually send us in production is `charge.success`, fired when a
	// transaction we initialized via /api/payment/initialize completes.
	//
	// `subscription.disable` and `invoice.payment_failed` would only fire if
	// Paystack-managed subscriptions existed; they're omitted here. If you
	// later migrate to Paystack Plans, add the handlers back at that point.
	switch (event.event) {
		case 'charge.success': {
			const data = event.data as {
				metadata?: { userId?: string; plan?: string };
				authorization?: { authorization_code?: string };
			};
			const userId = data.metadata?.userId;
			if (!userId) {
				console.warn('charge.success without metadata.userId — skipping');
				break;
			}

			// Defensive: most successful charges are already activated via the verify
			// or cron paths. This handler exists as a safety net if a Paystack
			// callback URL fails and the webhook arrives first.
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

		default:
			// Unknown / unhandled event — ack 200 so Paystack stops retrying. The
			// paystack_events row already captured the payload for audit.
			console.info('Unhandled Paystack webhook event:', event.event);
	}

	return json({ received: true });
};
