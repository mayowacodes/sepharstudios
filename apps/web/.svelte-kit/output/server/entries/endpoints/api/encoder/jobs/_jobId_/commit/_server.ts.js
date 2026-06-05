import { H as mediaLibrary, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as commitEncoderJob } from "../../../../../../../chunks/encoder-orchestrator.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/encoder/jobs/[jobId]/commit/+server.ts
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const jobId = params.jobId;
	if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId
	}).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, jobId)).limit(1);
	if (!content) return json({ error: "Content not found for job" }, { status: 404 });
	if (content.creatorId && content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
	try {
		const result = await commitEncoderJob(jobId);
		await db.update(mediaLibrary).set({
			processingStatus: "queued",
			processingError: null,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, content.id));
		return json({
			contentId: content.id,
			...result
		});
	} catch (error) {
		console.error(`Failed to commit encoder job ${jobId}:`, error);
		return json({ error: "Failed to commit encoder job" }, { status: 500 });
	}
};
//#endregion
export { POST };
