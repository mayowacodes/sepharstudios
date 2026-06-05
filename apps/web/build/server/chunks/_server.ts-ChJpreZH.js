import { w as db, M as mediaLibrary, ae as transactions } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { j as json } from './index-Cv5VcsYq.js';
import { sql, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
		const [earningsRow] = await db.select({ monthlyEarnings: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(sql`${transactions.userId} = ${creatorId} and ${transactions.type} = 'earn' and ${transactions.createdAt} >= ${monthStart}`);
		monthlyEarnings = Number(earningsRow?.monthlyEarnings ?? 0);
	} catch (err) {
		console.warn("[api/creator/stats] transactions query failed:", err);
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
//# sourceMappingURL=_server.ts-ChJpreZH.js.map
