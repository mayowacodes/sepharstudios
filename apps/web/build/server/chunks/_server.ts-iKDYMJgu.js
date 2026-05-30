import { n as db, B as mediaLibrary, _ as transactions } from './drizzle-BjmsPAPl.js';
import { R as Role } from './constants-ChVx7CIu.js';
import { j as json } from './index-5kYmxIr9.js';
import { sql, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-TtGtWAGI.js';
import './Icon-CGEdwVFL.js';
import './file-text-CODLMeLI.js';
import './layout-dashboard-B00hq5k6.js';
import './user-BR-ZR5dM.js';
import './users-Bb_ynahW.js';
import './index-DBqjc0Yf.js';

//#region src/routes/api/creator/stats/+server.ts
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (![Role.CREATOR, Role.ADMIN].includes(session.user.role)) return json({ error: "Forbidden" }, { status: 403 });
	const creatorId = session.user.id;
	const now = /* @__PURE__ */ new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const [counts] = await db.select({
		totalContent: sql`count(*)`,
		published: sql`sum(case when ${mediaLibrary.isActive} then 1 else 0 end)`,
		pendingReview: sql`sum(case when ${mediaLibrary.status} = 'submitted' then 1 else 0 end)`,
		totalViews: sql`coalesce(sum(${mediaLibrary.viewCount}), 0)`
	}).from(mediaLibrary).where(eq(mediaLibrary.creatorId, creatorId));
	const [earningsRow] = await db.select({ monthlyEarnings: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(sql`${transactions.userId} = ${creatorId} and ${transactions.type} = 'earn' and ${transactions.createdAt} >= ${monthStart}`);
	return json({
		totalContent: Number(counts?.totalContent ?? 0),
		published: Number(counts?.published ?? 0),
		pendingReview: Number(counts?.pendingReview ?? 0),
		totalViews: Number(counts?.totalViews ?? 0),
		monthlyEarnings: Number(earningsRow?.monthlyEarnings ?? 0)
	});
};

export { GET };
//# sourceMappingURL=_server.ts-iKDYMJgu.js.map
