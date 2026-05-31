import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { reviews, mediaLibrary } from '$lib/db/schema/sepharstudios';
import { and, eq, desc } from 'drizzle-orm';
import { moderateComment, scoreReviewQuality } from '$lib/server/ai-moderation';
import { take } from '$lib/server/rate-limit';

// GET /api/reviews?contentId=xxx — get approved reviews for content
export const GET: RequestHandler = async ({ url }) => {
	const contentId = url.searchParams.get('contentId');
	if (!contentId) return json({ error: 'contentId required' }, { status: 400 });

	const rows = await db.select().from(reviews)
		.where(and(eq(reviews.contentId, contentId), eq(reviews.isApproved, true)))
		.orderBy(desc(reviews.createdAt))
		.limit(20);

	return json(rows);
};

// POST /api/reviews — submit a review.
//
// Rate-limited per user because every submission fires TWO AI calls
// (moderateComment + scoreReviewQuality). Without throttling a single
// authenticated account could spam the endpoint to flood the moderation
// queue and burn AI credits. Capacity 5, refill 1 every 600s = sustained
// 6/hour with burst up to 5 — generous for a real human reviewing many
// movies, hostile to a script.
export const POST: RequestHandler = async ({ request, locals, getClientAddress }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const bucketKey = `reviews:${session.user.id ?? `ip:${getClientAddress()}`}`;
	const limit = await take(bucketKey, { capacity: 5, refillPerSec: 1 / 600 });
	if (!limit.allowed) {
		return json({ error: 'Too many reviews submitted recently. Try again in a few minutes.' }, { status: 429 });
	}

	const { contentId, contentType, rating, reviewText, profileId } = await request.json() as {
		contentId: string; contentType?: string; rating: number; reviewText?: string; profileId?: string;
	};

	if (rating < 1 || rating > 5) return json({ error: 'Rating must be 1–5' }, { status: 400 });

	// AI pre-moderation. We look up the content title for context (the moderator
	// LLM needs to know what the review is *about*).
	let aiApprove = false; // default: queue for human review if AI is down or flags
	let aiQualityScore = 0;
	if (reviewText && reviewText.trim().length > 0) {
		const [content] = await db.select({ title: mediaLibrary.title })
			.from(mediaLibrary)
			.where(eq(mediaLibrary.id, contentId))
			.limit(1);

		const contentTitle = content?.title ?? 'Sephar Studios content';
		// Two checks in parallel: spam/harm gate, then quality scoring.
		const [moderation, quality] = await Promise.all([
			moderateComment(reviewText, contentTitle),
			scoreReviewQuality(reviewText, rating, contentTitle)
		]);

		if (moderation?.verdict === 'reject') {
			return json({ error: 'Your review violated platform guidelines.', reason: moderation.reason }, { status: 422 });
		}
		// 'approve' verdict + non-trivial quality auto-publishes; everything else
		// (flag, AI down, very low quality) is queued for human review.
		aiApprove = moderation?.verdict === 'approve' && (quality?.qualityScore ?? 0) >= 5;
		aiQualityScore = quality?.qualityScore ?? 0;
	}

	// Check for existing review from this user on this content
	const [existing] = await db.select().from(reviews)
		.where(and(eq(reviews.userId, session.user.id), eq(reviews.contentId, contentId)))
		.limit(1);

	if (existing) {
		// Update existing review
		const [updated] = await db.update(reviews)
			.set({ rating, reviewText, isApproved: aiApprove, updatedAt: new Date() })
			.where(eq(reviews.id, existing.id))
			.returning();
		return json(updated);
	}

	const [review] = await db.insert(reviews).values({
		userId: session.user.id,
		profileId: profileId ?? null,
		contentId,
		contentType: contentType ?? 'movie',
		rating,
		reviewText,
		isApproved: aiApprove
	}).returning();

	return json({ ...review, aiQualityScore }, { status: 201 });
};
