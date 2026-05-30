import { n as db, Q as refunds, G as paymentIntents, I as paystackSubscriptions } from './drizzle-BjmsPAPl.js';
import { r as requireAdmin } from './admin-auth-Cru3g_J0.js';
import { n as notify } from './notify-Cul2puxj.js';
import { d as createRefund } from './paystack-qQiFeBwj.js';
import { j as json } from './index-5kYmxIr9.js';
import { desc, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';

//#region src/routes/api/admin/refunds/+server.ts
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
var POST = async ({ locals, request }) => {
	const { error, session } = await requireAdmin(locals);
	if (error || !session) return error;
	const body = await request.json();
	if (!body.reference) return json({ error: "reference is required" }, { status: 400 });
	if (body.amountCents !== void 0 && body.amountCents <= 0) return json({ error: "amountCents must be positive" }, { status: 400 });
	const [intent] = await db.select().from(paymentIntents).where(eq(paymentIntents.reference, body.reference)).limit(1);
	if (!intent) return json({ error: "No payment_intent matches this reference" }, { status: 404 });
	const amountCents = body.amountCents ?? intent.amountCents;
	const [auditRow] = await db.insert(refunds).values({
		userId: intent.userId,
		reference: body.reference,
		amountCents,
		reason: body.reason ?? null,
		issuedBy: session.user.id,
		status: "pending"
	}).returning();
	try {
		const paystackResult = await createRefund({
			transactionReference: body.reference,
			amountKobo: body.amountCents,
			merchantNote: body.reason
		});
		await db.update(refunds).set({
			status: paystackResult.status === "pending" ? "pending" : "success",
			paystackResponse: paystackResult
		}).where(eq(refunds.id, auditRow.id));
		if (intent.kind === "subscription" || intent.kind === "renewal") await db.update(paystackSubscriptions).set({
			status: "cancelled",
			cancelledAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(paystackSubscriptions.userId, intent.userId));
		await notify({
			userId: intent.userId,
			kind: "subscription",
			title: "Refund issued",
			message: `A refund of $${(amountCents / 100).toFixed(2)} has been processed to your card. Allow 5–10 business days for it to appear on your statement.`,
			actionUrl: "/settings"
		});
		return json({
			success: true,
			refundId: auditRow.id,
			paystack: paystackResult
		});
	} catch (err) {
		await db.update(refunds).set({
			status: "failed",
			paystackResponse: { error: err.message }
		}).where(eq(refunds.id, auditRow.id));
		console.error("[admin/refunds] Paystack refund failed:", err);
		return json({
			error: "Paystack refund failed",
			refundId: auditRow.id,
			detail: err.message
		}, { status: 502 });
	}
};
/**
* GET /api/admin/refunds
*
* List recent refunds, most recent first. Admin-only.
*/
var GET = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10) || 50, 200);
	return json({ refunds: await db.select().from(refunds).orderBy(desc(refunds.createdAt)).limit(limit) });
};

export { GET, POST };
//# sourceMappingURL=_server.ts-l4ofyGmr.js.map
