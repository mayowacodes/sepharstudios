import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { b as createEncoderJob } from './encoder-orchestrator-CM-fqCvD.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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
			durationHint,
			mediaId: contentId
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

export { POST };
//# sourceMappingURL=_server.ts-GPJOCTUy.js.map
