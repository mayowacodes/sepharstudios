import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminTokenomicsSettings, transactions, stcStakes, cronState } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, sql, gt } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

const defaultDistribution = {
	platformOperations: 55,
	creatorRevenue: 30,
	stcBuyback: 8,
	userRewards: 4,
	platformReserve: 3
};

export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const settingsRow = await db.select().from(adminTokenomicsSettings).then(r => r[0]);
	const revenueDistribution = (settingsRow?.revenueDistribution as Record<string, number>) || defaultDistribution;

	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

	const [creatorCount] = await db
		.select({ totalCreators: sql<number>`count(*)` })
		.from(user)
		.where(eq(user.role, 'creator'));

	const [earnings] = await db
		.select({ totalPayments: sql<number>`coalesce(sum(${transactions.amount}), 0)` })
		.from(transactions)
		.where(and(eq(transactions.type, 'creator_payout'), sql`${transactions.createdAt} >= ${monthStart}`));

	// Real max-earnings query instead of a 15% heuristic. Falls back to 0 when
	// no creator payouts have happened yet.
	const [topEarner] = await db
		.select({
			userId: transactions.userId,
			total: sql<number>`sum(${transactions.amount})`
		})
		.from(transactions)
		.where(and(
			eq(transactions.type, 'creator_payout'),
			sql`${transactions.createdAt} >= ${monthStart}`
		))
		.groupBy(transactions.userId)
		.orderBy(sql`sum(${transactions.amount}) desc`)
		.limit(1);

	const totalPayments = Number(earnings?.totalPayments ?? 0);
	const totalCreators = Number(creatorCount?.totalCreators ?? 0);
	const averageRevenue = totalCreators > 0 ? Math.round(totalPayments / totalCreators) : 0;
	const topCreatorEarnings = Number(topEarner?.total ?? 0);

	// Aggregate live stake counts by discountTier from the snapshot maintained
	// by the staking-indexer cron. discountTier values come from the on-chain
	// STCToken contract: 1=bronze, 2=silver, 3=gold, 4=platinum.
	const tierRows = await db
		.select({
			tier: stcStakes.discountTier,
			count: sql<number>`count(*)`
		})
		.from(stcStakes)
		.where(gt(sql`(${stcStakes.amount})::numeric`, 0))
		.groupBy(stcStakes.discountTier);

	const stakingTiers = { bronze: 0, silver: 0, gold: 0, platinum: 0 };
	for (const r of tierRows) {
		const n = Number(r.count ?? 0);
		if (r.tier === 1) stakingTiers.bronze = n;
		else if (r.tier === 2) stakingTiers.silver = n;
		else if (r.tier === 3) stakingTiers.gold = n;
		else if (r.tier === 4) stakingTiers.platinum = n;
	}

	const indexerState = await db.select().from(cronState).where(eq(cronState.jobKey, 'staking-indexer')).then(r => r[0]);
	const stakingTiersNote = indexerState?.lastRunAt
		? `Indexed up to block ${indexerState.lastBlock ?? '?'} at ${indexerState.lastRunAt.toISOString()}.`
		: 'Staking indexer has not run yet. Tier counts will populate after the first cron sweep.';

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
