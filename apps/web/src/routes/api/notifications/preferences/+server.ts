import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { notificationPreferences } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

// GET /api/notifications/preferences
export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [prefs] = await db.select().from(notificationPreferences)
		.where(eq(notificationPreferences.userId, session.user.id))
		.limit(1);

	if (!prefs) {
		// Return defaults
		return json({ newReleases: true, trialExpiry: true, paymentConfirmation: true, weeklyDigest: false, creatorUpdates: false });
	}

	return json(prefs);
};

// PUT /api/notifications/preferences
export const PUT: RequestHandler = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const data = await request.json() as {
		newReleases?: boolean; trialExpiry?: boolean; paymentConfirmation?: boolean;
		weeklyDigest?: boolean; creatorUpdates?: boolean;
	};

	const [existing] = await db.select().from(notificationPreferences)
		.where(eq(notificationPreferences.userId, session.user.id))
		.limit(1);

	if (existing) {
		const [updated] = await db.update(notificationPreferences)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(notificationPreferences.userId, session.user.id))
			.returning();
		return json(updated);
	}

	const [created] = await db.insert(notificationPreferences)
		.values({ userId: session.user.id, ...data })
		.returning();
	return json(created);
};
