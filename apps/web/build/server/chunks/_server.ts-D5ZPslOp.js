import { w as db, T as payouts } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { POST };
//# sourceMappingURL=_server.ts-D5ZPslOp.js.map
