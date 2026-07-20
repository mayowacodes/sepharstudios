import { n as public_env, t as private_env } from "../../../../../chunks/shared-server.js";
import { K as mediaLibrary, O as creators, at as ppvPurchases, bt as transactions, q as mediaWatchProgress, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { createPublicClient, http, isAddress, parseAbi } from "viem";
import { polygon, polygonAmoy } from "viem/chains";
//#region src/lib/server/creator-tier.ts
var CREATOR_PAYMENTS_ABI = parseAbi(["function getCreatorProfile(address creator) view returns (uint8 tier, uint8 paymentMethod, uint256 fiatPct, uint256 usdcPct, uint256 stcPct, uint256 totalEarnings, uint256 pendingAmount, bool isActive)"]);
function resolveChain() {
	const network = (private_env.STC_NETWORK ?? "amoy").toLowerCase();
	if (network === "polygon" || network === "mainnet") return {
		chain: polygon,
		rpcUrl: private_env.POLYGON_RPC_URL ?? "https://polygon-rpc.com",
		contractAddress: public_env.PUBLIC_CREATOR_PAYMENTS_POLYGON
	};
	return {
		chain: polygonAmoy,
		rpcUrl: private_env.AMOY_RPC_URL ?? "https://rpc-amoy.polygon.technology",
		contractAddress: public_env.PUBLIC_CREATOR_PAYMENTS_AMOY
	};
}
function dbCreatorTypeToTier(creatorType) {
	if (creatorType === "top_performer") return "top_performer";
	if (creatorType === "exclusive") return "exclusive";
	return "standard";
}
function revenueShareForTier(tier) {
	if (tier === "top_performer") return 55;
	if (tier === "exclusive") return 40;
	return 30;
}
function tierIdToName(id) {
	if (id === 3) return "top_performer";
	if (id === 2) return "exclusive";
	return "standard";
}
/**
* Read tier from the CreatorPayments contract for a creator's wallet, falling
* back to the DB's `creatorType` mirror when the contract isn't reachable or
* the creator has no linked wallet.
*/
async function resolveCreatorTier(opts) {
	const fallback = {
		tier: dbCreatorTypeToTier(opts.dbCreatorType),
		revenueSharePct: revenueShareForTier(dbCreatorTypeToTier(opts.dbCreatorType)),
		source: "database-fallback",
		walletAddress: opts.walletAddress
	};
	if (!opts.walletAddress || !isAddress(opts.walletAddress)) return fallback;
	const { chain, rpcUrl, contractAddress } = resolveChain();
	if (!contractAddress || !isAddress(contractAddress)) return fallback;
	try {
		const [tierId, , , , , , , isActive] = await createPublicClient({
			chain,
			transport: http(rpcUrl)
		}).readContract({
			address: contractAddress,
			abi: CREATOR_PAYMENTS_ABI,
			functionName: "getCreatorProfile",
			args: [opts.walletAddress]
		});
		if (!isActive) return fallback;
		const tier = tierIdToName(Number(tierId));
		return {
			tier,
			revenueSharePct: revenueShareForTier(tier),
			source: "on-chain",
			walletAddress: opts.walletAddress
		};
	} catch {
		return fallback;
	}
}
//#endregion
//#region src/routes/api/creator/earnings/+server.ts
/**
* GET /api/creator/earnings
*
* Returns the current creator's earnings breakdown. Honest empty-state when no
* payments have happened yet — never fake numbers.
*
* Currently the only earnings source is on-platform STC rewards (the watch +
* complete reward already paid to viewers gets a creator-share counterpart
* when the creator-payout pipeline ships). Until that pipeline runs, this
* endpoint surfaces zeros plus the creator's snapshot from creators.totalEarnings.
*/
var GET = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const [creator] = await db.select().from(creators).where(eq(creators.userId, session.user.id)).limit(1);
	if (!creator) return json({ error: "Not a creator" }, { status: 403 });
	const now = /* @__PURE__ */ new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const yearStart = new Date(now.getFullYear(), 0, 1);
	const aggregates = await db.select({
		currency: transactions.currency,
		total: sql`coalesce(sum(${transactions.amount}), 0)`,
		month: sql`coalesce(sum(case when ${transactions.createdAt} >= ${monthStart.toISOString()} then ${transactions.amount} else 0 end), 0)`,
		year: sql`coalesce(sum(case when ${transactions.createdAt} >= ${yearStart.toISOString()} then ${transactions.amount} else 0 end), 0)`
	}).from(transactions).where(and(eq(transactions.userId, session.user.id), eq(transactions.type, "creator_payout"), eq(transactions.status, "completed"))).groupBy(transactions.currency).catch((err) => {
		console.warn("[creator/earnings] aggregates failed:", err instanceof Error ? err.message : err);
		return [];
	});
	const totals = {
		monthCents: 0,
		yearCents: 0,
		lifetimeCents: 0
	};
	const byCurrency = {};
	for (const row of aggregates) {
		totals.monthCents += Number(row.month ?? 0);
		totals.yearCents += Number(row.year ?? 0);
		totals.lifetimeCents += Number(row.total ?? 0);
		byCurrency[row.currency] = {
			month: Number(row.month ?? 0),
			year: Number(row.year ?? 0),
			lifetime: Number(row.total ?? 0)
		};
	}
	const recentPayments = await db.select({
		id: transactions.id,
		amountCents: transactions.amount,
		currency: transactions.currency,
		status: transactions.status,
		createdAt: transactions.createdAt,
		metadata: transactions.metadata
	}).from(transactions).where(and(eq(transactions.userId, session.user.id), eq(transactions.type, "creator_payout"))).orderBy(desc(transactions.createdAt)).limit(20).catch((err) => {
		console.warn("[creator/earnings] recentPayments failed:", err instanceof Error ? err.message : err);
		return [];
	});
	const contentRows = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		thumbnail: mediaLibrary.thumbnail,
		viewCount: mediaLibrary.viewCount
	}).from(mediaLibrary).where(eq(mediaLibrary.creatorId, session.user.id));
	const totalViews = contentRows.reduce((a, c) => a + Number(c.viewCount ?? 0), 0);
	let completedWatches = 0;
	const byContent = [];
	if (contentRows.length > 0) {
		const contentIds = contentRows.map((c) => c.id);
		const [completedRow] = await db.select({ count: sql`count(*)::int` }).from(mediaWatchProgress).where(and(inArray(mediaWatchProgress.contentId, contentIds), eq(mediaWatchProgress.isCompleted, true)));
		completedWatches = Number(completedRow?.count ?? 0);
		const thirtyDaysAgo = /* @__PURE__ */ new Date(Date.now() - 30 * 864e5);
		const ppvRows = await db.select({
			contentId: ppvPurchases.contentId,
			lifetimeCents: sql`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)::int`,
			last30dCents: sql`coalesce(sum(case when ${ppvPurchases.createdAt} >= ${thirtyDaysAgo.toISOString()} then ${ppvPurchases.amountPaidCents} else 0 end), 0)::int`,
			purchaseCount: sql`count(*)::int`
		}).from(ppvPurchases).where(inArray(ppvPurchases.contentId, contentIds)).groupBy(ppvPurchases.contentId);
		const ppvMap = new Map(ppvRows.map((r) => [r.contentId, r]));
		for (const c of contentRows) {
			const ppv = ppvMap.get(c.id);
			byContent.push({
				contentId: c.id,
				title: c.title,
				thumbnail: c.thumbnail,
				viewCount: Number(c.viewCount ?? 0),
				lifetimeCents: ppv ? Number(ppv.lifetimeCents) : 0,
				last30dCents: ppv ? Number(ppv.last30dCents) : 0,
				purchaseCount: ppv ? Number(ppv.purchaseCount) : 0
			});
		}
		byContent.sort((a, b) => b.lifetimeCents - a.lifetimeCents);
	}
	const payment = (creator.preferences ?? {}).payment ?? null;
	const SERIES_DAYS = 30;
	const seriesEarnings = new Array(SERIES_DAYS).fill(0);
	const sinceDate = /* @__PURE__ */ new Date(Date.now() - SERIES_DAYS * 864e5);
	const dailyRows = await db.select({
		day: sql`to_char(date_trunc('day', ${transactions.createdAt}), 'YYYY-MM-DD')`,
		cents: sql`coalesce(sum(${transactions.amount}), 0)::int`
	}).from(transactions).where(and(eq(transactions.userId, session.user.id), eq(transactions.type, "creator_payout"), gte(transactions.createdAt, sinceDate))).groupBy(sql`date_trunc('day', ${transactions.createdAt})`).catch((err) => {
		console.warn("[creator/earnings] dailyRows failed:", err instanceof Error ? err.message : err);
		return [];
	});
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	for (const r of dailyRows) {
		const d = new Date(r.day);
		const ago = Math.floor((today.getTime() - d.getTime()) / 864e5);
		const idx = SERIES_DAYS - 1 - ago;
		if (idx >= 0 && idx < SERIES_DAYS) seriesEarnings[idx] = Number(r.cents);
	}
	const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
	const [lastMonthAgg] = await db.select({ total: sql`coalesce(sum(${transactions.amount}), 0)::int` }).from(transactions).where(and(eq(transactions.userId, session.user.id), eq(transactions.type, "creator_payout"), eq(transactions.status, "completed"), gte(transactions.createdAt, lastMonthStart), lt(transactions.createdAt, lastMonthEnd))).catch((err) => {
		console.warn("[creator/earnings] lastMonthAgg failed:", err instanceof Error ? err.message : err);
		return [{ total: 0 }];
	});
	const lastMonthCents = Number(lastMonthAgg?.total ?? 0);
	const earningsDelta = lastMonthCents > 0 ? Math.round((totals.monthCents - lastMonthCents) / lastMonthCents * 1e3) / 10 : totals.monthCents > 0 ? 100 : 0;
	const tierResolved = await resolveCreatorTier({
		walletAddress: creator.walletAddress ?? null,
		dbCreatorType: creator.creatorType
	});
	return json({
		creatorType: creator.creatorType,
		tier: tierResolved.tier,
		tierSource: tierResolved.source,
		revenueShare: tierResolved.revenueSharePct,
		totals: {
			monthCents: totals.monthCents,
			yearCents: totals.yearCents,
			lifetimeCents: Math.max(totals.lifetimeCents, Number(creator.totalEarnings ?? 0))
		},
		byCurrency,
		recentPayments,
		stats: {
			contentCount: contentRows.length,
			totalViews,
			completedWatches
		},
		byContent,
		series: { earnings: seriesEarnings },
		deltas: { earnings: earningsDelta },
		paymentPreference: payment ?? null
	});
};
//#endregion
export { GET };
