import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { and, desc, eq, ilike, or } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const search = url.searchParams.get('search') ?? '';
	const status = url.searchParams.get('status');
	const onlyPending = url.searchParams.get('pending') === 'true';
	const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
	const offset = parseInt(url.searchParams.get('offset') ?? '0');

	const filters = [];
	if (search) {
		filters.push(
			or(
				ilike(mediaLibrary.title, `%${search}%`),
				ilike(mediaLibrary.description, `%${search}%`),
				ilike(user.name, `%${search}%`),
				ilike(user.email, `%${search}%`)
			)
		);
	}
	if (status) filters.push(eq(mediaLibrary.status, status));
	if (onlyPending) filters.push(eq(mediaLibrary.status, 'submitted'));

	const whereClause = filters.length ? and(...filters) : undefined;

	let query = db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			mediaType: mediaLibrary.mediaType,
			thumbnail: mediaLibrary.thumbnail,
			isActive: mediaLibrary.isActive,
			status: mediaLibrary.status,
			isNew: mediaLibrary.isNew,
			genres: mediaLibrary.genres,
			viewCount: mediaLibrary.viewCount,
			createdAt: mediaLibrary.createdAt,
			creatorId: mediaLibrary.creatorId,
			creatorName: user.name,
			creatorEmail: user.email
		})
		.from(mediaLibrary)
		.leftJoin(user, eq(mediaLibrary.creatorId, user.id));

	if (whereClause) query = query.where(whereClause);

	const items = await query
		.orderBy(desc(mediaLibrary.createdAt))
		.limit(limit)
		.offset(offset);
	return json(items);
};
