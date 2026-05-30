import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';

/**
 * POST /api/creator/content/[id]/subtitles
 *   body { kind: 'subtitles'|'captions'|'descriptions', language, label, fileUrl, isDefault? }
 *
 * Ownership check: the parent content row's creatorId must match the
 * signed-in user.
 */

const ALLOWED_KINDS = new Set(['subtitles', 'captions', 'descriptions']);

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const [content] = await db.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, params.id!))
		.limit(1);
	if (!content) return json({ error: 'Content not found' }, { status: 404 });
	if (content.creatorId !== session.user.id) return json({ error: 'Forbidden' }, { status: 403 });

	const body = await request.json().catch(() => ({})) as {
		kind?: string;
		language?: string;
		label?: string;
		fileUrl?: string;
		isDefault?: boolean;
	};

	const kind = body.kind && ALLOWED_KINDS.has(body.kind) ? body.kind : 'subtitles';
	const language = body.language?.trim().slice(0, 10) ?? '';
	const label = body.label?.trim().slice(0, 60) ?? '';
	const fileUrl = body.fileUrl?.trim() ?? '';
	const isDefault = !!body.isDefault;

	if (!language) return json({ error: 'language is required' }, { status: 400 });
	if (!label) return json({ error: 'label is required' }, { status: 400 });
	if (!fileUrl.startsWith('http')) return json({ error: 'fileUrl must be an absolute URL' }, { status: 400 });

	// If this track is marked default, clear any existing default for the same
	// kind so only one of each kind is the default.
	if (isDefault) {
		await db.update(contentSubtitleTracks)
			.set({ isDefault: false })
			.where(and(
				eq(contentSubtitleTracks.contentId, content.id),
				eq(contentSubtitleTracks.kind, kind)
			));
	}

	const [track] = await db.insert(contentSubtitleTracks).values({
		contentId: content.id,
		kind,
		language,
		label,
		fileUrl,
		isDefault
	}).returning();

	return json({ success: true, track });
};
