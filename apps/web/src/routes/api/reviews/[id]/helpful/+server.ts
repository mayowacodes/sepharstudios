import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { reviews, reviewHelpful } from '$lib/db/schema/sepharstudios';
import { eq, and, sql } from 'drizzle-orm';

export const POST: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const reviewId = params.id!;

	// Verify review exists
	const review = await db.select({ id: reviews.id, helpfulCount: reviews.helpfulCount })
		.from(reviews)
		.where(eq(reviews.id, reviewId))
		.then((r) => r[0]);

	if (!review) return json({ error: 'Review not found' }, { status: 404 });

	// Check if user already voted
	const existing = await db.select({ id: reviewHelpful.id })
		.from(reviewHelpful)
		.where(and(
			eq(reviewHelpful.reviewId, reviewId),
			eq(reviewHelpful.userId, session.user.id)
		))
		.then((r) => r[0]);

	if (existing) {
		// Remove vote (toggle off)
		await db.delete(reviewHelpful).where(eq(reviewHelpful.id, existing.id));
		await db.update(reviews)
			.set({ helpfulCount: sql`GREATEST(${reviews.helpfulCount} - 1, 0)` })
			.where(eq(reviews.id, reviewId));
		return json({ helpful: false });
	}

	// Add vote
	await db.insert(reviewHelpful).values({
		reviewId,
		userId: session.user.id,
		isHelpful: true
	});
	await db.update(reviews)
		.set({ helpfulCount: sql`COALESCE(${reviews.helpfulCount}, 0) + 1` })
		.where(eq(reviews.id, reviewId));

	return json({ helpful: true });
};
