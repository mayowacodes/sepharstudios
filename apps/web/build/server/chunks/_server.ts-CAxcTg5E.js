import { S as payoutDisputes, w as db, ag as user, u as creators, T as payouts } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, desc, sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/disputes/+server.ts
/**
* GET /api/admin/disputes?status=&page=&pageSize=
*
* Admin-only disputes queue. Joins payouts → creators → user so the
* admin can see which creator's payment is in dispute. Paginated so the
* client never has to render all 200+ rows at once.
*/
var MAX_PAGE_SIZE = 100;
var DEFAULT_PAGE_SIZE = 25;
var GET = async ({ url, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const status = url.searchParams.get("status");
	const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
	const requested = parseInt(url.searchParams.get("pageSize") ?? `${DEFAULT_PAGE_SIZE}`, 10) || DEFAULT_PAGE_SIZE;
	const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, requested));
	const offset = (page - 1) * pageSize;
	const whereExpr = status ? eq(payoutDisputes.status, status) : void 0;
	const [rows, totalRows] = await Promise.all([db.select({
		id: payoutDisputes.id,
		processor: payoutDisputes.processor,
		processorDisputeId: payoutDisputes.processorDisputeId,
		amountCents: payoutDisputes.amountCents,
		currency: payoutDisputes.currency,
		reason: payoutDisputes.reason,
		status: payoutDisputes.status,
		evidenceDueAt: payoutDisputes.evidenceDueAt,
		createdAt: payoutDisputes.createdAt,
		closedAt: payoutDisputes.closedAt,
		payoutId: payoutDisputes.payoutId,
		creatorDisplayName: creators.displayName,
		creatorEmail: user.email
	}).from(payoutDisputes).leftJoin(payouts, eq(payoutDisputes.payoutId, payouts.id)).leftJoin(creators, eq(creators.id, payouts.creatorId)).leftJoin(user, eq(user.id, creators.userId)).where(whereExpr).orderBy(desc(payoutDisputes.createdAt)).limit(pageSize).offset(offset), db.select({ count: sql`count(*)::int` }).from(payoutDisputes).where(whereExpr)]);
	const total = totalRows[0]?.count ?? 0;
	return json({
		disputes: rows,
		pagination: {
			page,
			pageSize,
			total,
			totalPages: Math.max(1, Math.ceil(total / pageSize))
		}
	});
};

export { GET };
//# sourceMappingURL=_server.ts-CAxcTg5E.js.map
