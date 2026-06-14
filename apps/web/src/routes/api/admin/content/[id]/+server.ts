import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { resolvePlaybackUrl } from '$lib/server/encoder-playback';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content ID' }, { status: 400 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const item = await db
		.select({
			id: mediaLibrary.id,
			title: mediaLibrary.title,
			description: mediaLibrary.description,
			mediaType: mediaLibrary.mediaType,
			ageRating: mediaLibrary.ageRating,
			thumbnail: mediaLibrary.thumbnail,
			posterUrl: mediaLibrary.posterUrl,
			backdropUrl: mediaLibrary.backdropUrl,
			trailerUrl: mediaLibrary.trailerUrl,
			videoUrl: mediaLibrary.videoUrl,
			duration: mediaLibrary.duration,
			genres: mediaLibrary.genres,
			topics: mediaLibrary.topics,
			keywords: mediaLibrary.keywords,
			language: mediaLibrary.language,
			bibleReference: mediaLibrary.bibleReference,
			status: mediaLibrary.status,
			isActive: mediaLibrary.isActive,
			createdAt: mediaLibrary.createdAt,
			reviewNotes: mediaLibrary.reviewNotes,
			rejectionReason: mediaLibrary.rejectionReason,
			creatorId: mediaLibrary.creatorId,
			creatorName: user.name,
			creatorEmail: user.email,
			contentScanStatus: mediaLibrary.contentScanStatus,
			contentScanReport: mediaLibrary.contentScanReport,
			processingStatus: mediaLibrary.processingStatus,
			processingProgress: mediaLibrary.processingProgress,
			processingStage: mediaLibrary.processingStage,
			processingError: mediaLibrary.processingError,
			encoderJobId: mediaLibrary.encoderJobId,
			chapters: mediaLibrary.chapters,
			previewThumbnailsVtt: mediaLibrary.previewThumbnailsVtt,
			previewSpriteUrls: mediaLibrary.previewSpriteUrls,
			posterAutoUrl: mediaLibrary.posterAutoUrl
		})
		.from(mediaLibrary)
		.leftJoin(user, eq(mediaLibrary.creatorId, user.id))
		.where(eq(mediaLibrary.id, contentId))
		.then(r => r[0]);

	if (!item) return json({ error: 'Content not found' }, { status: 404 });

	// Subtitle / caption / description tracks attached to this row — needed
	// by the admin video preview so reviewers see the same caption tracks
	// (including orchestrator-generated auto-translations) that viewers do.
	const tracks = await db
		.select()
		.from(contentSubtitleTracks)
		.where(eq(contentSubtitleTracks.contentId, contentId));
	const subtitles = tracks
		.filter((t) => t.kind !== 'descriptions')
		.map((t) => ({ label: t.label, src: t.fileUrl, srclang: t.language }));
	const descriptions = tracks
		.filter((t) => t.kind === 'descriptions')
		.map((t) => ({ label: t.label, src: t.fileUrl, srclang: t.language }));

	// Legacy-row fallback: for media whose encoder job finished BEFORE the
	// webhook learned to persist videoUrl, compute the URL from encoderJobId
	// on the fly. New rows already have videoUrl set on the ready webhook,
	// so this is just a transparent rescue for old completed jobs.
	const videoUrl = resolvePlaybackUrl({
		videoUrl: item.videoUrl,
		encoderJobId: item.encoderJobId,
		processingStatus: item.processingStatus
	});

	return json({ ...item, videoUrl, subtitles, descriptions });
};

/**
 * DELETE /api/admin/content/[id]
 *
 * Soft-delete: flips `is_active = false` and `status = 'archived'` so the
 * row is hidden from every public catalog query but stays in the DB for
 * audit + recovery. Hard-deletion would cascade into payouts / refunds /
 * watch-progress and orphan downstream rows.
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content ID' }, { status: 400 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [updated] = await db
		.update(mediaLibrary)
		.set({ isActive: false, status: 'archived', updatedAt: new Date() })
		.where(eq(mediaLibrary.id, contentId))
		.returning({ id: mediaLibrary.id });

	if (!updated) return json({ error: 'Content not found' }, { status: 404 });
	return json({ ok: true, id: updated.id });
};
