import { j as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { n as createEncoderJob } from "../../../../../chunks/encoder-orchestrator.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/encoder/jobs/+server.ts
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId, filename, profile = "vod-multi", durationHint } = await request.json();
	if (!contentId || !filename) return json({ error: "contentId and filename are required" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!content) return json({ error: "Content not found" }, { status: 404 });
	if (content.creatorId && content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	try {
		const encoderJob = await createEncoderJob({
			filename,
			profile,
			durationHint
		});
		await db.update(mediaLibrary).set({
			encoderJobId: encoderJob.jobId,
			processingStatus: "created",
			processingError: null,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, contentId));
		return json({
			contentId,
			jobId: encoderJob.jobId,
			upload: encoderJob.upload
		}, { status: 201 });
	} catch (error) {
		console.error("Failed to create encoder job:", error);
		return json({ error: "Failed to create encoder job" }, { status: 500 });
	}
};
//#endregion
export { POST };
