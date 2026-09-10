import { F as payouts, d as db, C as creators, c as user } from './drizzle-DlGuU73K.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { eq, and, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/api/admin/payouts/+server.ts
/**
* GET /api/admin/payouts
*
* Lists payouts across creators. Admin payouts queue surfaces the
* `pending` rows for approval; the `paid` view is for audit.
*
* Query: ?status=&processor=&limit=&offset=
*/
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const status = url.searchParams.get("status");
	const processor = url.searchParams.get("processor");
	const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 500);
	const offset = Math.max(parseInt(url.searchParams.get("offset") ?? "0", 10) || 0, 0);
	const conditions = [];
	if (status) conditions.push(eq(payouts.status, status));
	if (processor) conditions.push(eq(payouts.processor, processor));
	const where = conditions.length > 0 ? and(...conditions) : void 0;
	return json({ payouts: await db.select({
		id: payouts.id,
		creatorId: payouts.creatorId,
		processor: payouts.processor,
		processorPayoutId: payouts.processorPayoutId,
		periodStart: payouts.periodStart,
		periodEnd: payouts.periodEnd,
		grossCents: payouts.grossCents,
		platformFeeCents: payouts.platformFeeCents,
		netCents: payouts.netCents,
		currency: payouts.currency,
		status: payouts.status,
		failureReason: payouts.failureReason,
		createdAt: payouts.createdAt,
		paidAt: payouts.paidAt,
		creatorDisplayName: creators.displayName,
		creatorName: user.name,
		creatorEmail: user.email,
		stripeAccountStatus: creators.stripeAccountStatus,
		stripePayoutsEnabled: creators.stripePayoutsEnabled
	}).from(payouts).leftJoin(creators, eq(payouts.creatorId, creators.id)).leftJoin(user, eq(creators.userId, user.id)).where(where).orderBy(desc(payouts.createdAt)).limit(limit).offset(offset) });
};

export { GET };
//# sourceMappingURL=_server.ts-DgpSXMoR.js.map
