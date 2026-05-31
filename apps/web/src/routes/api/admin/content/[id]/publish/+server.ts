import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, notificationPreferences, notifications } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendNewReleaseNotification } from '$lib/server/notifications';

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	// Admin-only
	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content ID' }, { status: 400 });

	// Fetch the content item
	const content = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			mediaType: mediaLibrary.mediaType,
			isActive: mediaLibrary.isActive,
			processingStatus: mediaLibrary.processingStatus,
			videoUrl: mediaLibrary.videoUrl,
			encoderJobId: mediaLibrary.encoderJobId
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.then(r => r[0]);

	if (!content) return json({ error: 'Content not found' }, { status: 404 });
	if (content.isActive) return json({ message: 'Already published', notified: 0 });
	if (!content.videoUrl && content.encoderJobId && content.processingStatus !== 'ready') {
		return json({ error: 'Video is still processing and cannot be published yet' }, { status: 409 });
	}

	// Publish: set isActive = true and mark status
	await db
		.update(mediaLibrary)
		.set({
			isActive: true,
			status: 'published',
			reviewedAt: new Date(),
			reviewedBy: session.user.id
		})
		.where(eq(mediaLibrary.id, contentId));

	// Fan-out notifications — find all users who opted in to new release emails.
	// We also insert in-app notifications for the SAME audience (it doesn't make
	// sense to opt out of email but get an in-app ping for the same event).
	const recipients = await db
		.select({ userId: user.id, email: user.email, name: user.name })
		.from(notificationPreferences)
		.innerJoin(user, eq(notificationPreferences.userId, user.id))
		.where(eq(notificationPreferences.newReleases, true));

	// Bulk-insert in-app notifications first (cheap, indexed, one round-trip).
	if (recipients.length > 0) {
		await db.insert(notifications).values(
			recipients.map((r) => ({
				userId: r.userId,
				kind: 'content_publish',
				title: `New: ${content.title}`,
				message: `A new ${content.mediaType ?? 'release'} just dropped on Sephar Studios. Tap to watch.`,
				actionUrl: `/watch/${contentId}`
			}))
		).catch((err) => console.error('publish in-app notification batch failed:', err));
	}

	// Send the email batch and await it before returning so the response
	// reports actual delivery outcomes — admins were previously told
	// "notifying: N" even when 0 emails went through. Long-tail of failed
	// addresses is logged but the per-email try/catch keeps one bad
	// recipient from short-circuiting the rest.
	const emailResults = await Promise.allSettled(recipients.map(async (r) => {
		try {
			await sendNewReleaseNotification(r.email, r.name, content.title, content.mediaType ?? 'content', contentId);
			return { email: r.email, ok: true as const };
		} catch (err) {
			console.error(`Failed to notify ${r.email} for content ${contentId}:`, err);
			return { email: r.email, ok: false as const, error: err instanceof Error ? err.message : 'unknown' };
		}
	}));

	let delivered = 0;
	let failed = 0;
	for (const r of emailResults) {
		if (r.status === 'fulfilled' && r.value.ok) delivered++;
		else failed++;
	}

	return json({
		success: true,
		contentId,
		recipients: recipients.length,
		delivered,
		failed
	});
};
