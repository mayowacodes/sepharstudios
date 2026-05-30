import { H as ppvPurchases, I as paymentIntents, K as refunds, M as mediaWatchProgress, t as db } from "../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../chunks/notify.js";
import { a as createRefund } from "../../../../../chunks/paystack.js";
import { json } from "@sveltejs/kit";
import { and, eq, gt } from "drizzle-orm";
//#region src/routes/api/ppv/refund/+server.ts
/**
* POST /api/ppv/refund
*
* User-self-serve PPV refund. Implements the policy in
* [Terms § 11](../apps/web/src/routes/(app)/terms/+page.svelte#L47-L48):
*   – Non-refundable once playback has started
*   – Refundable within 48 hours of purchase
*   – Refund issued to original Paystack payment method
*
* Body: { contentId: string }
*
* Returns 200 on success, 4xx with a specific error code on policy rejection:
*   404 not_found              — user never purchased this content
*   409 playback_started       — any mediaWatchProgress with positionSeconds > 0
*   410 window_expired         — purchased > 48 hours ago
*   404 reference_missing      — purchase row has no paystack_reference (legacy/abnormal)
*   502 paystack_failed        — Paystack rejected the refund (rare; admin can retry)
*/
var REFUND_WINDOW_HOURS = 48;
var POST = async ({ locals, request }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId } = await request.json();
	if (!contentId) return json({ error: "contentId is required" }, { status: 400 });
	const userId = session.user.id;
	const [purchase] = await db.select().from(ppvPurchases).where(and(eq(ppvPurchases.userId, userId), eq(ppvPurchases.contentId, contentId))).limit(1);
	if (!purchase) return json({
		error: "No PPV purchase found for this content",
		code: "not_found"
	}, { status: 404 });
	if (!purchase.paystackReference) return json({
		error: "This purchase has no Paystack reference. Contact support for a manual refund.",
		code: "reference_missing"
	}, { status: 404 });
	const purchasedAt = new Date(purchase.createdAt);
	const ageHours = (Date.now() - purchasedAt.getTime()) / 36e5;
	if (ageHours > REFUND_WINDOW_HOURS) return json({
		error: `Refund window has expired. PPV refunds must be requested within ${REFUND_WINDOW_HOURS} hours of purchase.`,
		code: "window_expired",
		ageHours: Math.floor(ageHours)
	}, { status: 410 });
	const [progress] = await db.select({ pos: mediaWatchProgress.positionSeconds }).from(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, userId), eq(mediaWatchProgress.contentId, contentId), gt(mediaWatchProgress.positionSeconds, 0))).limit(1);
	if (progress) return json({
		error: "Playback has already started. PPV refunds are only available before playback begins.",
		code: "playback_started"
	}, { status: 409 });
	const [auditRow] = await db.insert(refunds).values({
		userId,
		reference: purchase.paystackReference,
		amountCents: purchase.amountPaidCents,
		reason: "self-serve PPV refund (within 48h, no playback)",
		issuedBy: userId,
		status: "pending"
	}).returning();
	try {
		const paystackResult = await createRefund({
			transactionReference: purchase.paystackReference,
			amountKobo: purchase.amountPaidCents,
			customerNote: "Refund requested before playback started (within 48-hour window)."
		});
		await db.transaction(async (tx) => {
			await tx.delete(ppvPurchases).where(eq(ppvPurchases.id, purchase.id));
			await tx.update(refunds).set({
				status: paystackResult.status === "pending" ? "pending" : "success",
				paystackResponse: paystackResult
			}).where(eq(refunds.id, auditRow.id));
			await tx.update(paymentIntents).set({ status: "expired" }).where(eq(paymentIntents.reference, purchase.paystackReference));
		});
		await notify({
			userId,
			kind: "subscription",
			title: "PPV refund issued",
			message: `Your refund of $${(purchase.amountPaidCents / 100).toFixed(2)} is being processed to your card. Allow 5–10 business days for it to appear on your statement.`,
			actionUrl: "/settings"
		});
		return json({
			success: true,
			refundId: auditRow.id,
			amountCents: purchase.amountPaidCents
		});
	} catch (err) {
		await db.update(refunds).set({
			status: "failed",
			paystackResponse: { error: err.message }
		}).where(eq(refunds.id, auditRow.id));
		console.error("[ppv/refund] Paystack refund failed:", err);
		return json({
			error: "Refund could not be processed. Please contact support.",
			code: "paystack_failed",
			refundId: auditRow.id
		}, { status: 502 });
	}
};
//#endregion
export { POST };
