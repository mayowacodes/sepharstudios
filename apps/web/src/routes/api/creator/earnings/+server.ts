import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { creators, transactions, mediaLibrary, mediaWatchProgress } from '$lib/db/schema/sepharstudios';
import { and, eq, desc, sql, inArray } from 'drizzle-orm';
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
	const aggregates = await db
		.select({
			currency: transactions.currency,
			total: sql<number>`coalesce(sum(${transactions.amount}), 0)`,
			month: sql<number>`coalesce(sum(case when ${transactions.createdAt} >= ${monthStart} then ${transactions.amount} else 0 end), 0)`,
			year: sql<number>`coalesce(sum(case when ${transactions.createdAt} >= ${yearStart} then ${transactions.amount} else 0 end), 0)`
		})
		.from(transactions)
		.where(and(
			eq(transactions.userId, session.user.id),
			eq(transactions.type, 'creator_payout'),
			eq(transactions.status, 'completed')
		))
		.groupBy(transactions.currency);

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
		.limit(20);

	// Aggregate content stats from the live tables — also honest zero when the
	// creator hasn't published anything yet.
	const contentRows = await db
		.select({ id: mediaLibrary.id, viewCount: mediaLibrary.viewCount })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.creatorId, session.user.id));

	const totalViews = contentRows.reduce((a, c) => a + Number(c.viewCount ?? 0), 0);
	let completedWatches = 0;
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
	}

	// preferences.payment shape: { preference, fiatPct, usdcPct, stcPct }
	const prefs = (creator.preferences ?? {}) as Record<string, unknown>;
	const payment = (prefs.payment as Record<string, number> | undefined) ?? null;

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
		paymentPreference: payment ?? null
	});
};
