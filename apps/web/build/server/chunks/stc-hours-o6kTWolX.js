import { d as db, t as transactions, i as mediaWatchProgress } from './drizzle-DlGuU73K.js';
import { sql, eq, and, gte } from 'drizzle-orm';

var SECONDS_PER_TOKEN = 20 * 3600;
var WATCH_HOURS_SOURCE = "watch_hours";
/** Sum a user's lifetime watched seconds across all titles. */
async function totalWatchedSeconds(userId) {
	const [row] = await db.select({ total: sql`coalesce(sum(${mediaWatchProgress.positionSeconds}), 0)` }).from(mediaWatchProgress).where(eq(mediaWatchProgress.userId, userId)).catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}
/** Count watch-hour STC tokens already granted to the user. */
async function watchHourTokensClaimed(userId) {
	const [row] = await db.select({ total: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(and(eq(transactions.userId, userId), eq(transactions.currency, "STC"), eq(transactions.type, "earn"), sql`${transactions.metadata}->>'source' = ${WATCH_HOURS_SOURCE}`)).catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}
/** Watch-hour tokens granted so far today (for the daily cap). */
async function watchHourTokensToday(userId) {
	const startOfDay = /* @__PURE__ */ new Date();
	startOfDay.setHours(0, 0, 0, 0);
	const [row] = await db.select({ total: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(and(eq(transactions.userId, userId), eq(transactions.currency, "STC"), eq(transactions.type, "earn"), sql`${transactions.metadata}->>'source' = ${WATCH_HOURS_SOURCE}`, gte(transactions.createdAt, startOfDay))).catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}
async function totalStcBalance(userId) {
	const [row] = await db.select({ total: sql`coalesce(sum(${transactions.amount}), 0)` }).from(transactions).where(and(eq(transactions.userId, userId), eq(transactions.currency, "STC"), eq(transactions.type, "earn"))).catch(() => [{ total: 0 }]);
	return Number(row?.total ?? 0);
}
/**
* Compute (but do NOT grant) the user's STC progress including hours-to-next-
* token. Safe to call from any read endpoint.
*/
async function getStcProgress(userId) {
	const seconds = await totalWatchedSeconds(userId);
	const hoursWatched = seconds / 3600;
	const tokensEarnedFromHours = Math.floor(hoursWatched / 20);
	const claimed = await watchHourTokensClaimed(userId);
	const claimedToday = await watchHourTokensToday(userId);
	const dailyCapRemaining = Math.max(0, 5 - claimedToday);
	const balance = await totalStcBalance(userId);
	const readyToClaim = Math.max(0, tokensEarnedFromHours - claimed) > 0 && dailyCapRemaining > 0;
	const hoursTowardNextToken = seconds % SECONDS_PER_TOKEN / 3600;
	return {
		currency: "STC",
		balance,
		hoursWatched,
		tokensClaimedFromHours: claimed,
		tokensEarnedFromHours,
		hoursTowardNextToken,
		hoursToNextToken: 20 - hoursTowardNextToken,
		dailyCapRemaining,
		readyToClaim
	};
}
/**
* Grant any watch-hour STC tokens the user has now earned, capped at
* MAX_TOKENS_PER_DAY. Called on a real completion transition so we only run
* it once per watch session. Returns the number of tokens granted.
*/
async function awardWatchHourTokens(userId) {
	const progress = await getStcProgress(userId);
	const unclaimed = Math.max(0, progress.tokensEarnedFromHours - progress.tokensClaimedFromHours);
	const grantable = Math.min(unclaimed, progress.dailyCapRemaining);
	if (grantable <= 0) return 0;
	await db.insert(transactions).values({
		id: crypto.randomUUID(),
		userId,
		type: "earn",
		amount: grantable,
		currency: "STC",
		status: "pending",
		metadata: {
			source: WATCH_HOURS_SOURCE,
			hoursWatched: progress.hoursWatched
		}
	}).catch((err) => console.error("[stc-hours] failed to write watch-hour ledger row:", err));
	return grantable;
}
/** Grant the one-time sign-up STC bonus (idempotent within a session). */
async function awardSignupToken(userId) {
	await db.insert(transactions).values({
		id: crypto.randomUUID(),
		userId,
		type: "earn",
		amount: 1,
		currency: "STC",
		status: "pending",
		metadata: { source: "signup" }
	}).catch((err) => console.error("[stc-hours] failed to write signup ledger row:", err));
}

export { awardWatchHourTokens as a, awardSignupToken as b, getStcProgress as g };
//# sourceMappingURL=stc-hours-o6kTWolX.js.map
