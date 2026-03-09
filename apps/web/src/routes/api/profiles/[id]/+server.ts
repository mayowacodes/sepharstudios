import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { profiles } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

// PUT /api/profiles/[id] — update profile
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const { name, avatarColor, avatarEmoji, contentRating, safeModeEnabled } = await request.json() as {
		name?: string; avatarColor?: string; avatarEmoji?: string; contentRating?: string; safeModeEnabled?: boolean;
	};

	const [updated] = await db.update(profiles)
		.set({ name, avatarColor, avatarEmoji, contentRating, safeModeEnabled, updatedAt: new Date() })
		.where(and(eq(profiles.id, params.id!), eq(profiles.userId, session.user.id)))
		.returning();

	if (!updated) return json({ error: 'Not found' }, { status: 404 });
	return json(updated);
};

// DELETE /api/profiles/[id]
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	await db.delete(profiles)
		.where(and(eq(profiles.id, params.id!), eq(profiles.userId, session.user.id)));

	return json({ success: true });
};
