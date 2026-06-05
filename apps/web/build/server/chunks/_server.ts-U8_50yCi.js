import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { i as isValidInternalRequest } from './internal-auth-DmxvxkdC.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'node:crypto';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/encoder/ready/+server.ts
var POST = async ({ request }) => {
	if (!isValidInternalRequest(request)) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId, jobId, playback, errorMessage } = await request.json();
	if (!jobId) return json({ error: "jobId is required" }, { status: 400 });
	if (errorMessage) {
		await db.update(mediaLibrary).set({
			processingStatus: "failed",
			processingError: String(errorMessage),
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.encoderJobId, jobId));
		return json({
			success: true,
			jobId,
			status: "failed"
		});
	}
	const where = contentId ? eq(mediaLibrary.id, contentId) : eq(mediaLibrary.encoderJobId, jobId);
	await db.update(mediaLibrary).set({
		processingStatus: "ready",
		processingError: null,
		processedAt: /* @__PURE__ */ new Date(),
		updatedAt: /* @__PURE__ */ new Date()
	}).where(where);
	return json({
		success: true,
		contentId,
		jobId,
		status: "ready"
	});
};

export { POST };
//# sourceMappingURL=_server.ts-U8_50yCi.js.map
