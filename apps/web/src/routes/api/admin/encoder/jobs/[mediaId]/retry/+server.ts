import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';
import { commitEncoderJob } from '$lib/server/encoder-orchestrator';

/**
 * POST /api/admin/encoder/jobs/[mediaId]/retry
 *
 * Re-commits an existing orchestrator job (the source video is already
 * uploaded). If the row has no encoderJobId — i.e. the upload never
 * actually got off the ground — returns 400 with a hint.
 */

export const POST: RequestHandler = async ({ params, locals }) => {
	if (locals.user?.role !== 'admin') return json({ error: 'Forbidden' }, { status: 403 });

	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.mediaId!)).limit(1);

	if (!row) return json({ error: 'Not found' }, { status: 404 });
	if (!row.encoderJobId) {
		return json({ error: 'No encoder job to retry — content needs a fresh upload.' }, { status: 400 });
	}

	try {
		await commitEncoderJob(row.encoderJobId);
	} catch (err) {
		console.error(`[admin/encoder/retry] orchestrator commit failed for ${row.encoderJobId}:`, err);
		return json({ error: 'Orchestrator commit failed', detail: (err as Error).message }, { status: 502 });
	}

	await db.update(mediaLibrary)
		.set({ processingStatus: 'created', processingError: null, updatedAt: new Date() })
		.where(eq(mediaLibrary.id, row.id));

	return json({ success: true });
};
