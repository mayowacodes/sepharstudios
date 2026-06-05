import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { d as getEncoderPlayback } from './encoder-orchestrator-CM-fqCvD.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { POST };
//# sourceMappingURL=_server.ts-Cqfr7Zyt.js.map
