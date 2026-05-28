import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { generateContentMetadata } from '$lib/server/ai-tagging';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { enforceRateLimit, AI_AGENT_LIMIT } from '$lib/server/rate-limit';

/**
 * POST /api/ai/tag
 * Auto-generate metadata for a content item.
 * Called from: encoder-ready webhook, creator upload flow, admin panel.
 *
 * Body: { contentId } — existing mediaLibrary record
 *   OR: { title, description, contentType } — standalone generation
 *
 * If contentId is provided, metadata suggestions are saved back to the DB.
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Unauthorized');
	await enforceRateLimit(`ai:tag:${locals.user.id}`, AI_AGENT_LIMIT);

	const body = await request.json();
	const { contentId, title, description, contentType = 'movie' } = body;

	let resolvedTitle = title;
	let resolvedDescription = description;
	let resolvedType = contentType;

	// Fetch from DB if contentId provided
	if (contentId) {
		const [content] = await db
			.select({
				title: mediaLibrary.title,
				description: mediaLibrary.description,
				mediaType: mediaLibrary.mediaType
			})
			.from(mediaLibrary)
			.where(eq(mediaLibrary.id, contentId))
			.limit(1);

		if (!content) throw error(404, 'Content not found');
		resolvedTitle = content.title;
		resolvedDescription = content.description ?? '';
		resolvedType = content.mediaType;
	}

	if (!resolvedTitle) throw error(400, 'title is required');

	const metadata = await generateContentMetadata(resolvedTitle, resolvedDescription ?? '', resolvedType);
	if (!metadata) throw error(503, 'AI tagging service unavailable');

	// If contentId given, write suggestions back to the DB
	if (contentId) {
		await db
			.update(mediaLibrary)
			.set({
				genres: metadata.genres,
				topics: metadata.topics,
				keywords: metadata.keywords,
				bibleReference: metadata.bibleReference || undefined,
				ageRating: metadata.ageRating,
				updatedAt: new Date()
			})
			.where(eq(mediaLibrary.id, contentId));
	}

	return json({ metadata, saved: !!contentId });
};
