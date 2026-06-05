import { Y as payouts, t as db } from "../../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/payouts/[id]/hold/+server.ts
/**
* POST /api/admin/payouts/[id]/hold
*
* Puts a payout on hold (suspect fraud, open dispute, KYC issue, etc.).
* The cron worker skips on_hold rows.
*
* Body: { reason?: string }
*/
var POST = async ({ params, locals, request }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const body = await request.json().catch(() => ({}));
	const [row] = await db.select({
		id: payouts.id,
		status: payouts.status
	}).from(payouts).where(eq(payouts.id, params.id)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	if (row.status === "paid" || row.status === "in_transit") return json({ error: `Cannot hold a payout in status ${row.status}` }, { status: 400 });
	await db.update(payouts).set({
		status: "on_hold",
		failureReason: body.reason ?? null
	}).where(eq(payouts.id, row.id));
	return json({ success: true });
};
//#endregion
export { POST };
