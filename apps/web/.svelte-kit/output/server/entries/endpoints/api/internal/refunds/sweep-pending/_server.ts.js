import { at as refunds, t as db } from "../../../../../../chunks/drizzle.js";
import { t as isValidInternalRequest } from "../../../../../../chunks/internal-auth.js";
import { json } from "@sveltejs/kit";
import { and, eq, lt } from "drizzle-orm";
//#region src/routes/api/internal/refunds/sweep-pending/+server.ts
/**
* POST /api/internal/refunds/sweep-pending
*
* Internal cron endpoint. Reconciles refund audit rows that have been
* stuck in `status='pending'` for longer than STUCK_AFTER_MS — which
* happens when the request process died between the audit-row insert
* and the post-Paystack status update in /api/ppv/refund or
* /api/admin/refunds.
*
* For now we flip them to `failed` with a sentinel reason so the
* admin/refunds view surfaces them and a human can decide whether to
* re-issue. A fully automated reconciliation (querying Paystack for the
* actual refund status by transaction reference) is a follow-up — this
* sweep guarantees nothing rots silently.
*
* Schedule: every 5 minutes. Idempotent — re-running on the same set
* just no-ops since none are still 'pending'.
*
* Body: {} (no parameters)
* Returns: { swept: number }
*/
var STUCK_AFTER_MS = 600 * 1e3;
var POST = async ({ request }) => {
	if (!isValidInternalRequest(request)) return json({ error: "Forbidden" }, { status: 403 });
	const cutoff = new Date(Date.now() - STUCK_AFTER_MS);
	const stuck = await db.update(refunds).set({
		status: "failed",
		paystackResponse: {
			error: "stuck-pending-sweep",
			sweptAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	}).where(and(eq(refunds.status, "pending"), lt(refunds.createdAt, cutoff))).returning({
		id: refunds.id,
		reference: refunds.reference
	});
	if (stuck.length > 0) console.warn(`[refunds/sweep-pending] flipped ${stuck.length} stuck rows to failed`, stuck.map((s) => s.reference));
	return json({ swept: stuck.length });
};
//#endregion
export { POST };
