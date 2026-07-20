import { K as mediaLibrary, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as resolvePlaybackUrl } from "../../../../../../../chunks/encoder-playback.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/encoder/jobs/[jobId]/playback/+server.ts
/**
* POST /api/encoder/jobs/[jobId]/playback
*
* Returns the master.m3u8 URL for a completed encoder job.
*
* Old behaviour signed Bunny-CDN URLs via the orchestrator. With Temporal
* we compose the public encoder-MinIO URL directly through
* `resolvePlaybackUrl` — same helper the watch route uses. The TTL
* argument is kept on the request shape for callers that still pass it,
* but it's a no-op (we serve a stable URL).
*/
var POST = async ({ params, locals }) => {
	if (!await locals.auth.getSession()) return json({ error: "Unauthorized" }, { status: 401 });
	const jobId = params.jobId;
	if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		isActive: mediaLibrary.isActive,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus
	}).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, jobId)).limit(1);
	if (!content || !content.isActive) return json({ error: "Content is not available" }, { status: 404 });
	const url = resolvePlaybackUrl({
		videoUrl: content.videoUrl,
		encoderJobId: content.encoderJobId,
		processingStatus: content.processingStatus
	});
	if (!url) return json({ error: "Playback is not ready yet" }, { status: 409 });
	return json({
		contentId: content.id,
		jobId,
		playback: {
			master: url,
			renditions: {},
			expiresAt: null,
			drmReady: false
		}
	});
};
//#endregion
export { POST };
