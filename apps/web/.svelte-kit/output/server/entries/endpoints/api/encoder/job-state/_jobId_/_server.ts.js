import { H as mediaLibrary, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/encoder/job-state/[jobId]/+server.ts
/**
* GET /api/encoder/job-state/[jobId]
*
* Called by the orchestrator at the start of each pipeline stage so it
* can honor cancellation initiated via /api/admin/encoder/jobs/[id]/cancel.
* See docs/encoder-orchestrator-spec.md §2.6.
*
* Returns:
*   { status: 'cancelled' } — orchestrator should abort the job
*   { status: 'active' }    — keep going
*/
var GET = async ({ params }) => {
	const [row] = await db.select({ processingStatus: mediaLibrary.processingStatus }).from(mediaLibrary).where(eq(mediaLibrary.encoderJobId, params.jobId)).limit(1);
	if (!row) return json({ status: "active" });
	if (row.processingStatus === "cancelled") return json({ status: "cancelled" });
	return json({ status: "active" });
};
//#endregion
export { GET };
