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

//#region src/routes/api/admin/payouts/[id]/retry/+server.ts
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
var POST = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const payoutId = params.id;
	const decision = await db.transaction(async (tx) => {
		const result = await tx.execute(sql`
			SELECT p.id, p.creator_id, p.processor, p.net_cents, p.currency, p.status,
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
		if (row.status !== "failed") return {
			kind: "short",
			status: 400,
			body: { error: `Cannot retry a payout in status ${row.status}` }
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
				failureReason: null,
				approvedBy: locals.user.id,
				approvedAt: /* @__PURE__ */ new Date()
			}).where(eq(payouts.id, row.id));
			return {
				kind: "stripe",
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
		await tx.update(payouts).set({
			status: "approved",
			failureReason: null,
			processorPayoutId: null,
			approvedBy: locals.user.id,
			approvedAt: /* @__PURE__ */ new Date()
		}).where(eq(payouts.id, row.id));
		return { kind: "paystack" };
	});
	if (decision.kind === "short") return json(decision.body, { status: decision.status });
	if (decision.kind === "paystack") return json({ success: true });
	const stripe = getStripe();
	try {
		const transfer = await stripe.transfers.create({
			amount: decision.row.netCents,
			currency: decision.row.currency.toLowerCase(),
			destination: decision.row.stripeAccountId,
			metadata: {
				payoutId: decision.row.id,
				retry: "1"
			}
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
//# sourceMappingURL=_server.ts-D5jXEIGw.js.map
