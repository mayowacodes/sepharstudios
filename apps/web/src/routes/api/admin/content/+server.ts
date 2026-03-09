import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq, desc, ilike, or } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const search = url.searchParams.get('search') ?? '';
	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
	const offset = parseInt(url.searchParams.get('offset') ?? '0');

	const query = db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			mediaType: mediaLibrary.mediaType,
			thumbnail: mediaLibrary.thumbnail,
			isActive: mediaLibrary.isActive,
			isNew: mediaLibrary.isNew,
			genres: mediaLibrary.genres,
			createdAt: mediaLibrary.createdAt
		})
		.from(mediaLibrary)
		.orderBy(desc(mediaLibrary.createdAt))
		.limit(limit)
		.offset(offset);

	const items = await query;
	return json(items);
};
