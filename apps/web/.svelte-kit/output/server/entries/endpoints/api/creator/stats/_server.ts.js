import { H as mediaLibrary, gt as transactions, t as db } from "../../../../../chunks/drizzle.js";
import { r as Role } from "../../../../../chunks/constants.js";
import { json } from "@sveltejs/kit";
import { eq, sql } from "drizzle-orm";
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
//#endregion
export { GET };
