import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { successStories } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected']);

export const GET: RequestHandler = async ({ url, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const status = url.searchParams.get('status');
	const rows = await db.select()
		.from(successStories)
		.where(status && ALLOWED_STATUSES.has(status) ? eq(successStories.status, status) : undefined)
		.orderBy(desc(successStories.createdAt))
		.limit(100);

	return json({ stories: rows });
};
