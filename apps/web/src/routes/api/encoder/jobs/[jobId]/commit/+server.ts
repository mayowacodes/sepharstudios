import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { startEncoderWorkflow } from '$lib/server/temporal-client';

/**
 * POST /api/encoder/jobs/[jobId]/commit
 *
 * Stage-2 of the upload flow: the browser has finished uploading to the
 * presigned URL from /api/encoder/jobs, so we now start the encoder
 * workflow in Temporal.
 *
 * Idempotent — re-posting the same commit raises
 * `WorkflowExecutionAlreadyStartedError` inside Temporal. We surface that
 * as a 200; the workflow is already in flight.
 *
 * No body required from the client. The inputObject is reconstructed from
 * the jobId (`${jobId}/source`) per the convention set at /jobs.
 */

const INPUT_BUCKET = env.ENCODER_INPUT_BUCKET || env.MINIO_INPUT_BUCKET || 'encoder-input';
const OUTPUT_BUCKET = env.ENCODER_OUTPUT_BUCKET || env.MINIO_OUTPUT_BUCKET || 'encoder-output';

export const POST: RequestHandler = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: 'Unauthorized' }, { status: 401 });

	const jobId = (params as Record<string, string>).jobId;
	if (!jobId) return json({ error: 'jobId is required' }, { status: 400 });

	// Optional body for per-submit overrides (profile, durationHint). The
	// wizard doesn't pass these today, but it might in the future.
	const body = await request.json().catch(() => ({}));
	const profile = (body.profile as 'vod-480' | 'vod-multi' | 'vod-multi-2k' | 'vod-multi-4k') ?? 'vod-multi';
	const durationHintSec = typeof body.durationHint === 'number' ? body.durationHint : undefined;

	const [content] = await db
		.select({ id: mediaLibrary.id, creatorId: mediaLibrary.creatorId })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.encoderJobId, jobId))
		.limit(1);

	if (!content) return json({ error: 'Content not found for job' }, { status: 404 });
	if (content.creatorId && content.creatorId !== session.user.id) {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	try {
		const { workflowId, runId } = await startEncoderWorkflow({
			jobId,
			mediaId: content.id,
			inputBucket: INPUT_BUCKET,
			inputObject: `${jobId}/source`,
			outputBucket: OUTPUT_BUCKET,
			outputPrefix: jobId,
			profile,
			durationHintSec
		});

		await db
			.update(mediaLibrary)
			.set({
				processingStatus: 'queued',
				processingError: null,
				updatedAt: new Date()
			})
			.where(eq(mediaLibrary.id, content.id));

		return json({ contentId: content.id, jobId, workflowId, runId, status: 'queued' });
	} catch (error) {
		// Re-deliver of the same commit lands here with `WorkflowExecutionAlreadyStartedError`
		// — that's fine, the workflow is already running. Surface as 200.
		const msg = error instanceof Error ? error.message : String(error);
		if (msg.includes('WorkflowExecutionAlreadyStarted') || msg.includes('AlreadyStarted')) {
			return json({ contentId: content.id, jobId, status: 'already-running' });
		}
		console.error(`Failed to start encoder workflow ${jobId}:`, error);
		return json({ error: 'Failed to start encoder workflow' }, { status: 500 });
	}
};
