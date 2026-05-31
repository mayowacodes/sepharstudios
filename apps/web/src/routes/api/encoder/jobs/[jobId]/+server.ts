import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { getEncoderJob } from '$lib/server/encoder-orchestrator';

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

	// The DB columns are the source of truth for the UI progress bar — they
	// are populated by either the webhook (push path) or the cron (pull
	// fallback). The orchestrator GET below is best-effort context.
	const base = {
		contentId: content.id,
		jobId,
		status: content.processingStatus,
		progress: content.processingProgress ?? 0,
		stage: content.processingStage,
		error: content.processingError
	};

	try {
		const orchestratorStatus = await getEncoderJob(jobId);
		return json({ ...base, orchestrator: orchestratorStatus });
	} catch (error) {
		// Orchestrator unreachable — degraded, but the DB-backed fields are
		// still valid so the UI can keep rendering.
		console.warn(`Encoder job ${jobId} orchestrator lookup failed; serving DB-only state:`, error);
		return json(base);
	}
};
