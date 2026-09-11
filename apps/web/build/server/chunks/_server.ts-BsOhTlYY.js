import { d as db, q as ppvPurchases, P as paystackSubscriptions, k as mediaWatchProgress } from './drizzle-C3SH12nS.js';
import { g as getGovernanceActor } from './governance-auth-Fa5l47Rl.js';
import { j as json } from './index.js-CxPEndTa.js';
import { sql, count, eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './admin-auth-C5lShqv4.js';

//#region src/routes/api/admin/governance/treasury/+server.ts
var GET = async ({ locals }) => {
	const { allowed } = await getGovernanceActor(locals, "governance.view");
	if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
	const [ppvRevenue, activeSubs, annualWatchEvents] = await Promise.all([
		db.select({ total: sql`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)` }).from(ppvPurchases).then((r) => Number(r[0]?.total ?? 0)),
		db.select({ total: count() }).from(paystackSubscriptions).where(eq(paystackSubscriptions.status, "active")).then((r) => r[0]?.total ?? 0),
		db.select({ total: count() }).from(mediaWatchProgress).then((r) => r[0]?.total ?? 0)
	]);
	const estSubRevenueCents = activeSubs * 1e3;
	const monthlyRevenueCents = estSubRevenueCents + ppvRevenue;
	return json({
		pools: [
			{
				key: "platformTreasury",
				label: "Platform Treasury",
				control: "multisig+timelock",
				status: "pending-migration"
			},
			{
				key: "userRewardsPool",
				label: "User Rewards Pool",
				control: "multisig+timelock",
				status: "pending-migration"
			},
			{
				key: "creatorRewardsPool",
				label: "Creator Rewards Pool",
				control: "multisig+timelock",
				status: "pending-migration"
			},
			{
				key: "governancePool",
				label: "Governance Pool",
				control: "multisig+timelock",
				status: "pending-migration"
			}
		],
		revenue: {
			ppvRevenueCents: ppvRevenue,
			estimatedSubscriptionRevenueCents: estSubRevenueCents,
			estimatedMonthlyRevenueCents: monthlyRevenueCents,
			estimatedAnnualRevenueUsd: monthlyRevenueCents * 12 / 100
		},
		runway: {
			baseCaseYears: 7.8,
			targetYears: 10,
			modelPath: "/token-lifespan-model.csv"
		},
		activity: {
			activeSubscriptions: activeSubs,
			watchEvents: annualWatchEvents
		}
	});
};

export { GET };
//# sourceMappingURL=_server.ts-BsOhTlYY.js.map
