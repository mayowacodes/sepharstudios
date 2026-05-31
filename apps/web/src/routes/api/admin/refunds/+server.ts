import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { refunds, paymentIntents, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, desc, ilike, or } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';
import { createRefund } from '$lib/payment/paystack';
import { notify } from '$lib/server/notify';

/**
 * POST /api/admin/refunds
 *
 * Issue a refund against a Paystack transaction reference. Admin-only.
 * Writes a row to `refunds` (audit log) BEFORE calling Paystack so we have a
 * record even if the Paystack call fails halfway. The row's `status` reflects
 * the Paystack outcome.
 *
 * Body: { reference: string, amountCents?: number, reason?: string }
 *
 * If `amountCents` is omitted, Paystack refunds the full transaction amount.
 */
export const POST: RequestHandler = async ({ locals, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error!;

	const body = await request.json() as {
		reference?: string;
		amountCents?: number;
		reason?: string;
		processor?: 'paystack' | 'stripe';
	};

	if (!body.reference) return json({ error: 'reference is required' }, { status: 400 });
	if (body.amountCents !== undefined && body.amountCents <= 0) {
		return json({ error: 'amountCents must be positive' }, { status: 400 });
	}

	const processor = body.processor ?? 'paystack';
	if (!['paystack', 'stripe'].includes(processor)) {
		return json({ error: `Unknown processor: ${processor}` }, { status: 400 });
	}

	// Resolve the user this refund belongs to via the payment_intent for the
	// reference. We need the user_id for the audit row + the user notification.
	const [intent] = await db.select()
		.from(paymentIntents)
		.where(eq(paymentIntents.reference, body.reference))
		.limit(1);

	if (!intent) {
		return json({ error: 'No payment_intent matches this reference' }, { status: 404 });
	}

	// Stripe-side refund branch (Payouts 4C). The `reference` is a Stripe
	// payment_intent id (pi_...) or charge id (ch_...); we accept either.
	if (processor === 'stripe') {
		const { getStripe, isStripeConfigured } = await import('$lib/server/stripe');
		if (!isStripeConfigured()) {
			return json({ error: 'Stripe not configured' }, { status: 503 });
		}
		const amountCents = body.amountCents ?? intent.amountCents;
		const [auditRow] = await db.insert(refunds).values({
			userId: intent.userId,
			reference: body.reference,
			amountCents,
			reason: body.reason ?? null,
			issuedBy: session.user.id,
			status: 'pending'
		}).returning();

		try {
			const stripe = getStripe();
			const refundPayload: import('stripe').Stripe.RefundCreateParams = { amount: amountCents };
			if (body.reference.startsWith('pi_')) refundPayload.payment_intent = body.reference;
			else refundPayload.charge = body.reference;
			if (body.reason) refundPayload.reason = 'requested_by_customer';
			const refund = await stripe.refunds.create(refundPayload);

			await db.update(refunds)
				.set({
					status: refund.status === 'succeeded' ? 'success' : 'pending',
					paystackResponse: refund as unknown as Record<string, unknown>
				})
				.where(eq(refunds.id, auditRow.id));

			await notify({
				userId: intent.userId,
				kind: 'subscription',
				title: 'Refund issued',
				message: `A refund of $${(amountCents / 100).toFixed(2)} has been processed via Stripe. Allow 5–10 business days.`,
				actionUrl: '/settings'
			});
			return json({ success: true, refundId: auditRow.id, stripe: refund });
		} catch (err) {
			// Persist the full error to the audit row so support can debug
			// later, but only return a generic message to the client. Raw
			// processor errors can leak card last-4, declined-reason chains,
			// internal Stripe ids, etc.
			await db.update(refunds)
				.set({
					status: 'failed',
					paystackResponse: { error: (err as Error).message } as Record<string, unknown>
				})
				.where(eq(refunds.id, auditRow.id));
			console.error('[admin/refunds] Stripe refund failed:', err);
			return json({
				error: 'Stripe refund failed — see audit row for details',
				refundId: auditRow.id
			}, { status: 502 });
		}
	}

	const amountCents = body.amountCents ?? intent.amountCents;

	const [auditRow] = await db.insert(refunds).values({
		userId: intent.userId,
		reference: body.reference,
		amountCents,
		reason: body.reason ?? null,
		issuedBy: session.user.id,
		status: 'pending'
	}).returning();

	try {
		// Use the resolved amountCents (falls back to the intent total when
		// the admin omits an explicit amount) rather than raw body input —
		// raw body.amountCents can be undefined here, which would either
		// blow up Paystack or default to a different amount than the audit
		// row records.
		const paystackResult = await createRefund({
			transactionReference: body.reference,
			amountKobo: amountCents,
			merchantNote: body.reason
		});

		await db.update(refunds)
			.set({
				status: paystackResult.status === 'pending' ? 'pending' : 'success',
				paystackResponse: paystackResult as unknown as Record<string, unknown>
			})
			.where(eq(refunds.id, auditRow.id));

		// If the refund covers a subscription, pause the subscription so the user
		// isn't double-billed by the cron worker on the next renewal cycle.
		if (intent.kind === 'subscription' || intent.kind === 'renewal') {
			await db.update(paystackSubscriptions)
				.set({ status: 'cancelled', cancelledAt: new Date(), updatedAt: new Date() })
				.where(eq(paystackSubscriptions.userId, intent.userId));
		}

		await notify({
			userId: intent.userId,
			kind: 'subscription',
			title: 'Refund issued',
			message: `A refund of $${(amountCents / 100).toFixed(2)} has been processed to your card. Allow 5–10 business days for it to appear on your statement.`,
			actionUrl: '/settings'
		});

		return json({ success: true, refundId: auditRow.id, paystack: paystackResult });
	} catch (err) {
		await db.update(refunds)
			.set({
				status: 'failed',
				paystackResponse: { error: (err as Error).message } as Record<string, unknown>
			})
			.where(eq(refunds.id, auditRow.id));

		console.error('[admin/refunds] Paystack refund failed:', err);
		return json({
			error: 'Paystack refund failed — see audit row for details',
			refundId: auditRow.id
		}, { status: 502 });
	}
};

/**
 * GET /api/admin/refunds
 *
 * List refunds (filterable + searchable). Admin-only.
 * Query: ?status=&q=&limit=&offset=
 *   - status: 'pending' | 'success' | 'failed'
 *   - q: matches refund reference or user email/name (case-insensitive)
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10) || 50, 200);
	const offset = Math.max(parseInt(url.searchParams.get('offset') ?? '0', 10) || 0, 0);
	const status = url.searchParams.get('status');
	const q = url.searchParams.get('q')?.trim() ?? '';

	const conditions = [] as ReturnType<typeof eq>[];
	if (status && ['pending', 'success', 'failed'].includes(status)) {
		conditions.push(eq(refunds.status, status));
	}
	if (q) {
		conditions.push(
			or(
				ilike(refunds.reference, `%${q}%`),
				ilike(user.email, `%${q}%`),
				ilike(user.name, `%${q}%`)
			)!
		);
	}
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const rows = await db.select({
		id: refunds.id,
		userId: refunds.userId,
		reference: refunds.reference,
		amountCents: refunds.amountCents,
		currency: refunds.currency,
		reason: refunds.reason,
		status: refunds.status,
		createdAt: refunds.createdAt,
		issuedBy: refunds.issuedBy,
		userEmail: user.email,
		userName: user.name
	})
		.from(refunds)
		.leftJoin(user, eq(refunds.userId, user.id))
		.where(where)
		.orderBy(desc(refunds.createdAt))
		.limit(limit)
		.offset(offset);

	return json({ refunds: rows });
};
