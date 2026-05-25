import { json } from "@sveltejs/kit";
import { d as db, j as ppvPurchases, i as paystackSubscriptions, k as mediaWatchProgress } from "../../../../../../chunks/drizzle.js";
import { sql, count, eq } from "drizzle-orm";
import { g as getGovernanceActor } from "../../../../../../chunks/governance-auth.js";
const GET = async ({ locals }) => {
  const { allowed } = await getGovernanceActor(locals, "governance.view");
  if (!allowed) return json({ error: "Forbidden" }, { status: 403 });
  const [ppvRevenue, activeSubs, annualWatchEvents] = await Promise.all([
    db.select({ total: sql`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)` }).from(ppvPurchases).then((r) => Number(r[0]?.total ?? 0)),
    db.select({ total: count() }).from(paystackSubscriptions).where(eq(paystackSubscriptions.status, "active")).then((r) => r[0]?.total ?? 0),
    db.select({ total: count() }).from(mediaWatchProgress).then((r) => r[0]?.total ?? 0)
  ]);
  const estSubRevenueCents = activeSubs * 1e3;
  const monthlyRevenueCents = estSubRevenueCents + ppvRevenue;
  const annualRevenueUsd = monthlyRevenueCents * 12 / 100;
  return json({
    pools: [
      { key: "platformTreasury", label: "Platform Treasury", control: "multisig+timelock", status: "pending-migration" },
      { key: "userRewardsPool", label: "User Rewards Pool", control: "multisig+timelock", status: "pending-migration" },
      { key: "creatorRewardsPool", label: "Creator Rewards Pool", control: "multisig+timelock", status: "pending-migration" },
      { key: "governancePool", label: "Governance Pool", control: "multisig+timelock", status: "pending-migration" }
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
      modelPath: "/token-lifespan-model.csv"
    },
    activity: {
      activeSubscriptions: activeSubs,
      watchEvents: annualWatchEvents
    }
  });
};
export {
  GET
};
