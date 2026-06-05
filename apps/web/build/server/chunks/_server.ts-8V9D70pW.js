import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { c as cancelEncoderJob } from './encoder-orchestrator-CM-fqCvD.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/encoder/jobs/[mediaId]/cancel/+server.ts
/**
* POST /api/admin/encoder/jobs/[mediaId]/cancel
*
* System-health admin tool. Looks up the encoder job id from the media
* row, then asks the orchestrator to cancel it (gateway model). The
* worker tears down FFmpeg on its next /control poll and a `cancelled`
* progress webhook settles the row. We optimistically flip the local
* state to 'cancelled' so the dashboard reflects the action immediately.
*/
var POST = async ({ params, locals }) => {
	if (locals.user?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus
	}).from(mediaLibrary).where(eq(mediaLibrary.id, params.mediaId)).limit(1);
	if (!row) return json({ error: "Not found" }, { status: 404 });
	if (!row.encoderJobId) return json({ error: "No encoder job for this content" }, { status: 409 });
	if (["ready", "cancelled"].includes(row.processingStatus ?? "")) return json({ error: `Job is already ${row.processingStatus}` }, { status: 409 });
	try {
		await cancelEncoderJob(row.encoderJobId);
	} catch (err) {
		console.error(`[admin encoder cancel] orchestrator cancel failed for ${row.id}:`, err);
		return json({
			error: "Orchestrator cancel failed",
			detail: err instanceof Error ? err.message : "unknown"
		}, { status: 502 });
	}
	await db.update(mediaLibrary).set({
		processingStatus: "cancelled",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, row.id));
	return json({
		success: true,
		jobId: row.encoderJobId,
		status: "cancelling"
	});
};

export { POST };
//# sourceMappingURL=_server.ts-8V9D70pW.js.map
