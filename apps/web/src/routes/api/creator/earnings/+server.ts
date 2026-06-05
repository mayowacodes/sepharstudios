import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators, transactions, mediaLibrary, mediaWatchProgress, ppvPurchases } from '$lib/db/schema/sepharstudios';
import { and, eq, desc, sql, inArray, gte, lt } from 'drizzle-orm';
import { resolveCreatorTier } from '$lib/server/creator-tier';

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
export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [creator] = await db
		.select()
		.from(creators)
		.where(eq(creators.userId, session.user.id))
		.limit(1);

	if (!creator) return json({ error: 'Not a creator' }, { status: 403 });

	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
	const yearStart = new Date(now.getFullYear(), 0, 1);

	// Aggregate any completed payment transactions credited to this creator.
	// `type='creator_payout'` is the convention used by the (forthcoming) payout
	// worker. Existing `type='earn'` rows belong to viewers, not creators.
	//
	// Defensive: deployed `transactions` table may be missing columns
	// (older schema; migration's IF NOT EXISTS skipped). Each query
	// catches and returns empty so /creator/earnings still renders.
	const aggregates = await db
		.select({
			currency: transactions.currency,
			total: sql<number>`coalesce(sum(${transactions.amount}), 0)`,
			month: sql<number>`coalesce(sum(case when ${transactions.createdAt} >= ${monthStart.toISOString()} then ${transactions.amount} else 0 end), 0)`,
			year: sql<number>`coalesce(sum(case when ${transactions.createdAt} >= ${yearStart.toISOString()} then ${transactions.amount} else 0 end), 0)`
		})
		.from(transactions)
		.where(and(
			eq(transactions.userId, session.user.id),
			eq(transactions.type, 'creator_payout'),
			eq(transactions.status, 'completed')
		))
		.groupBy(transactions.currency)
		.catch((err) => {
			console.warn('[creator/earnings] aggregates failed:', err instanceof Error ? err.message : err);
			return [] as Array<{ currency: string; total: number; month: number; year: number }>;
		});

	const totals = { monthCents: 0, yearCents: 0, lifetimeCents: 0 };
	const byCurrency: Record<string, { month: number; year: number; lifetime: number }> = {};
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

	const recentPayments = await db
		.select({
			id: transactions.id,
			amountCents: transactions.amount,
			currency: transactions.currency,
			status: transactions.status,
			createdAt: transactions.createdAt,
			metadata: transactions.metadata
		})
		.from(transactions)
		.where(and(
			eq(transactions.userId, session.user.id),
			eq(transactions.type, 'creator_payout')
		))
		.orderBy(desc(transactions.createdAt))
		.limit(20)
		.catch((err) => {
			console.warn('[creator/earnings] recentPayments failed:', err instanceof Error ? err.message : err);
			return [] as Array<{ id: string; amountCents: number; currency: string; status: string; createdAt: Date; metadata: unknown }>;
		});

	// Aggregate content stats from the live tables — also honest zero when the
	// creator hasn't published anything yet.
	const contentRows = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			thumbnail: mediaLibrary.thumbnail,
			viewCount: mediaLibrary.viewCount
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.creatorId, session.user.id));

	const totalViews = contentRows.reduce((a, c) => a + Number(c.viewCount ?? 0), 0);
	let completedWatches = 0;

	// Per-content PPV revenue (Item 5A). Keyed by contentId so the UI can join
	// against the content list. Two windows: last-30d + lifetime.
	const byContent: Array<{
		contentId: string;
		title: string;
		thumbnail: string | null;
		viewCount: number;
		lifetimeCents: number;
		last30dCents: number;
		purchaseCount: number;
	}> = [];

	if (contentRows.length > 0) {
		const contentIds = contentRows.map((c) => c.id);
		const [completedRow] = await db
			.select({ count: sql<number>`count(*)::int` })
			.from(mediaWatchProgress)
			.where(and(
				inArray(mediaWatchProgress.contentId, contentIds),
				eq(mediaWatchProgress.isCompleted, true)
			));
		completedWatches = Number(completedRow?.count ?? 0);

		const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);
		const ppvRows = await db
			.select({
				contentId: ppvPurchases.contentId,
				lifetimeCents: sql<number>`coalesce(sum(${ppvPurchases.amountPaidCents}), 0)::int`,
				last30dCents: sql<number>`coalesce(sum(case when ${ppvPurchases.createdAt} >= ${thirtyDaysAgo.toISOString()} then ${ppvPurchases.amountPaidCents} else 0 end), 0)::int`,
				purchaseCount: sql<number>`count(*)::int`
			})
			.from(ppvPurchases)
			.where(inArray(ppvPurchases.contentId, contentIds))
			.groupBy(ppvPurchases.contentId);

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
		// Sort by lifetime revenue desc so the highest-earning content shows first.
		byContent.sort((a, b) => b.lifetimeCents - a.lifetimeCents);
	}

	// preferences.payment shape: { preference, fiatPct, usdcPct, stcPct }
	const prefs = (creator.preferences ?? {}) as Record<string, unknown>;
	const payment = (prefs.payment as Record<string, number> | undefined) ?? null;

	// Sparkline + month-over-month delta for the Earnings KpiCards.
	// Daily totals over the last 30 days (in cents). Uses the same per-user
	// completed creator_payout rows as `totals`.
	const SERIES_DAYS = 30;
	const seriesEarnings: number[] = new Array(SERIES_DAYS).fill(0);
	const sinceDate = new Date(Date.now() - SERIES_DAYS * 86_400_000);
	const dailyRows = await db
		.select({
			day: sql<string>`to_char(date_trunc('day', ${transactions.createdAt}), 'YYYY-MM-DD')`,
			cents: sql<number>`coalesce(sum(${transactions.amount}), 0)::int`
		})
		.from(transactions)
		.where(and(
			eq(transactions.userId, session.user.id),
			eq(transactions.type, 'creator_payout'),
			gte(transactions.createdAt, sinceDate)
		))
		.groupBy(sql`date_trunc('day', ${transactions.createdAt})`)
		.catch((err) => {
			console.warn('[creator/earnings] dailyRows failed:', err instanceof Error ? err.message : err);
			return [] as Array<{ day: string; cents: number }>;
		});
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	for (const r of dailyRows) {
		const d = new Date(r.day);
		const ago = Math.floor((today.getTime() - d.getTime()) / 86_400_000);
		const idx = SERIES_DAYS - 1 - ago;
		if (idx >= 0 && idx < SERIES_DAYS) {
			seriesEarnings[idx] = Number(r.cents);
		}
	}

	// Month-over-month delta — this month vs same window last month.
	const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
	const [lastMonthAgg] = await db
		.select({ total: sql<number>`coalesce(sum(${transactions.amount}), 0)::int` })
		.from(transactions)
		.where(and(
			eq(transactions.userId, session.user.id),
			eq(transactions.type, 'creator_payout'),
			eq(transactions.status, 'completed'),
			gte(transactions.createdAt, lastMonthStart),
			lt(transactions.createdAt, lastMonthEnd)
		))
		.catch((err) => {
			console.warn('[creator/earnings] lastMonthAgg failed:', err instanceof Error ? err.message : err);
			return [{ total: 0 }];
		});
	const lastMonthCents = Number(lastMonthAgg?.total ?? 0);
	const earningsDelta = lastMonthCents > 0
		? Math.round(((totals.monthCents - lastMonthCents) / lastMonthCents) * 1000) / 10
		: (totals.monthCents > 0 ? 100 : 0);

	// Tier comes from the CreatorPayments smart contract when the creator has
	// a linked wallet — that's the on-chain source of truth. Falls back to the
	// DB's `creatorType` mirror when the wallet isn't linked or RPC is down.
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
