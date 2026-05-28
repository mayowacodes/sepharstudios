import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { refunds, paymentIntents, paystackSubscriptions } from '$lib/db/schema/sepharstudios';
import { eq, desc } from 'drizzle-orm';
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
	};

	if (!body.reference) return json({ error: 'reference is required' }, { status: 400 });
	if (body.amountCents !== undefined && body.amountCents <= 0) {
		return json({ error: 'amountCents must be positive' }, { status: 400 });
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
		const paystackResult = await createRefund({
			transactionReference: body.reference,
			amountKobo: body.amountCents,
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
			error: 'Paystack refund failed',
			refundId: auditRow.id,
			detail: (err as Error).message
		}, { status: 502 });
	}
};

/**
 * GET /api/admin/refunds
 *
 * List recent refunds, most recent first. Admin-only.
 */
export const GET: RequestHandler = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10) || 50, 200);

	const rows = await db.select()
		.from(refunds)
		.orderBy(desc(refunds.createdAt))
		.limit(limit);

	return json({ refunds: rows });
};
