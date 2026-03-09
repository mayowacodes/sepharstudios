import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { paystackSubscriptions, ppvPurchases, mediaWatchProgress } from '$lib/db/schema/sepharstudios';
import { count, eq, sql } from 'drizzle-orm';
import { getGovernanceActor } from '$lib/server/governance-auth';

export const GET: RequestHandler = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, 'governance.view');
	if (!allowed) return json({ error: 'Forbidden' }, { status: 403 });

	const [ppvRevenue, activeSubs, annualWatchEvents] = await Promise.all([
		db
			.select({ total: sql<number>`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)` })
			.from(ppvPurchases)
			.then((r) => Number(r[0]?.total ?? 0)),
		db
			.select({ total: count() })
			.from(paystackSubscriptions)
			.where(eq(paystackSubscriptions.status, 'active'))
			.then((r) => r[0]?.total ?? 0),
		db
			.select({ total: count() })
			.from(mediaWatchProgress)
			.then((r) => r[0]?.total ?? 0)
	]);

	// Subscription estimate for governance dashboard only (USD cents/month)
	const estSubRevenueCents = activeSubs * 1000;
	const monthlyRevenueCents = estSubRevenueCents + ppvRevenue;
	const annualRevenueUsd = (monthlyRevenueCents * 12) / 100;

	return json({
		pools: [
			{ key: 'platformTreasury', label: 'Platform Treasury', control: 'multisig+timelock', status: 'pending-migration' },
			{ key: 'userRewardsPool', label: 'User Rewards Pool', control: 'multisig+timelock', status: 'pending-migration' },
			{ key: 'creatorRewardsPool', label: 'Creator Rewards Pool', control: 'multisig+timelock', status: 'pending-migration' },
			{ key: 'governancePool', label: 'Governance Pool', control: 'multisig+timelock', status: 'pending-migration' }
		],
		revenue: {
			ppvRevenueCents: ppvRevenue,
			estimatedSubscriptionRevenueCents: estSubRevenueCents,
			estimatedMonthlyRevenueCents: monthlyRevenueCents,
			estimatedAnnualRevenueUsd: annualRevenueUsd
		},
		runway: {
			baseCaseYears: 7.8,
			targetYears: 10,
			modelPath: '/token-lifespan-model.csv'
		},
		activity: {
			activeSubscriptions: activeSubs,
			watchEvents: annualWatchEvents
		}
	});
};
