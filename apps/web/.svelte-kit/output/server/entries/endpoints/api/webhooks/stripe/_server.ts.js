import { $ as payouts, O as creators, Q as payoutDisputes, a as user, t as db } from "../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../chunks/notify.js";
import { n as getWebhookSecret, r as isStripeConfigured, t as getStripe } from "../../../../../chunks/stripe2.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/webhooks/stripe/+server.ts
/**
* POST /api/webhooks/stripe
*
* Verifies the Stripe signature and routes the event:
*   account.updated                       → sync creator status mirror
*   payout.paid                           → mark payout paid + set paid_at
*   payout.failed                         → mark payout failed + record failure reason
*   charge.dispute.{created,updated,
*     closed,funds_withdrawn,
*     funds_reinstated}                   → upsert payout_disputes row + admin notify
*
* Unknown events return 200 — Stripe retries on non-2xx, and retrying
* events we don't handle yet is wasteful.
*/
function mapAccountStatus(account) {
	const reqs = account.requirements;
	if (reqs?.disabled_reason) return "restricted";
	if (account.payouts_enabled && account.charges_enabled) return "verified";
	if (reqs?.past_due && reqs.past_due.length > 0) return "restricted";
	return "pending";
}
var POST = async ({ request }) => {
	if (!isStripeConfigured()) return json({ error: "Stripe not configured" }, { status: 503 });
	const signature = request.headers.get("stripe-signature");
	if (!signature) return json({ error: "Missing signature" }, { status: 400 });
	const rawBody = await request.text();
	const stripe = getStripe();
	let event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, signature, getWebhookSecret());
	} catch (err) {
		console.warn("[webhooks/stripe] signature verification failed:", err);
		return json({ error: "Invalid signature" }, { status: 400 });
	}
	try {
		switch (event.type) {
			case "account.updated": {
				const account = event.data.object;
				const status = mapAccountStatus(account);
				await db.update(creators).set({
					stripeAccountStatus: status,
					stripePayoutsEnabled: account.payouts_enabled,
					stripeChargesEnabled: account.charges_enabled,
					stripeCountry: account.country ?? void 0,
					updatedAt: /* @__PURE__ */ new Date()
				}).where(eq(creators.stripeAccountId, account.id));
				break;
			}
			case "payout.paid": {
				const payout = event.data.object;
				await db.update(payouts).set({
					status: "paid",
					paidAt: /* @__PURE__ */ new Date(payout.arrival_date * 1e3)
				}).where(eq(payouts.processorPayoutId, payout.id));
				break;
			}
			case "payout.failed": {
				const payout = event.data.object;
				await db.update(payouts).set({
					status: "failed",
					failureReason: payout.failure_message ?? payout.failure_code ?? "unknown"
				}).where(eq(payouts.processorPayoutId, payout.id));
				break;
			}
			case "charge.dispute.created":
			case "charge.dispute.updated":
			case "charge.dispute.closed":
			case "charge.dispute.funds_withdrawn":
			case "charge.dispute.funds_reinstated": {
				const dispute = event.data.object;
				await handleDispute(event.type, dispute);
				break;
			}
			default: break;
		}
	} catch (err) {
		console.error(`[webhooks/stripe] handler for ${event.type} threw:`, err);
		return json({
			received: true,
			warning: "handler error logged"
		});
	}
	return json({ received: true });
};
/**
* Persist or update a payout_dispute row for a Stripe dispute event, fan
* out admin notifications on creation + close, and hold any related
* payout for the duration of the dispute window.
*/
async function handleDispute(eventType, dispute) {
	const localStatus = {
		"won": "won",
		"lost": "lost",
		"warning_closed": "warning_closed",
		"charge_refunded": "withdrawn",
		"needs_response": "open",
		"under_review": "open",
		"warning_needs_response": "open",
		"warning_under_review": "open"
	}[dispute.status] ?? "open";
	const [existing] = await db.select({ id: payoutDisputes.id }).from(payoutDisputes).where(eq(payoutDisputes.processorDisputeId, dispute.id)).limit(1);
	if (!existing) await db.insert(payoutDisputes).values({
		processor: "stripe",
		processorDisputeId: dispute.id,
		payoutId: null,
		ppvPurchaseId: null,
		amountCents: dispute.amount,
		currency: dispute.currency.toUpperCase(),
		reason: dispute.reason.slice(0, 60),
		status: localStatus,
		evidenceDueAt: dispute.evidence_details?.due_by ? /* @__PURE__ */ new Date(dispute.evidence_details.due_by * 1e3) : null,
		rawPayload: dispute,
		closedAt: dispute.status === "won" || dispute.status === "lost" || dispute.status === "warning_closed" ? /* @__PURE__ */ new Date() : null
	});
	else await db.update(payoutDisputes).set({
		status: localStatus,
		evidenceDueAt: dispute.evidence_details?.due_by ? /* @__PURE__ */ new Date(dispute.evidence_details.due_by * 1e3) : null,
		rawPayload: dispute,
		closedAt: dispute.status === "won" || dispute.status === "lost" || dispute.status === "warning_closed" ? /* @__PURE__ */ new Date() : null
	}).where(eq(payoutDisputes.processorDisputeId, dispute.id));
	if (eventType === "charge.dispute.created" || eventType === "charge.dispute.closed" || eventType === "charge.dispute.funds_withdrawn" || eventType === "charge.dispute.funds_reinstated") try {
		const admins = await db.select({ id: user.id }).from(user).where(eq(user.role, "admin"));
		const title = eventType === "charge.dispute.created" ? `New Stripe dispute · $${(dispute.amount / 100).toFixed(2)}` : eventType === "charge.dispute.closed" ? `Stripe dispute closed · ${dispute.status}` : `Stripe dispute funds ${eventType.includes("withdrawn") ? "withdrawn" : "reinstated"}`;
		await Promise.all(admins.map((a) => notify({
			userId: a.id,
			kind: "system",
			title,
			message: `Reason: ${dispute.reason}. Open the disputes admin page to view + respond.`,
			actionUrl: "/admin/disputes"
		}).catch(() => void 0)));
	} catch (err) {
		console.warn("[webhooks/stripe] dispute notify failed:", err);
	}
}
//#endregion
export { POST };
