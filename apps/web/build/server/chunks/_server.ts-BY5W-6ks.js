import { w as db, T as payouts, u as creators } from './drizzle-CKUH7ukq.js';
import { i as isStripeConfigured, g as getStripe } from './stripe2-CDDbjsFl.js';
import { j as json } from './index-Cv5VcsYq.js';
import { sql, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'stripe';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/payouts/[id]/approve/+server.ts
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
var POST = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const payoutId = params.id;
	const decision = await db.transaction(async (tx) => {
		const result = await tx.execute(sql`
			SELECT p.id, p.creator_id, p.processor, p.net_cents, p.currency, p.status, p.held_until,
			       c.stripe_account_id, c.stripe_payouts_enabled
			FROM ${payouts} p
			LEFT JOIN ${creators} c ON c.id = p.creator_id
			WHERE p.id = ${payoutId}
			FOR UPDATE OF p
		`);
		const row = (result.rows ?? result)?.[0];
		if (!row) return {
			kind: "short",
			status: 404,
			body: { error: "Not found" }
		};
		if (row.status !== "pending") return {
			kind: "short",
			status: 400,
			body: { error: `Cannot approve a payout in status ${row.status}` }
		};
		if (row.held_until && row.held_until > /* @__PURE__ */ new Date()) return {
			kind: "short",
			status: 423,
			body: {
				error: `Payout is on reserve hold until ${row.held_until.toISOString()}`,
				heldUntil: row.held_until
			}
		};
		const lockedRow = {
			id: row.id,
			creatorId: row.creator_id,
			processor: row.processor,
			netCents: row.net_cents,
			currency: row.currency,
			stripeAccountId: row.stripe_account_id,
			stripePayoutsEnabled: row.stripe_payouts_enabled
		};
		if (row.processor === "stripe") {
			if (!isStripeConfigured()) return {
				kind: "short",
				status: 503,
				body: { error: "Stripe not configured" }
			};
			if (!row.stripe_account_id || !row.stripe_payouts_enabled) return {
				kind: "short",
				status: 400,
				body: { error: "Creator Stripe account is not ready" }
			};
			await tx.update(payouts).set({
				status: "in_transit",
				approvedBy: locals.user.id,
				approvedAt: /* @__PURE__ */ new Date()
			}).where(eq(payouts.id, row.id));
			return {
				kind: "stripe",
				row: lockedRow
			};
		}
		await tx.update(payouts).set({
			status: "approved",
			approvedBy: locals.user.id,
			approvedAt: /* @__PURE__ */ new Date()
		}).where(eq(payouts.id, row.id));
		return {
			kind: "paystack",
			row: lockedRow
		};
	});
	if (decision.kind === "short") return json(decision.body, { status: decision.status });
	if (decision.kind === "paystack") return json({ success: true });
	const stripe = getStripe();
	try {
		const transfer = await stripe.transfers.create({
			amount: decision.row.netCents,
			currency: decision.row.currency.toLowerCase(),
			destination: decision.row.stripeAccountId,
			metadata: { payoutId: decision.row.id }
		});
		await db.update(payouts).set({ processorPayoutId: transfer.id }).where(eq(payouts.id, decision.row.id));
		return json({
			success: true,
			transferId: transfer.id
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		await db.update(payouts).set({
			status: "failed",
			failureReason: message
		}).where(eq(payouts.id, decision.row.id));
		return json({
			error: "Stripe transfer failed",
			detail: message
		}, { status: 502 });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-BY5W-6ks.js.map
