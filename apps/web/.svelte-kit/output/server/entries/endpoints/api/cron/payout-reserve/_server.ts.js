import { t as private_env } from "../../../../../chunks/shared-server.js";
import { Y as payouts, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, isNull, sql } from "drizzle-orm";
//#region src/routes/api/cron/payout-reserve/+server.ts
/**
* POST /api/cron/payout-reserve
*
* Applies a reserve hold to newly-created payouts so the platform retains
* funds long enough to cover the dispute window (default 7 days). After
* the window passes, the held_until clears and the payout becomes
* eligible for approval + payout via the existing /admin/payouts queue.
*
* Recommended schedule: hourly. Idempotent — same payout running twice
* just updates the timestamp.
*/
var RESERVE_DAYS_DEFAULT = 7;
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const reserveDays = Number(private_env.PAYOUT_RESERVE_DAYS ?? RESERVE_DAYS_DEFAULT);
	const releaseTime = sql`${payouts.createdAt} + interval '${sql.raw(`${reserveDays} days`)}'`;
	const heldRes = await db.update(payouts).set({ heldUntil: releaseTime }).where(and(eq(payouts.status, "pending"), isNull(payouts.heldUntil))).returning({ id: payouts.id });
	const releasedRes = await db.update(payouts).set({ heldUntil: null }).where(and(eq(payouts.status, "pending"), sql`${payouts.heldUntil} IS NOT NULL`, sql`${payouts.heldUntil} <= now()`)).returning({ id: payouts.id });
	return json({
		ok: true,
		newlyHeld: heldRes.length,
		released: releasedRes.length,
		reserveDays
	});
};
//#endregion
export { POST };
