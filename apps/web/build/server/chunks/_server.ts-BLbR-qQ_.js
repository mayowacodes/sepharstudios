import { d as db, m as mediaLibrary } from './drizzle-C3SH12nS.js';
import { c as cancelEncoderWorkflow } from './temporal-client-CCJst5v8.js';
import { R as Role } from './constants-BiiFHz9b.js';
import { j as json } from './index.js-CxPEndTa.js';
import { eq } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import '@temporalio/client';
import './file-text-By5QqCz6.js';
import './Icon-Bw1rnKTC.js';
import './house-6lS0tROn.js';
import './layout-dashboard-B2Dnc05Q.js';
import './user-DfNTMTjp.js';
import './users-BHfWNfsK.js';

//#region src/routes/api/admin/content/[id]/cancel-encode/+server.ts
/**
* POST /api/admin/content/[id]/cancel-encode
*
* Admin cancels an in-flight encode. The workflowId IS the encoderJobId
* (we set it explicitly when starting the workflow at /commit), so
* cancellation is direct.
*
* Temporal raises CancelledFailure inside the running workflow. The
* encode-hls activity wires that to ffmpeg SIGTERM (see the
* `ctx.cancellationSignal` handler in encode-hls.activity.ts), so the
* worker tears down cleanly. The workflow then emits a `cancelled`
* progress webhook which settles `processing_status` on this row.
*
* We optimistically set 'cancelled' here so the UI doesn't spin while the
* webhook round-trip plays out.
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
		await cancelEncoderWorkflow(row.encoderJobId);
	} catch (err) {
		console.error(`[admin cancel-encode] Temporal cancel failed for ${contentId}:`, err);
		return json({
			error: "Temporal cancel failed",
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
//# sourceMappingURL=_server.ts-BLbR-qQ_.js.map
