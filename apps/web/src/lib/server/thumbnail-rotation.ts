import { db } from '$lib/db/drizzle';
import { contentThumbnailVariants } from '$lib/db/schema/sepharstudios';
import { and, eq, sql } from 'drizzle-orm';

/**
 * Picks the thumbnail to show for a given (content, user) pair.
 *
 * Determinism per (contentId, userId) ensures the user sees the same
 * variant within a session — no flicker on page-to-page navigation.
 * Falls back to the row's primary `thumbnail` when no active variants
 * exist (so callers can use this helper unconditionally).
 *
 * Returns `{ url, variantId }`. `variantId` is null when falling back
 * to the primary thumbnail.
 */
export interface ThumbnailChoice {
	url: string | null;
	variantId: string | null;
}

function hash(s: string): number {
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
	return h >>> 0;
}

export async function chooseThumbnail(
	contentId: string,
	userId: string | null,
	fallbackUrl: string | null
): Promise<ThumbnailChoice> {
	const variants = await db.select({
		id: contentThumbnailVariants.id,
		url: contentThumbnailVariants.url
	})
		.from(contentThumbnailVariants)
		.where(and(
			eq(contentThumbnailVariants.contentId, contentId),
			eq(contentThumbnailVariants.isActive, true)
		));

	if (variants.length === 0) {
		return { url: fallbackUrl, variantId: null };
	}

	const key = `${userId ?? 'anon'}:${contentId}`;
	const pick = variants[hash(key) % variants.length];
	return { url: pick.url, variantId: pick.id };
}

/**
 * Record an impression for a thumbnail variant. Fire-and-forget from the
 * browse cards; rate-limit / batching can come later if write rate matters.
 */
export async function recordImpression(variantId: string): Promise<void> {
	await db.update(contentThumbnailVariants)
		.set({ impressions: sql`${contentThumbnailVariants.impressions} + 1` })
		.where(eq(contentThumbnailVariants.id, variantId));
}

/**
 * Record a click for a thumbnail variant. Same shape as impression.
 */
export async function recordClick(variantId: string): Promise<void> {
	await db.update(contentThumbnailVariants)
		.set({ clicks: sql`${contentThumbnailVariants.clicks} + 1` })
		.where(eq(contentThumbnailVariants.id, variantId));
}
