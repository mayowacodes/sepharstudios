import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { payouts, creators } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { getStripe, isStripeConfigured } from '$lib/server/stripe';

/**
 * POST /api/admin/payouts/[id]/approve
 *
 * Admin signs off on a pending payout. For Stripe payouts this fires the
 * actual transfer; for Paystack it just marks the row as approved (the
 * existing settlement worker picks it up out-of-band).
 *
 * Idempotent only at the DB-status level — we won't double-transfer a
 * payout that's already in_transit / paid.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [row] = await db.select({
		id: payouts.id,
		creatorId: payouts.creatorId,
		processor: payouts.processor,
		netCents: payouts.netCents,
		currency: payouts.currency,
		status: payouts.status,
		heldUntil: payouts.heldUntil,
		stripeAccountId: creators.stripeAccountId,
		stripePayoutsEnabled: creators.stripePayoutsEnabled
	})
		.from(payouts)
		.leftJoin(creators, eq(payouts.creatorId, creators.id))
		.where(eq(payouts.id, params.id!))
		.limit(1);

	if (!row) return json({ error: 'Not found' }, { status: 404 });
	if (row.status !== 'pending') {
		return json({ error: `Cannot approve a payout in status ${row.status}` }, { status: 400 });
	}
	// Honor the reserve window. Admin can override by clearing held_until
	// from a separate "release reserve" endpoint (not in this round).
	if (row.heldUntil && row.heldUntil > new Date()) {
		return json({
			error: `Payout is on reserve hold until ${row.heldUntil.toISOString()}`,
			heldUntil: row.heldUntil
		}, { status: 423 });
	}

	if (row.processor === 'stripe') {
		if (!isStripeConfigured()) {
			return json({ error: 'Stripe not configured' }, { status: 503 });
		}
		if (!row.stripeAccountId || !row.stripePayoutsEnabled) {
			return json({ error: 'Creator Stripe account is not ready' }, { status: 400 });
		}

		const stripe = getStripe();
		try {
			const transfer = await stripe.transfers.create({
				amount: row.netCents,
				currency: row.currency.toLowerCase(),
				destination: row.stripeAccountId,
				metadata: { payoutId: row.id }
			});
			await db.update(payouts)
				.set({
					status: 'in_transit',
					processorPayoutId: transfer.id,
					approvedBy: locals.user!.id,
					approvedAt: new Date()
				})
				.where(eq(payouts.id, row.id));
			return json({ success: true, transferId: transfer.id });
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			await db.update(payouts)
				.set({ status: 'failed', failureReason: message })
				.where(eq(payouts.id, row.id));
			return json({ error: 'Stripe transfer failed', detail: message }, { status: 502 });
		}
	}

	// Paystack path: settlement happens out-of-band via the existing settlement
	// worker. Approving just transitions the row so the worker picks it up.
	await db.update(payouts)
		.set({ status: 'approved', approvedBy: locals.user!.id, approvedAt: new Date() })
		.where(eq(payouts.id, row.id));
	return json({ success: true });
};
