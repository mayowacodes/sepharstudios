import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '$lib/server/admin-auth';

/**
 * GET /api/admin/admins
 *
 * Lists users with role='admin'. Used to populate the review-queue assignment
 * modal. Admin only.
 */
export const GET: RequestHandler = async ({ locals }) => {
	const { error } = await requireAdmin(locals);
	if (error) return error;

	const admins = await db
		.select({
			id: user.id,
			name: user.name,
			email: user.email,
			image: user.image
		})
		.from(user)
		.where(eq(user.role, 'admin'))
		.orderBy(user.name);

	return json({ admins });
};
