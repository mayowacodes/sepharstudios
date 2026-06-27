import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks } from '$lib/db/schema/sepharstudios';
import { user } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { resolvePlaybackUrl } from '$lib/server/encoder-playback';
import { permanentlyDeleteContent } from '$lib/server/content-delete';

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
			posterAutoUrl: mediaLibrary.posterAutoUrl,
			// Admin-edit audit
			editedBy: mediaLibrary.editedBy,
			editedAt: mediaLibrary.editedAt,
			updatedAt: mediaLibrary.updatedAt,
			// Extra editable surface for the admin metadata editor —
			// reviewers need to see (and rewrite) these too. Not exposed
			// on the older partial-projection because the v1 review page
			// only rendered them as read-only chrome.
			slug: mediaLibrary.slug,
			category: mediaLibrary.category,
			posterLandscapeUrl: mediaLibrary.posterLandscapeUrl,
			posterSquareUrl: mediaLibrary.posterSquareUrl,
			logoTitleUrl: mediaLibrary.logoTitleUrl,
			cast: mediaLibrary.cast,
			crew: mediaLibrary.crew,
			visibility: mediaLibrary.visibility,
			scheduledPublishAt: mediaLibrary.scheduledPublishAt
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

	// Resolve the admin editor's display name if editedBy is set. Kept
	// as a tiny separate query so we don't have to alias `user` twice
	// in the main join graph. Returns null when the row has never been
	// admin-edited (the common case for fresh submissions).
	let editorName: string | null = null;
	if (item.editedBy) {
		const [editor] = await db
			.select({ name: user.name })
			.from(user)
			.where(eq(user.id, item.editedBy))
			.limit(1);
		editorName = editor?.name ?? null;
	}

	return json({ ...item, videoUrl, subtitles, descriptions, editorName });
};

/**
 * PATCH /api/admin/content/[id]
 *
 * Admin metadata editor. Lets an admin rewrite the same field set the
 * creator can rewrite on their own row — title, description, type,
 * age rating, audience, taxonomy, etc. Unlike the creator's PATCH at
 * /api/creator/content/[id], this endpoint bypasses the ownership
 * check (creatorId === me) and stamps editedBy/editedAt for audit.
 *
 * Allow-list is the source of truth — any field NOT in the list is
 * silently dropped, so a malformed payload can't write arbitrary
 * columns. Empty-string posters get coerced to null so the catalog's
 * fallback chain (poster → thumbnail → placeholder) still works.
 *
 * Asset URLs (posterUrl, trailerUrl, etc.) are accepted as raw
 * strings — the admin pastes a freshly-uploaded MinIO URL. Full
 * presigned upload UX inside this editor is a v2 task; v1 is text
 * fields + the URLs the creator already submitted.
 */
const ADMIN_EDIT_ALLOW_LIST = [
	'title',
	'description',
	'mediaType',
	'ageRating',
	'category',
	'language',
	'duration',
	'genres',
	'topics',
	'keywords',
	'bibleReference',
	'thumbnail',
	'posterUrl',
	'posterLandscapeUrl',
	'posterSquareUrl',
	'logoTitleUrl',
	'backdropUrl',
	'trailerUrl',
	'cast',
	'crew',
	'visibility',
	'scheduledPublishAt',
	'isActive',
	'status'
] as const;

type AdminEditableField = (typeof ADMIN_EDIT_ALLOW_LIST)[number];

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content ID' }, { status: 400 });

	const adminUser = await db
		.select({ role: user.role })
		.from(user)
		.where(eq(user.id, session.user.id))
		.then((r) => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 });
	}

	// Filter to the allow-list. We don't reject unknown keys (a future
	// schema addition shouldn't break old admin clients) — we just drop.
	const patch: Record<string, unknown> = {};
	for (const key of ADMIN_EDIT_ALLOW_LIST as readonly string[]) {
		if (key in body) {
			const v = body[key];
			// Coerce empty strings on optional URL/text columns to null so
			// the catalog's "fall back to thumbnail" chain works.
			if (typeof v === 'string' && v.trim() === '') {
				patch[key] = null;
			} else if (key === 'scheduledPublishAt' && typeof v === 'string' && v) {
				const d = new Date(v);
				patch[key] = Number.isNaN(d.getTime()) ? null : d;
			} else {
				patch[key] = v;
			}
		}
	}

	if (Object.keys(patch).length === 0) {
		return json({ error: 'No editable fields supplied' }, { status: 400 });
	}

	const now = new Date();
	patch.editedBy = session.user.id;
	patch.editedAt = now;
	patch.updatedAt = now;

	try {
		const [updated] = await db
			.update(mediaLibrary)
			.set(patch as Partial<typeof mediaLibrary.$inferInsert>)
			.where(eq(mediaLibrary.id, contentId))
			.returning({
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				editedAt: mediaLibrary.editedAt,
				updatedAt: mediaLibrary.updatedAt
			});

		if (!updated) return json({ error: 'Content not found' }, { status: 404 });

		return json({
			ok: true,
			id: updated.id,
			title: updated.title,
			editedAt: updated.editedAt,
			updatedAt: updated.updatedAt,
			fieldsApplied: Object.keys(patch).filter((k) => k !== 'editedBy' && k !== 'editedAt' && k !== 'updatedAt') as AdminEditableField[]
		});
	} catch (err) {
		console.error('[admin/content PATCH] update failed', err);
		return json(
			{ error: 'Update failed', detail: err instanceof Error ? err.message : 'unknown' },
			{ status: 500 }
		);
	}
};

/**
 * DELETE /api/admin/content/[id][?mode=archive|delete]
 *
 * Two modes, gated by the `mode` query string:
 *
 *   - default / mode=archive  → soft archive (flips is_active=false +
 *     status='archived'). The row stays in the DB for audit + recovery.
 *
 *   - mode=delete             → hard delete via the shared helper. PPV
 *     purchases block the action (409); an in-flight encoder workflow
 *     is cancelled first; FK cascades + MinIO cleanup follow.
 */
export const DELETE: RequestHandler = async ({ params, url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const contentId = params.id;
	if (!contentId) return json({ error: 'Missing content ID' }, { status: 400 });

	const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then(r => r[0]);
	if (adminUser?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const mode = url.searchParams.get('mode') ?? 'archive';

	if (mode === 'delete') {
		const result = await permanentlyDeleteContent(contentId, session.user.id);
		if (!result.ok) {
			if (result.reason === 'not_found') {
				return json({ error: 'Content not found' }, { status: 404 });
			}
			if (result.reason === 'ppv_purchases_exist') {
				return json(
					{
						error: 'Cannot permanently delete content with existing PPV purchases. Archive instead, or contact support to void the purchases first.',
						blockedBy: 'ppv_purchases'
					},
					{ status: 409 }
				);
			}
		}
		return json({ ok: true, deleted: true });
	}

	// Default + mode=archive — keep the prior soft-archive behavior.
	const [updated] = await db
		.update(mediaLibrary)
		.set({ isActive: false, status: 'archived', updatedAt: new Date() })
		.where(eq(mediaLibrary.id, contentId))
		.returning({ id: mediaLibrary.id });

	if (!updated) return json({ error: 'Content not found' }, { status: 404 });
	return json({ ok: true, id: updated.id, archived: true });
};
