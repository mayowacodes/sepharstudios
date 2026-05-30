import { error } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { getEncoderPlayback } from '$lib/server/encoder-orchestrator';

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
			encoderJobId: mediaLibrary.encoderJobId,
			processingStatus: mediaLibrary.processingStatus,
			mediaType: mediaLibrary.mediaType,
			genres: mediaLibrary.genres,
			topics: mediaLibrary.topics,
			duration: mediaLibrary.duration,
			year: mediaLibrary.year,
			rating: mediaLibrary.rating,
			ageRating: mediaLibrary.ageRating,
			bibleReference: mediaLibrary.bibleReference,
			language: mediaLibrary.language,
			category: mediaLibrary.category,
			trailerUrl: mediaLibrary.trailerUrl,
			createdAt: mediaLibrary.createdAt,
			isActive: mediaLibrary.isActive,
			visibility: mediaLibrary.visibility,
			creatorId: mediaLibrary.creatorId
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id))
		.then((r) => r[0]);

	if (!content || !content.isActive) {
		error(404, 'Content not found');
	}

	// Visibility gate. `private` content is owner-only; `unlisted` works for
	// anyone holding the direct link; `public` is universal.
	const isOwner = content.creatorId === session.user.id;
	if (content.visibility === 'private' && !isOwner) {
		error(404, 'Content not found');
	}

	// Subtitle / caption / audio-description tracks attached to this row.
	// Split by kind so VideoPlayer can render them in the right tracks.
	const tracks = await db
		.select()
		.from(contentSubtitleTracks)
		.where(eq(contentSubtitleTracks.contentId, content.id));
	const subtitles = tracks
		.filter((t) => t.kind !== 'descriptions')
		.map((t) => ({ label: t.label, src: t.fileUrl, srclang: t.language }));
	const descriptions = tracks
		.filter((t) => t.kind === 'descriptions')
		.map((t) => ({ label: t.label, src: t.fileUrl, srclang: t.language }));

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
		subtitles,
		descriptions,
		activeProfileId: locals.activeProfileId
	};
};
