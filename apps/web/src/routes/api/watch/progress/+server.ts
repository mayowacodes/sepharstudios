import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaWatchProgress, reviews, playlistItems, playlists, transactions } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { checkAndAwardAchievements, updateStreak } from '$lib/server/achievements';
import { scoreWatchEngagement } from '$lib/server/ai-token-scoring';
import { notify } from '$lib/server/notify';
import { track } from '$lib/server/analytics';

// POST /api/watch/progress — save playback position (called every 30s)
export const POST: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { contentId, profileId, contentType, episodeId, positionSeconds, durationSeconds } = await request.json() as {
		contentId: string;
		profileId?: string;
		contentType?: string;
		episodeId?: string;
		positionSeconds: number;
		durationSeconds?: number;
	};

	const userId = session.user.id;
	const completionPercent = durationSeconds ? Math.round((positionSeconds / durationSeconds) * 100) : 0;
	const isCompleted = completionPercent >= 90;

	const existing = await db.select()
		.from(mediaWatchProgress)
		.where(and(
			eq(mediaWatchProgress.userId, userId),
			eq(mediaWatchProgress.contentId, contentId),
			episodeId ? eq(mediaWatchProgress.episodeId, episodeId) : eq(mediaWatchProgress.contentId, contentId)
		))
		.limit(1);

	const now = new Date();

	// `justCompleted` is the canonical signal that we just transitioned a row from
	// not-completed to completed. Computed atomically so two concurrent requests
	// can't both run the achievement/reward block.
	let justCompleted = false;

	if (existing[0]) {
		// Atomic transition: only set isCompleted=true if it was previously false
		// AND we are now reporting completion. Use RETURNING to learn whether we
		// actually flipped it. Concurrent requests serialize on the row lock and
		// the second one sees isCompleted already true → returning zero rows for
		// the completion branch.
		if (isCompleted && !existing[0].isCompleted) {
			const flipped = await db.update(mediaWatchProgress)
				.set({ positionSeconds, durationSeconds, completionPercent, isCompleted: true, updatedAt: now })
				.where(and(
					eq(mediaWatchProgress.id, existing[0].id),
					eq(mediaWatchProgress.isCompleted, false)
				))
				.returning({ id: mediaWatchProgress.id });
			justCompleted = flipped.length > 0;

			// If we didn't flip it (someone else just did), still record the latest
			// position so the user's scrubber resumes correctly.
			if (!justCompleted) {
				await db.update(mediaWatchProgress)
					.set({ positionSeconds, durationSeconds, completionPercent, updatedAt: now })
					.where(eq(mediaWatchProgress.id, existing[0].id));
			}
		} else {
			await db.update(mediaWatchProgress)
				.set({ positionSeconds, durationSeconds, completionPercent, isCompleted, updatedAt: now })
				.where(eq(mediaWatchProgress.id, existing[0].id));
		}
	} else {
		// First write for this (user, content). If isCompleted is true on the very
		// first sample, we own that transition.
		await db.insert(mediaWatchProgress).values({
			userId,
			profileId: profileId ?? null,
			contentId,
			contentType: contentType ?? 'movie',
			episodeId: episodeId ?? null,
			positionSeconds,
			durationSeconds,
			completionPercent,
			isCompleted
		});
		justCompleted = isCompleted;
	}

	// Only the request that actually transitioned the row to completed runs the
	// achievement, streak and reward logic — so the user can't double-claim by
	// firing two completion calls in parallel.
	if (justCompleted) {
		const newStreak = await updateStreak(userId, profileId ?? null);
		const awarded = await checkAndAwardAchievements(userId, profileId ?? null, {
			type: 'watch_complete',
			contentId
		});
		await checkAndAwardAchievements(userId, profileId ?? null, {
			type: 'streak_update',
			currentStreak: newStreak
		});

		// Gather engagement signals for the scoring model.
		const [reviewRows, userPlaylists] = await Promise.all([
			db.select({ id: reviews.id })
				.from(reviews)
				.where(and(eq(reviews.userId, userId), eq(reviews.contentId, contentId)))
				.limit(1),
			db.select({ id: playlists.id })
				.from(playlists)
				.where(eq(playlists.userId, userId))
		]);
		const existingReview = reviewRows[0];
		const playlistIds = userPlaylists.map((p) => p.id);
		const addedToWatchlist = playlistIds.length > 0 && (await db.select({ id: playlistItems.id })
			.from(playlistItems)
			.where(eq(playlistItems.contentId, contentId))
			.limit(1)).length > 0;

		const reward = await scoreWatchEngagement({
			completionPercent,
			watchTimeSeconds: positionSeconds,
			totalDurationSeconds: durationSeconds ?? 0,
			leftReview: !!existingReview,
			leftComment: false, // comments model not yet wired
			sharedContent: false,
			addedToWatchlist,
			baseStcReward: 10
		});

		// Record the earned STC as a pending ledger entry. There is no on-chain
		// transfer yet (treasury-wallet custody is a separate design decision —
		// see docs/NEXT_ROUND.md). Once that lands, a worker flips this row's
		// status from 'pending' → 'completed' and fills in `txHash`.
		const rewardAmount = reward?.recommendedStcReward ?? 0;
		if (rewardAmount > 0) {
			await db.insert(transactions).values({
				id: crypto.randomUUID(),
				userId,
				type: 'earn',
				amount: rewardAmount,
				currency: 'STC',
				status: 'pending',
				metadata: {
					contentId,
					completionPercent,
					engagementQuality: reward?.engagementQuality ?? null,
					tokenMultiplier: reward?.tokenMultiplier ?? null,
					source: 'watch_complete'
				}
			}).catch((err) => console.error('[watch/progress] failed to write STC ledger row:', err));
		}

		// Achievement notification — only if any new achievements were awarded.
		if (awarded.length > 0) {
			await notify({
				userId,
				kind: 'achievement',
				title: awarded.length === 1 ? 'Achievement unlocked' : `${awarded.length} achievements unlocked`,
				message: rewardAmount > 0
					? `You earned ${rewardAmount} STC tokens. Check your earnings to see what's pending.`
					: `You unlocked new achievement${awarded.length === 1 ? '' : 's'}. Keep watching to earn more.`,
				actionUrl: '/my-studios?tab=recent'
			});
		}

		await track(userId, 'watch_complete', {
			contentId,
			completionPercent,
			stcEarned: rewardAmount,
			engagementQuality: reward?.engagementQuality ?? null,
			achievementsUnlocked: awarded.length
		});

		return json({
			success: true,
			completed: true,
			newStreak,
			awarded,
			reward: reward ?? null
		});
	}

	return json({ success: true, completed: isCompleted });
};
