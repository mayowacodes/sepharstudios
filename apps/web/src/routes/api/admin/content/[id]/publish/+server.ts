import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, notificationPreferences } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';
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
		.select({ id: mediaLibrary.id, title: mediaLibrary.title, mediaType: mediaLibrary.mediaType, isActive: mediaLibrary.isActive })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.then(r => r[0]);

	if (!content) return json({ error: 'Content not found' }, { status: 404 });
	if (content.isActive) return json({ message: 'Already published', notified: 0 });

	// Publish: set isActive = true
	await db.update(mediaLibrary).set({ isActive: true }).where(eq(mediaLibrary.id, contentId));

	// Fan-out notifications — find all users who opted in to new release emails
	const recipients = await db
		.select({ email: user.email, name: user.name })
		.from(notificationPreferences)
		.innerJoin(user, eq(notificationPreferences.userId, user.id))
		.where(eq(notificationPreferences.newReleases, true));

	// Send emails in the background — don't block the response
	let notified = 0;
	const emailPromises = recipients.map(async (r) => {
		try {
			await sendNewReleaseNotification(r.email, r.name, content.title, content.mediaType ?? 'content', contentId);
			notified++;
		} catch {
			// Non-critical — log and continue
			console.error(`Failed to notify ${r.email} for content ${contentId}`);
		}
	});

	// Fire-and-forget — respond immediately, emails send async
	Promise.all(emailPromises).catch(() => {});

	return json({ success: true, contentId, notifying: recipients.length });
};
