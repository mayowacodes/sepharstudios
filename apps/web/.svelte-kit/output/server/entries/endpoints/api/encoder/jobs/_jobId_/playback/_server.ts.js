import { j as mediaLibrary, t as db } from "../../../../../../../chunks/drizzle.js";
import { i as getEncoderPlayback } from "../../../../../../../chunks/encoder-orchestrator.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/encoder/jobs/[jobId]/playback/+server.ts
var POST = async ({ params, request, locals }) => {
	if (!await locals.auth.getSession()) return json({ error: "Unauthorized" }, { status: 401 });
	const jobId = params.jobId;
	if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		isActive: mediaLibrary.isActive
	}).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, jobId)).limit(1);
	if (!content || !content.isActive) return json({ error: "Content is not available" }, { status: 404 });
	const body = await request.json().catch(() => ({}));
	const ttlSeconds = Number(body.ttlSeconds || 3600);
	try {
		const playback = await getEncoderPlayback(jobId, ttlSeconds);
		return json({
			contentId: content.id,
			...playback
		});
	} catch (error) {
		console.error(`Failed to create playback URL for encoder job ${jobId}:`, error);
		return json({ error: "Failed to create playback URL" }, { status: 500 });
	}
};
//#endregion
export { POST };
