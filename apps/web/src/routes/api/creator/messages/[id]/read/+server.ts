import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { adminMessages } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const result = await db.update(adminMessages)
		.set({ status: 'read' })
		.where(and(
			eq(adminMessages.id, params.id!),
			eq(adminMessages.creatorId, session.user.id)
		))
		.returning({ id: adminMessages.id });

	if (result.length === 0) return json({ error: 'Not found' }, { status: 404 });
	return json({ success: true });
};
