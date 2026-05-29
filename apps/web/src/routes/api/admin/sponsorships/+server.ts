import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { sponsorshipApplications } from '$lib/db/schema/sepharstudios';
import { desc, eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

const ALLOWED_STATUSES = new Set(['pending', 'reviewing', 'approved', 'rejected']);

export const GET: RequestHandler = async ({ url, locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const status = url.searchParams.get('status');
	const rows = await db.select()
		.from(sponsorshipApplications)
		.where(status && ALLOWED_STATUSES.has(status) ? eq(sponsorshipApplications.status, status) : undefined)
		.orderBy(desc(sponsorshipApplications.createdAt))
		.limit(100);

	return json({ applications: rows });
};
