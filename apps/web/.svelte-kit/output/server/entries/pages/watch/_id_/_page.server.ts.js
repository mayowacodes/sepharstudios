import { j as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { i as getEncoderPlayback } from "../../../../chunks/encoder-orchestrator.js";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/watch/[id]/+page.server.ts
var load = async ({ params, locals }) => {
	if (!locals.session) error(401, "Please sign in to watch content");
	const content = await db.select({
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
		isActive: mediaLibrary.isActive
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.id)).then((r) => r[0]);
	if (!content || !content.isActive) error(404, "Content not found");
	let playbackUrl = content.videoUrl;
	if (!playbackUrl && content.encoderJobId && content.processingStatus === "ready") try {
		playbackUrl = (await getEncoderPlayback(content.encoderJobId)).playback.master;
	} catch (err) {
		console.error(`Failed to sign playback URL for ${content.id}:`, err);
	}
	return {
		content: {
			...content,
			playbackUrl
		},
		activeProfileId: locals.activeProfileId
	};
};
//#endregion
export { load };
