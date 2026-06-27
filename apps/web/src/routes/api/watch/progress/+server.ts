import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaWatchProgress, reviews, playlistItems, playlists, transactions, watchSessionMeta, creatorEarnings, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { checkAndAwardAchievements, updateStreak } from '$lib/server/achievements';
import { scoreWatchEngagement } from '$lib/server/ai-token-scoring';
import { computeCreatorEarning, type EngagementQuality } from '$lib/server/earnings-config';
import { notify } from '$lib/server/notify';
import { track } from '$lib/server/analytics';
import { publish } from '$lib/server/sse';
import { fingerprintFromHeaders } from '$lib/server/ua-country';

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

	// Helper for the "Live now" analytics panels. Looks up title +
	// creatorId in one quick query, then broadcasts on both the global
	// `analytics:watch-events:all` topic (admin dashboard) and the
	// per-creator `analytics:watch-events:creator:<id>` topic (the
	// creator's own dashboard). All errors swallowed — analytics
	// publish failures must never fail playback.
	async function publishWatchEvent(
		kind: 'watch_start' | 'watch_complete',
		mid: string,
		pct: number
	): Promise<void> {
		try {
			const [row] = await db
				.select({ title: mediaLibrary.title, creatorId: mediaLibrary.creatorId })
				.from(mediaLibrary)
				.where(eq(mediaLibrary.id, mid))
				.limit(1);
			if (!row) return;
			const event = {
				kind,
				contentId: mid,
				title: row.title,
				userId,
				completionPercent: pct,
				at: new Date().toISOString()
			};
			publish('analytics:watch-events:all', event);
			if (row.creatorId) {
				publish(`analytics:watch-events:creator:${row.creatorId}`, event);
			}
		} catch (err) {
			console.warn('[watch/progress] publishWatchEvent failed', err);
		}
	}

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
		// Publish a watch_start event so the admin + creator analytics
		// "Live now" panels can show "someone just started watching X".
		// Fire-and-forget; analytics surfaces are best-effort.
		void publishWatchEvent('watch_start', contentId, completionPercent);

		// Capture device + country on first watch-progress write for this session.
		// One row per (user, content) start is enough for the analytics aggregates —
		// we don't need to know every 30s ping came from the same device.
		const fp = fingerprintFromHeaders(request.headers);
		await db.insert(watchSessionMeta).values({
			userId,
			contentId,
			deviceType: fp.deviceType,
			browser: fp.browser,
			osName: fp.osName,
			country: fp.country
		}).catch((err) => console.warn('[watch/progress] watch_session_meta insert failed:', err));
	}

	// Live "watch_complete" event for analytics — fired once per real
	// completion transition. Uses the same fire-and-forget helper as
	// watch_start so a failed lookup never blocks playback.
	if (justCompleted) {
		void publishWatchEvent('watch_complete', contentId, completionPercent);
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

		// Creator-side earnings — separate ledger from the viewer's STC
		// reward above. Pays the creator a cents amount tied to completion +
		// engagement quality. See lib/server/earnings-config.ts for the curve.
		// Self-watches don't earn (creators can't pad their own KPIs).
		try {
			const [content] = await db
				.select({ creatorId: mediaLibrary.creatorId })
				.from(mediaLibrary)
				.where(eq(mediaLibrary.id, contentId))
				.limit(1);
			const creatorId = content?.creatorId;
			if (creatorId && creatorId !== userId && reward?.engagementQuality !== 'suspicious') {
				const earning = computeCreatorEarning({
					completionPercent,
					engagementQuality: (reward?.engagementQuality ?? 'low') as EngagementQuality
				});
				if (earning.amountCents > 0) {
					await db.insert(creatorEarnings).values({
						creatorId,
						contentId,
						viewerId: userId,
						amountCents: earning.amountCents,
						completionPercent,
						engagementQuality: reward?.engagementQuality ?? null,
						engagementMultiplier: Math.round(earning.engagementMultiplier * 100),
						source: 'watch_complete'
					});
				}
			}
		} catch (err) {
			console.error('[watch/progress] failed to write creator_earnings row:', err);
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
