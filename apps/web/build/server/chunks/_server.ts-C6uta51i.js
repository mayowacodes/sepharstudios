import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { g as getEncoderJob } from './encoder-orchestrator-CM-fqCvD.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/encoder/jobs/[jobId]/+server.ts
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const jobId = params.jobId;
	if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
	const [content] = await db.select({
		id: mediaLibrary.id,
		creatorId: mediaLibrary.creatorId,
		processingStatus: mediaLibrary.processingStatus,
		processingProgress: mediaLibrary.processingProgress,
		processingStage: mediaLibrary.processingStage,
		processingError: mediaLibrary.processingError
	}).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, jobId)).limit(1);
	if (!content) return json({ error: "Content not found for job" }, { status: 404 });
	if (content.creatorId && content.creatorId !== session.user.id) return json({ error: "Forbidden" }, { status: 403 });
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
		return json({
			...base,
			orchestrator: orchestratorStatus
		});
	} catch (error) {
		console.warn(`Encoder job ${jobId} orchestrator lookup failed; serving DB-only state:`, error);
		return json(base);
	}
};

export { GET };
//# sourceMappingURL=_server.ts-C6uta51i.js.map
