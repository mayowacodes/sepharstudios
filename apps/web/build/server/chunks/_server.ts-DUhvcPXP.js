import { d as db, m as mediaLibrary, aj as creatorEarnings } from './drizzle-DlGuU73K.js';
import { R as Role } from './constants-RccSloty.js';
import { j as json } from './index.js-DwRgOKlO.js';
import { sql, eq, and, gte } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './file-text-CHS0iqgH.js';
import './Icon-C7ASqKku.js';
import './house-XwjJ8C_P.js';
import './layout-dashboard-BnGht0MN.js';
import './user-D4TNxAED.js';
import './users-Cy8n6xcU.js';

//#region src/routes/api/creator/stats/+server.ts
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const creatorId = session.user.id;
	const now = /* @__PURE__ */ new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	let counts;
	try {
		[counts] = await db.select({
			totalContent: sql`count(*)`,
			published: sql`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
			pendingReview: sql`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
			totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`
		}).from(mediaLibrary).where(eq(mediaLibrary.creatorId, creatorId));
	} catch (err) {
		console.warn("[api/creator/stats] media_library query failed:", err);
	}
	let monthlyEarnings = 0;
	try {
		const [earningsRow] = await db.select({ cents: sql`coalesce(sum(${creatorEarnings.amountCents}), 0)` }).from(creatorEarnings).where(and(eq(creatorEarnings.creatorId, creatorId), gte(creatorEarnings.createdAt, monthStart)));
		monthlyEarnings = Number(earningsRow?.cents ?? 0) / 100;
	} catch (err) {
		console.warn("[api/creator/stats] creator_earnings query failed:", err);
	}
	return json({
		totalContent: Number(counts?.totalContent ?? 0),
		published: Number(counts?.published ?? 0),
		pendingReview: Number(counts?.pendingReview ?? 0),
		totalViews: Number(counts?.totalViews ?? 0),
		monthlyEarnings
	});
};

export { GET };
//# sourceMappingURL=_server.ts-DUhvcPXP.js.map
