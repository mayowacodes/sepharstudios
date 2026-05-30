import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { c as commitEncoderJob } from './encoder-orchestrator-BzB9cCAK.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

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

export { POST };
//# sourceMappingURL=_server.ts-BU-OybOC.js.map
