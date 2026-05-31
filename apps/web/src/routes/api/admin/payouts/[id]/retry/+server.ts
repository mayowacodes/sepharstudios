import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { payouts, creators } from '$lib/db/schema/sepharstudios';
import { eq, sql } from 'drizzle-orm';
import { getStripe, isStripeConfigured } from '$lib/server/stripe';

/**
 * POST /api/admin/payouts/[id]/retry
 *
 * Re-attempts a payout whose previous send failed (Stripe transfer error,
 * Paystack settlement worker error, etc.). Only accepted for rows in the
 * `failed` state — every other status has its own correct next-step
 * (approve/hold/release).
 *
 * Concurrency: uses the same row-lock pattern as approve to keep two
 * admins from both retrying a failed payout in parallel (which would
 * either double-transfer via Stripe or double-queue a Paystack
 * settlement). The status flip out of 'failed' happens inside the
 * transaction; the actual Stripe call runs outside the DB lock so a
 * slow network call doesn't pin the row.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });
	const payoutId = params.id!;

	type LockedDbRow = {
		id: string;
		creator_id: string;
		processor: string;
		net_cents: number;
		currency: string;
		status: string;
		stripe_account_id: string | null;
		stripe_payouts_enabled: boolean | null;
	};
	type LockedRow = {
		id: string;
		processor: string;
		netCents: number;
		currency: string;
		stripeAccountId: string | null;
		stripePayoutsEnabled: boolean | null;
	};
	type LockResult =
		| { kind: 'short'; status: number; body: Record<string, unknown> }
		| { kind: 'stripe'; row: LockedRow }
		| { kind: 'paystack' };

	const decision: LockResult = await db.transaction(async (tx) => {
		const result = await tx.execute<LockedDbRow>(sql`
			SELECT p.id, p.creator_id, p.processor, p.net_cents, p.currency, p.status,
			       c.stripe_account_id, c.stripe_payouts_enabled
			FROM ${payouts} p
			LEFT JOIN ${creators} c ON c.id = p.creator_id
			WHERE p.id = ${payoutId}
			FOR UPDATE OF p
		`);
		const rows = ((result as unknown) as { rows?: LockedDbRow[] }).rows
			?? (result as unknown as LockedDbRow[]);
		const row = rows?.[0];
		if (!row) return { kind: 'short', status: 404, body: { error: 'Not found' } };
		if (row.status !== 'failed') {
			return { kind: 'short', status: 400, body: { error: `Cannot retry a payout in status ${row.status}` } };
		}

		if (row.processor === 'stripe') {
			if (!isStripeConfigured()) {
				return { kind: 'short', status: 503, body: { error: 'Stripe not configured' } };
			}
			if (!row.stripe_account_id || !row.stripe_payouts_enabled) {
				return { kind: 'short', status: 400, body: { error: 'Creator Stripe account is not ready' } };
			}
			// Flip to in_transit inside the lock so a concurrent retry wakes
			// to a non-failed row and short-circuits.
			await tx.update(payouts)
				.set({
					status: 'in_transit',
					failureReason: null,
					approvedBy: locals.user!.id,
					approvedAt: new Date()
				})
				.where(eq(payouts.id, row.id));
			return {
				kind: 'stripe',
				row: {
					id: row.id,
					processor: row.processor,
					netCents: row.net_cents,
					currency: row.currency,
					stripeAccountId: row.stripe_account_id,
					stripePayoutsEnabled: row.stripe_payouts_enabled
				}
			};
		}

		// Paystack: hand it back to the settlement worker.
		await tx.update(payouts)
			.set({
				status: 'approved',
				failureReason: null,
				processorPayoutId: null,
				approvedBy: locals.user!.id,
				approvedAt: new Date()
			})
			.where(eq(payouts.id, row.id));
		return { kind: 'paystack' };
	});

	if (decision.kind === 'short') {
		return json(decision.body, { status: decision.status });
	}
	if (decision.kind === 'paystack') {
		return json({ success: true });
	}

	const stripe = getStripe();
	try {
		const transfer = await stripe.transfers.create({
			amount: decision.row.netCents,
			currency: decision.row.currency.toLowerCase(),
			destination: decision.row.stripeAccountId!,
			metadata: { payoutId: decision.row.id, retry: '1' }
		});
		await db.update(payouts)
			.set({ processorPayoutId: transfer.id })
			.where(eq(payouts.id, decision.row.id));
		return json({ success: true, transferId: transfer.id });
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		await db.update(payouts)
			.set({ status: 'failed', failureReason: message })
			.where(eq(payouts.id, decision.row.id));
		return json({ error: 'Stripe transfer failed', detail: message }, { status: 502 });
	}
};
