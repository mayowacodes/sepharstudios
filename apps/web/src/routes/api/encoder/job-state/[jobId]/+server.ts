import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { mediaLibrary } from '$lib/db/schema/sepharstudios';
import { eq } from 'drizzle-orm';

/**
 * GET /api/encoder/job-state/[jobId]
 *
 * Called by the orchestrator at the start of each pipeline stage so it
 * can honor cancellation initiated via /api/admin/encoder/jobs/[id]/cancel.
 * See docs/encoder-orchestrator-spec.md §2.6.
 *
 * Returns:
 *   { status: 'cancelled' } — orchestrator should abort the job
 *   { status: 'active' }    — keep going
 */

export const GET: RequestHandler = async ({ params }) => {
	const [row] = await db.select({ processingStatus: mediaLibrary.processingStatus })
		.from(mediaLibrary)
		.where(eq(mediaLibrary.encoderJobId, params.jobId!))
		.limit(1);
	if (!row) return json({ status: 'active' });
	if (row.processingStatus === 'cancelled') return json({ status: 'cancelled' });
	return json({ status: 'active' });
};
