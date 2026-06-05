import { E as cronState, a as user, f as adminTokenomicsSettings, gt as transactions, lt as stcStakes, t as db } from "../../../../../chunks/drizzle.js";
import { n as requireAdmin } from "../../../../../chunks/admin-auth.js";
import { json } from "@sveltejs/kit";
import { and, eq, gt, sql } from "drizzle-orm";
//#region src/routes/api/admin/tokenomics/+server.ts
var defaultDistribution = {
	platformOperations: 55,
	creatorRevenue: 30,
	stcBuyback: 8,
	userRewards: 4,
	platformReserve: 3
};
var GET = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;
	const revenueDistribution = (await db.select().from(adminTokenomicsSettings).then((r) => r[0]))?.revenueDistribution || defaultDistribution;
	const now = /* @__PURE__ */ new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const [creatorCount] = await db.select({ totalCreators: sql`count(*)` }).from(user).where(eq(user.role, "creator"));
	const [earnings] = await db.select({ totalPayments: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(and(eq(transactions.type, "creator_payout"), sql`${transactions.createdAt} >= ${monthStart}`));
	const [topEarner] = await db.select({
		userId: transactions.userId,
		total: sql`sum(${transactions.amount})`
	}).from(transactions).where(and(eq(transactions.type, "creator_payout"), sql`${transactions.createdAt} >= ${monthStart}`)).groupBy(transactions.userId).orderBy(sql`sum(${transactions.amount}) desc`).limit(1);
	const totalPayments = Number(earnings?.totalPayments ?? 0);
	const totalCreators = Number(creatorCount?.totalCreators ?? 0);
	const averageRevenue = totalCreators > 0 ? Math.round(totalPayments / totalCreators) : 0;
	const topCreatorEarnings = Number(topEarner?.total ?? 0);
	const tierRows = await db.select({
		tier: stcStakes.discountTier,
		count: sql`count(*)`
	}).from(stcStakes).where(gt(sql`(${stcStakes.amount})::numeric`, 0)).groupBy(stcStakes.discountTier);
	const stakingTiers = {
		bronze: 0,
		silver: 0,
		gold: 0,
		platinum: 0
	};
	for (const r of tierRows) {
		const n = Number(r.count ?? 0);
		if (r.tier === 1) stakingTiers.bronze = n;
		else if (r.tier === 2) stakingTiers.silver = n;
		else if (r.tier === 3) stakingTiers.gold = n;
		else if (r.tier === 4) stakingTiers.platinum = n;
	}
	const indexerState = await db.select().from(cronState).where(eq(cronState.jobKey, "staking-indexer")).then((r) => r[0]);
	const stakingTiersNote = indexerState?.lastRunAt ? `Indexed up to block ${indexerState.lastBlock ?? "?"} at ${indexerState.lastRunAt.toISOString()}.` : "Staking indexer has not run yet. Tier counts will populate after the first cron sweep.";
	return json({
		revenueDistribution,
		creatorStats: {
			totalCreators,
			averageRevenue,
			topCreatorEarnings,
			totalPayments
		},
		stakingTiers,
		stakingTiersNote
	});
};
//#endregion
export { GET };
