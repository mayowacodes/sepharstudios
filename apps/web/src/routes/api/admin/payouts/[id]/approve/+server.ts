import { json, type RequestHandler } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';
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
 * Concurrency:
 *   Two admins clicking "approve" at the same time previously raced —
 *   both SELECTs returned status='pending', both fired stripe.transfers
 *   .create, both flipped the row to in_transit, and Stripe ended up
 *   double-paying the creator. We now hold a row-level lock for the
 *   duration of the decision:
 *     BEGIN
 *       SELECT … FOR UPDATE   -- losers block here
 *       (check status, hold window)
 *       UPDATE … SET status=… -- commits the new status
 *     COMMIT
 *   so the second admin's transaction unblocks AFTER the first has
 *   already moved the row out of 'pending', causing the duplicate
 *   approval to short-circuit with the normal "Cannot approve a payout
 *   in status in_transit" path. The Stripe API call itself remains
 *   outside the transaction (no DB locks held during network I/O) but
 *   is guarded by the post-lock status flip.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });
	const payoutId = params.id!;

	// Phase 1: lock the row and decide what to do. We exit the transaction
	// with one of three outcomes — short-circuit (already approved /
	// reserve hold), proceed-stripe, or proceed-paystack — and act on it
	// outside the lock so a slow Stripe round-trip doesn't pin the row.
	type LockedRow = {
		id: string;
		creatorId: string;
		processor: string;
		netCents: number;
		currency: string;
		stripeAccountId: string | null;
		stripePayoutsEnabled: boolean | null;
	};
	type LockResult =
		| { kind: 'short'; status: number; body: Record<string, unknown> }
		| { kind: 'stripe'; row: LockedRow }
		| { kind: 'paystack'; row: LockedRow };

	type LockedDbRow = {
		id: string;
		creator_id: string;
		processor: string;
		net_cents: number;
		currency: string;
		status: string;
		held_until: Date | null;
		stripe_account_id: string | null;
		stripe_payouts_enabled: boolean | null;
	};

	const decision: LockResult = await db.transaction(async (tx) => {
		const result = await tx.execute<LockedDbRow>(sql`
			SELECT p.id, p.creator_id, p.processor, p.net_cents, p.currency, p.status, p.held_until,
			       c.stripe_account_id, c.stripe_payouts_enabled
			FROM ${payouts} p
			LEFT JOIN ${creators} c ON c.id = p.creator_id
			WHERE p.id = ${payoutId}
			FOR UPDATE OF p
		`);
		// postgres-js returns rows under various shapes depending on the SDK; normalize.
		const rows = ((result as unknown) as { rows?: LockedDbRow[] }).rows
			?? (result as unknown as LockedDbRow[]);
		const row = rows?.[0];
		if (!row) return { kind: 'short', status: 404, body: { error: 'Not found' } };
		if (row.status !== 'pending') {
			return { kind: 'short', status: 400, body: { error: `Cannot approve a payout in status ${row.status}` } };
		}
		if (row.held_until && row.held_until > new Date()) {
			return {
				kind: 'short',
				status: 423,
				body: { error: `Payout is on reserve hold until ${row.held_until.toISOString()}`, heldUntil: row.held_until }
			};
		}

		const lockedRow: LockedRow = {
			id: row.id,
			creatorId: row.creator_id,
			processor: row.processor,
			netCents: row.net_cents,
			currency: row.currency,
			stripeAccountId: row.stripe_account_id,
			stripePayoutsEnabled: row.stripe_payouts_enabled
		};

		if (row.processor === 'stripe') {
			// Pre-flight the Stripe-only invariants while we still hold the
			// lock so a configuration error doesn't leave the row in 'pending'
			// and observable to a second concurrent approver.
			if (!isStripeConfigured()) {
				return { kind: 'short', status: 503, body: { error: 'Stripe not configured' } };
			}
			if (!row.stripe_account_id || !row.stripe_payouts_enabled) {
				return { kind: 'short', status: 400, body: { error: 'Creator Stripe account is not ready' } };
			}
			// Move the row out of 'pending' INSIDE the transaction so any
			// concurrent admin transaction wakes up to a non-pending row and
			// short-circuits with the message above instead of double-firing.
			await tx.update(payouts)
				.set({ status: 'in_transit', approvedBy: locals.user!.id, approvedAt: new Date() })
				.where(eq(payouts.id, row.id));
			return { kind: 'stripe', row: lockedRow };
		}

		// Paystack path commits to 'approved' inside the lock — the worker
		// picks it up out-of-band.
		await tx.update(payouts)
			.set({ status: 'approved', approvedBy: locals.user!.id, approvedAt: new Date() })
			.where(eq(payouts.id, row.id));
		return { kind: 'paystack', row: lockedRow };
	});

	if (decision.kind === 'short') {
		return json(decision.body, { status: decision.status });
	}

	if (decision.kind === 'paystack') {
		return json({ success: true });
	}

	// Stripe path: row is already in_transit. Now actually fire the
	// transfer. Failure flips the row to 'failed' with the error so an
	// admin can retry from the UI.
	const stripe = getStripe();
	try {
		const transfer = await stripe.transfers.create({
			amount: decision.row.netCents,
			currency: decision.row.currency.toLowerCase(),
			destination: decision.row.stripeAccountId!,
			metadata: { payoutId: decision.row.id }
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
