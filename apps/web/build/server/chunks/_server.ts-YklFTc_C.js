import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { R as Role } from './constants-BEpeHz1K.js';
import { c as cancelEncoderJob } from './encoder-orchestrator-CM-fqCvD.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './ui-libs-BjzLDLAh.js';
import './file-text-C_v9vOk2.js';
import './Icon-CM89Lxh4.js';
import './house-B7XjrWsP.js';
import './layout-dashboard-PdpePzL-.js';
import './user-DvE0JuLE.js';
import './users-B-WaIXgI.js';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/admin/content/[id]/cancel-encode/+server.ts
/**
* POST /api/admin/content/[id]/cancel-encode
*
* Admin cancels an in-flight encode. We call the orchestrator's cancel
* endpoint (gateway model — only the platform talks to the orchestrator);
* it flips state to CANCELLED and the worker tears down FFmpeg on its next
* /control poll. A `cancelled` progress webhook then arrives here and
* settles the row.
*
* We optimistically mark `processingStatus='cancelled'` immediately so
* the UI doesn't spin while the worker poll round-trip plays out, BUT we
* preserve the existing encoderJobId so the webhook can still match.
*/
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if (session.user.role !== Role.ADMIN) return json({ error: "Forbidden" }, { status: 403 });
	const contentId = params.id;
	if (!contentId) return json({ error: "contentId is required" }, { status: 400 });
	const [row] = await db.select({
		id: mediaLibrary.id,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!row) return json({ error: "Content not found" }, { status: 404 });
	if (!row.encoderJobId) return json({ error: "No active encoder job for this content" }, { status: 409 });
	if (["ready", "cancelled"].includes(row.processingStatus ?? "")) return json({ error: `Job is already ${row.processingStatus}` }, { status: 409 });
	try {
		await cancelEncoderJob(row.encoderJobId);
	} catch (err) {
		console.error(`[admin cancel-encode] orchestrator cancel failed for ${contentId}:`, err);
		return json({
			error: "Orchestrator cancel failed",
			detail: err instanceof Error ? err.message : "unknown"
		}, { status: 502 });
	}
	await db.update(mediaLibrary).set({
		processingStatus: "cancelled",
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, contentId));
	return json({
		ok: true,
		jobId: row.encoderJobId,
		status: "cancelling"
	});
};

export { POST };
//# sourceMappingURL=_server.ts-YklFTc_C.js.map
