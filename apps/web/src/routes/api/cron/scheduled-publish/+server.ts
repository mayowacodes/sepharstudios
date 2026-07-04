import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, notificationPreferences, notifications, comingSoonSubscriptions } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, inArray, isNotNull, isNull, lte } from 'drizzle-orm';
import { sendNewReleaseNotification } from '$lib/server/notifications';
import { notify } from '$lib/server/notify';

/**
 * POST /api/cron/scheduled-publish
 *
 * Looks for approved content rows whose `scheduledPublishAt` has elapsed,
 * flips them to published, and fans out new-release notifications. Same
 * effect as an admin clicking publish in /admin/content, but unattended.
 *
 * Auth: CRON_SECRET bearer (same as the other cron endpoints).
 * Schedule: every 5 minutes.
 */

const BATCH = 50;

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization');
	const expected = env.CRON_SECRET;
	if (!expected) {
		return json({ error: 'CRON_SECRET not configured on server' }, { status: 500 });
	}
	if (auth !== `Bearer ${expected}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	const now = new Date();

	// Catch both:
	//   - status='approved' rows scheduled by an admin (existing path)
	//   - status='coming_soon' rows whose release date has elapsed (new)
	// Both flip to status='published' + isActive=true via the same code
	// path below.
	const due = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		mediaType: mediaLibrary.mediaType,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		previousStatus: mediaLibrary.status
	})
		.from(mediaLibrary)
		.where(and(
			inArray(mediaLibrary.status, ['approved', 'coming_soon']),
			eq(mediaLibrary.isActive, false),
			isNotNull(mediaLibrary.scheduledPublishAt),
			lte(mediaLibrary.scheduledPublishAt, now)
		))
		.limit(BATCH);

	const result = { processed: 0, published: 0, skipped: 0, notified: 0, notifiedSubscribers: 0, errors: [] as string[] };

	for (const c of due) {
		result.processed += 1;

		// Readiness check: a row must have a PLAYABLE video before it goes
		// live. Playable = videoUrl persisted, OR an encoder job that has
		// reached 'ready' (resolvePlaybackUrl composes the URL from jobId
		// in that case). The old guard (`!videoUrl && encoderJobId &&
		// status !== 'ready'`) evaluated to false for rows with NO encoder
		// job at all — i.e. a Coming Soon announcement whose video was
		// never uploaded — and published them with nothing to play.
		const playable = !!c.videoUrl || (!!c.encoderJobId && c.processingStatus === 'ready');
		if (!playable) {
			result.skipped += 1;
			continue;
		}

		try {
			await db.update(mediaLibrary)
				.set({
					isActive: true,
					status: 'published',
					reviewedAt: now,
					updatedAt: now
				})
				.where(eq(mediaLibrary.id, c.id));
			result.published += 1;

			// Fan-out new-release notifications to opted-in users.
			const recipients = await db
				.select({ userId: user.id, email: user.email, name: user.name })
				.from(notificationPreferences)
				.innerJoin(user, eq(notificationPreferences.userId, user.id))
				.where(eq(notificationPreferences.newReleases, true));

			if (recipients.length > 0) {
				await db.insert(notifications).values(recipients.map((r) => ({
					userId: r.userId,
					kind: 'content_publish',
					title: `New ${c.mediaType}: ${c.title}`,
					message: 'A new piece of content just landed on Sephar Studios.',
					actionUrl: `/watch/${c.id}`
				}))).onConflictDoNothing();

				for (const r of recipients) {
					try {
						await sendNewReleaseNotification(r.email, r.name ?? 'there', c.title, c.mediaType, c.id);
						result.notified += 1;
					} catch (err) {
						console.warn('[scheduled-publish] email failed', r.email, err);
					}
				}
			}

			// Per-title Notify-me fan-out — viewers who tapped the bell
			// on this Coming Soon title's detail page get a personal
			// in-app + email + push (via notify()'s built-in routing)
			// the moment it drops. Distinct from the platform-wide
			// fan-out above: this list is tiny but the conversion
			// signal is strong. Stamping notified_at makes the
			// dispatch idempotent across cron re-runs.
			const subs = await db
				.select({ userId: comingSoonSubscriptions.userId, contentId: comingSoonSubscriptions.contentId })
				.from(comingSoonSubscriptions)
				.where(and(
					eq(comingSoonSubscriptions.contentId, c.id),
					isNull(comingSoonSubscriptions.notifiedAt)
				));

			for (const sub of subs) {
				try {
					await notify({
						userId: sub.userId,
						kind: 'content_publish',
						title: `${c.title} is live`,
						message: 'The title you were waiting for just dropped.',
						actionUrl: `/watch/${c.id}`
					});
					result.notifiedSubscribers += 1;
				} catch (err) {
					console.warn('[scheduled-publish] notify-me dispatch failed', sub.userId, err);
				}
			}

			if (subs.length > 0) {
				await db.update(comingSoonSubscriptions)
					.set({ notifiedAt: now })
					.where(and(
						eq(comingSoonSubscriptions.contentId, c.id),
						isNull(comingSoonSubscriptions.notifiedAt)
					));
			}
		} catch (err) {
			result.errors.push(`${c.id}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}

	return json({ ok: true, runAt: now.toISOString(), ...result });
};
