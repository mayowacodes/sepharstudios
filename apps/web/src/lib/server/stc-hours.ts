import { db } from '$lib/db/drizzle';
import { transactions, mediaWatchProgress } from '$lib/db/schema/sepharstudios';
import { and, eq, gte, sql, sum } from 'drizzle-orm';

/**
 * Hours-based STC reward rules (replaces the old per-completion token engine).
 *
 *   - 1 STC on account sign-up (awarded in lib/auth.ts)
 *   - 1 STC for every HOURS_PER_TOKEN (20) watched hours
 *   - capped at MAX_TOKENS_PER_DAY (5) from watch-hours accrual
 *
 * Progress is derived from lifetime watched seconds (mediaWatchProgress) and
 * from the number of "watch_hours" STC ledger rows already written, so a user
 * can never be awarded the same 20h block twice.
 */

export const HOURS_PER_TOKEN = 20;
export const SECONDS_PER_TOKEN = HOURS_PER_TOKEN * 3600;
export const MAX_TOKENS_PER_DAY = 5;

const WATCH_HOURS_SOURCE = 'watch_hours';

export type StcProgress = {
	currency: 'STC';
	/** settled + pending STC earned from all sources (signup + watch hours) */
	balance: number;
	/** lifetime watched hours (float) */
	hoursWatched: number;
	/** whole 20h blocks the user has already been paid for */
	tokensClaimedFromHours: number;
	/** whole 20h blocks earned so far (may exceed claimed if capped today) */
	tokensEarnedFromHours: number;
	/** hours watched toward the NEXT token (0..HOURS_PER_TOKEN) */
	hoursTowardNextToken: number;
	/** hours remaining until the next token (0..HOURS_PER_TOKEN) */
	hoursToNextToken: number;
	/** how many more watch-hour tokens can still be granted today */
	dailyCapRemaining: number;
	/** true when a token is exactly reachable right now */
	readyToClaim: boolean;
};

/** Sum a user's lifetime watched seconds across all titles. */
async function totalWatchedSeconds(userId: string): Promise<number> {
	const [row] = await db
		.select({ total: sql<number>`coalesce(sum(${mediaWatchProgress.positionSeconds}), 0)` })
		.from(mediaWatchProgress)
		.where(eq(mediaWatchProgress.userId, userId))
		.catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}

/** Count watch-hour STC tokens already granted to the user. */
async function watchHourTokensClaimed(userId: string): Promise<number> {
	const [row] = await db
		.select({ total: sql<number>`coalesce(sum(${transactions.amount}), 0)` })
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.currency, 'STC'),
				eq(transactions.type, 'earn'),
				sql`${transactions.metadata}->>'source' = ${WATCH_HOURS_SOURCE}`
			)
		)
		.catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}

/** Watch-hour tokens granted so far today (for the daily cap). */
async function watchHourTokensToday(userId: string): Promise<number> {
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);
	const [row] = await db
		.select({ total: sql<number>`coalesce(sum(${transactions.amount}), 0)` })
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.currency, 'STC'),
				eq(transactions.type, 'earn'),
				sql`${transactions.metadata}->>'source' = ${WATCH_HOURS_SOURCE}`,
				gte(transactions.createdAt, startOfDay)
			)
		)
		.catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}

async function totalStcBalance(userId: string): Promise<number> {
	const [row] = await db
		.select({ total: sql<number>`coalesce(sum(${transactions.amount}), 0)` })
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				eq(transactions.currency, 'STC'),
				eq(transactions.type, 'earn')
			)
		)
		.catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}

/**
 * Compute (but do NOT grant) the user's STC progress including hours-to-next-
 * token. Safe to call from any read endpoint.
 */
export async function getStcProgress(userId: string): Promise<StcProgress> {
	const seconds = await totalWatchedSeconds(userId);
	const hoursWatched = seconds / 3600;
	const tokensEarnedFromHours = Math.floor(hoursWatched / HOURS_PER_TOKEN);

	const claimed = await watchHourTokensClaimed(userId);
	const claimedToday = await watchHourTokensToday(userId);
	const dailyCapRemaining = Math.max(0, MAX_TOKENS_PER_DAY - claimedToday);

	const balance = await totalStcBalance(userId);

	// Whole tokens the user is entitled to but has not yet been granted today
	// (respecting the daily cap).
	const unclaimed = Math.max(0, tokensEarnedFromHours - claimed);
	const readyToClaim = unclaimed > 0 && dailyCapRemaining > 0;

	const hoursInCurrentBlock = seconds % SECONDS_PER_TOKEN;
	const hoursTowardNextToken = hoursInCurrentBlock / 3600;
	const hoursToNextToken = HOURS_PER_TOKEN - hoursTowardNextToken;

	return {
		currency: 'STC',
		balance,
		hoursWatched,
		tokensClaimedFromHours: claimed,
		tokensEarnedFromHours,
		hoursTowardNextToken,
		hoursToNextToken,
		dailyCapRemaining,
		readyToClaim
	};
}

/**
 * Grant any watch-hour STC tokens the user has now earned, capped at
 * MAX_TOKENS_PER_DAY. Called on a real completion transition so we only run
 * it once per watch session. Returns the number of tokens granted.
 */
export async function awardWatchHourTokens(userId: string): Promise<number> {
	const progress = await getStcProgress(userId);
	const unclaimed = Math.max(0, progress.tokensEarnedFromHours - progress.tokensClaimedFromHours);
	const grantable = Math.min(unclaimed, progress.dailyCapRemaining);
	if (grantable <= 0) return 0;

	await db
		.insert(transactions)
		.values({
			id: crypto.randomUUID(),
			userId,
			type: 'earn',
			amount: grantable,
			currency: 'STC',
			status: 'pending',
			metadata: { source: WATCH_HOURS_SOURCE, hoursWatched: progress.hoursWatched }
		})
		.catch((err) => console.error('[stc-hours] failed to write watch-hour ledger row:', err));

	return grantable;
}

/** Grant the one-time sign-up STC bonus (idempotent within a session). */
export async function awardSignupToken(userId: string): Promise<void> {
	await db
		.insert(transactions)
		.values({
			id: crypto.randomUUID(),
			userId,
			type: 'earn',
			amount: 1,
			currency: 'STC',
			status: 'pending',
			metadata: { source: 'signup' }
		})
		.catch((err) => console.error('[stc-hours] failed to write signup ledger row:', err));
}
