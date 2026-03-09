import { db } from '$lib/db/drizzle';
import { userMilestones, mediaWatchProgress } from '$lib/db/schema/sepharstudios';
import { eq, and, sum } from 'drizzle-orm';

export type MilestoneEvent =
	| { type: 'stc_earned'; totalBalance: number }
	| { type: 'stake_created' }
	| { type: 'stc_subscription_used' }
	| { type: 'hours_watched' }
	| { type: 'anniversary'; accountCreatedAt: Date };

const MILESTONE_DEFS: Record<string, { name: string; description: string; stcBonus: number }> = {
	stc_100: {
		name: 'First 100 STC',
		description: 'Earned your first 100 Studio Tokens',
		stcBonus: 0
	},
	stc_500: {
		name: 'STC Power User',
		description: 'Earned 500 Studio Tokens',
		stcBonus: 25
	},
	stake_first: {
		name: 'First Stake',
		description: 'Staked STC tokens for the first time',
		stcBonus: 0
	},
	free_month_stc: {
		name: 'Redeemed with STC',
		description: 'Used Studio Tokens to unlock a free subscription month',
		stcBonus: 0
	},
	year_1: {
		name: '1-Year Member',
		description: 'Celebrated your first year on Sephar Studios',
		stcBonus: 50
	},
	hours_1000: {
		name: '1,000 Hours Watched',
		description: 'Watched over 1,000 hours of faith-based content',
		stcBonus: 0
	}
};

/**
 * Check and award any milestones triggered by an event.
 * Returns the codes of newly awarded milestones.
 */
export async function checkAndAwardMilestones(
	userId: string,
	event: MilestoneEvent
): Promise<string[]> {
	const earned = await db
		.select({ code: userMilestones.code })
		.from(userMilestones)
		.where(eq(userMilestones.userId, userId));
	const earnedCodes = new Set(earned.map((e) => e.code));

	const candidates: string[] = [];

	if (event.type === 'stc_earned') {
		if (event.totalBalance >= 100) candidates.push('stc_100');
		if (event.totalBalance >= 500) candidates.push('stc_500');
	}

	if (event.type === 'stake_created') {
		candidates.push('stake_first');
	}

	if (event.type === 'stc_subscription_used') {
		candidates.push('free_month_stc');
	}

	if (event.type === 'anniversary') {
		const msInYear = 365 * 24 * 60 * 60 * 1000;
		const ageMs = Date.now() - event.accountCreatedAt.getTime();
		if (ageMs >= msInYear) candidates.push('year_1');
	}

	if (event.type === 'hours_watched') {
		const [result] = await db
			.select({ totalSeconds: sum(mediaWatchProgress.positionSeconds) })
			.from(mediaWatchProgress)
			.where(eq(mediaWatchProgress.userId, userId));
		const totalSeconds = Number(result?.totalSeconds ?? 0);
		if (totalSeconds >= 1000 * 3600) candidates.push('hours_1000');
	}

	const awarded: string[] = [];
	for (const code of candidates) {
		if (earnedCodes.has(code)) continue;
		const def = MILESTONE_DEFS[code];
		if (!def) continue;

		await db.insert(userMilestones).values({
			userId,
			code,
			name: def.name,
			description: def.description,
			stcBonus: def.stcBonus
		});

		awarded.push(code);
	}

	return awarded;
}

/**
 * Get all milestones for a user with their progress info.
 */
export async function getUserMilestones(userId: string) {
	const earned = await db
		.select()
		.from(userMilestones)
		.where(eq(userMilestones.userId, userId));

	const earnedByCode = new Map(earned.map((m) => [m.code, m]));

	return Object.entries(MILESTONE_DEFS).map(([code, def]) => ({
		code,
		name: def.name,
		description: def.description,
		stcBonus: def.stcBonus,
		earned: earnedByCode.has(code),
		earnedAt: earnedByCode.get(code)?.earnedAt ?? null
	}));
}
