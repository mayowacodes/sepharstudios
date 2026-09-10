import { d as db, m as mediaLibrary, c as user, X as paymentIntents, W as refunds } from './drizzle-DlGuU73K.js';
import { r as requireAdmin } from './admin-auth-i1sA9-vE.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq, and } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/refunds/lookup/+server.ts
/**
* GET /api/admin/refunds/lookup?reference=...
*
* Resolves a transaction by its processor reference (Paystack or Stripe)
* so the IssueRefundPanel can show details (user, amount, content) before
* the admin confirms the refund. Returns 404 when the reference doesn't
* match any payment_intent, and includes any prior refund row so the UI
* can warn that the transaction was already refunded.
*/
var GET = async ({ locals, url }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const reference = url.searchParams.get("reference")?.trim();
	if (!reference) return json({ error: "reference is required" }, { status: 400 });
	const [row] = await db.select({
		id: paymentIntents.id,
		userId: paymentIntents.userId,
		contentId: paymentIntents.contentId,
		amountCents: paymentIntents.amountCents,
		currency: paymentIntents.currency,
		createdAt: paymentIntents.createdAt,
		userName: user.name,
		userEmail: user.email,
		contentTitle: mediaLibrary.title
	}).from(paymentIntents).leftJoin(user, eq(user.id, paymentIntents.userId)).leftJoin(mediaLibrary, eq(mediaLibrary.id, paymentIntents.contentId)).where(eq(paymentIntents.reference, reference)).limit(1);
	if (!row) return json({ error: "No transaction matches this reference." }, { status: 404 });
	const [existingRefund] = await db.select({ refundedAt: refunds.createdAt }).from(refunds).where(and(eq(refunds.reference, reference), eq(refunds.status, "success"))).limit(1);
	return json({ transaction: {
		id: row.id,
		contentId: row.contentId,
		contentTitle: row.contentTitle,
		userName: row.userName,
		userEmail: row.userEmail,
		amountCents: row.amountCents,
		currency: row.currency,
		createdAt: row.createdAt,
		refundedAt: existingRefund?.refundedAt ?? null
	} });
};

export { GET };
//# sourceMappingURL=_server.ts-B6iujMo0.js.map
