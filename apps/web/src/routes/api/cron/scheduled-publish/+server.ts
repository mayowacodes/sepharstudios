import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, notificationPreferences, notifications } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, eq, isNotNull, lte } from 'drizzle-orm';
import { sendNewReleaseNotification } from '$lib/server/notifications';

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

	const due = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		mediaType: mediaLibrary.mediaType,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus
	})
		.from(mediaLibrary)
		.where(and(
			eq(mediaLibrary.status, 'approved'),
			eq(mediaLibrary.isActive, false),
			isNotNull(mediaLibrary.scheduledPublishAt),
			lte(mediaLibrary.scheduledPublishAt, now)
		))
		.limit(BATCH);

	const result = { processed: 0, published: 0, skipped: 0, notified: 0, errors: [] as string[] };

	for (const c of due) {
		result.processed += 1;

		// Same readiness check the admin publish endpoint uses — skip rows whose
		// video isn't actually encoded yet.
		if (!c.videoUrl && c.encoderJobId && c.processingStatus !== 'ready') {
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
		} catch (err) {
			result.errors.push(`${c.id}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}

	return json({ ok: true, runAt: now.toISOString(), ...result });
};
