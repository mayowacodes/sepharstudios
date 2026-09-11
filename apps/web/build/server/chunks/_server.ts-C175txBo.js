import { d as db, m as mediaLibrary } from './drizzle-CsnNxG5m.js';
import { i as isValidInternalRequest } from './internal-auth-C5XULMjH.js';
import { j as json } from './index.js-BP8aAXBX.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'node:crypto';

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
//# sourceMappingURL=_server.ts-C175txBo.js.map
