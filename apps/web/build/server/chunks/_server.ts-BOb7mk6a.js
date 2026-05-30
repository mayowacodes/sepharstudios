import { n as db, M as ppvPurchases, I as paystackSubscriptions, C as mediaWatchProgress } from './drizzle-BjmsPAPl.js';
import { b as getGovernanceActor } from './governance-auth-MOcI2nxc.js';
import { j as json } from './index-5kYmxIr9.js';
import { sql, count, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './admin-auth-Cru3g_J0.js';
import './index-DBqjc0Yf.js';

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
//# sourceMappingURL=_server.ts-BOb7mk6a.js.map
