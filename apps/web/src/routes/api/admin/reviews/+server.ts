import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { reviews } from '$lib/db/schema/sepharstudios';
import { eq, desc, isNull, or } from 'drizzle-orm';

// GET /api/admin/reviews?approved=false — fetch reviews pending moderation
export const GET: RequestHandler = async ({ url, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const approvedParam = url.searchParams.get('approved');
	const rows = await db.select().from(reviews)
		.where(approvedParam === 'false' ? eq(reviews.isApproved, false) : undefined)
		.orderBy(desc(reviews.createdAt))
		.limit(50);

	return json(rows);
};

// PATCH /api/admin/reviews — approve or reject a review
export const PATCH: RequestHandler = async ({ request, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const { id, isApproved } = await request.json() as { id: string; isApproved: boolean };
	if (!id) return json({ error: 'id required' }, { status: 400 });

	const [updated] = await db.update(reviews)
		.set({ isApproved, updatedAt: new Date() })
		.where(eq(reviews.id, id))
		.returning({ id: reviews.id, isApproved: reviews.isApproved });

	return json(updated);
};

// DELETE /api/admin/reviews — delete a review
export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const { id } = await request.json() as { id: string };
	if (!id) return json({ error: 'id required' }, { status: 400 });

	await db.delete(reviews).where(eq(reviews.id, id));
	return json({ success: true });
};
