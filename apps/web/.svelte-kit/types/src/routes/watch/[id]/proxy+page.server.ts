// @ts-nocheck
import { error } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { getEncoderPlayback } from '$lib/server/encoder-orchestrator';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
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
			encoderJobId: mediaLibrary.encoderJobId,
			processingStatus: mediaLibrary.processingStatus,
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

	let playbackUrl = content.videoUrl;
	if (!playbackUrl && content.encoderJobId && content.processingStatus === 'ready') {
		try {
			const playback = await getEncoderPlayback(content.encoderJobId);
			playbackUrl = playback.playback.master;
		} catch (err) {
			console.error(`Failed to sign playback URL for ${content.id}:`, err);
		}
	}

	return {
		content: { ...content, playbackUrl },
		activeProfileId: locals.activeProfileId
	};
};
