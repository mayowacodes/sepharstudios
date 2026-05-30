import { H as ppvPurchases, M as mediaWatchProgress, R as paystackSubscriptions, t as db } from "../../../../../../chunks/drizzle.js";
import { t as getGovernanceActor } from "../../../../../../chunks/governance-auth.js";
import { json } from "@sveltejs/kit";
import { count, eq, sql } from "drizzle-orm";
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
//#endregion
export { GET };
