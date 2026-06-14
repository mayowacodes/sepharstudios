import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';

/**
 * GET /api/encoder/jobs/[jobId]
 *
 * Status lookup for an in-flight encode. The DB row is the source of
 * truth — it's populated by the platform webhook from Temporal. Used to
 * be enriched with an `orchestrator` field from a sidecar GET against
 * the orchestrator API, but with Temporal that data lives in Temporal
 * Web UI and is best read there, not exposed through the platform API.
 */

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const jobId = (params as Record<string, string>).jobId;
	if (!jobId) return json({ error: 'jobId is required' }, { status: 400 });

	const [content] = await db
		.select({
			id: mediaLibrary.id,
			creatorId: mediaLibrary.creatorId,
			processingStatus: mediaLibrary.processingStatus,
			processingProgress: mediaLibrary.processingProgress,
			processingStage: mediaLibrary.processingStage,
			processingError: mediaLibrary.processingError
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.encoderJobId, jobId))
		.limit(1);

	if (!content) return json({ error: 'Content not found for job' }, { status: 404 });

	if (content.creatorId && content.creatorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	return json({
		contentId: content.id,
		jobId,
		status: content.processingStatus,
		progress: content.processingProgress ?? 0,
		stage: content.processingStage,
		error: content.processingError
	});
};
