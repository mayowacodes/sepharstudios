import { error } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const session = locals.session;
	if (!session) {
		error(401, 'Please sign in to watch content');
	}

	const content = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			backdropUrl: mediaLibrary.backdropUrl,
			videoUrl: mediaLibrary.videoUrl,
			videoId: mediaLibrary.videoId,
			mediaType: mediaLibrary.mediaType,
			genres: mediaLibrary.genres,
			duration: mediaLibrary.duration,
			year: mediaLibrary.year,
			rating: mediaLibrary.rating,
			ageRating: mediaLibrary.ageRating,
			bibleReference: mediaLibrary.bibleReference,
			language: mediaLibrary.language,
			isActive: mediaLibrary.isActive
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id))
		.then((r) => r[0]);

	if (!content || !content.isActive) {
		error(404, 'Content not found');
	}

	return {
		content,
		activeProfileId: locals.activeProfileId
	};
};
