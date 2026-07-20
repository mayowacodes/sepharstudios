import { t as private_env } from "./shared-server.js";
import { Client, Connection } from "@temporalio/client";
//#region src/lib/server/temporal-client.ts
/**
* SvelteKit-side Temporal client (Phase A.2 of the encoder migration).
*
* Two public entry points:
*   - `startEncoderWorkflow` — kicks off the encodeMediaWorkflow on the
*     Temporal cluster. Used by the encoder-job submit endpoint when the
*     feature flag routes a job to Temporal instead of the legacy
*     orchestrator.
*   - `cancelEncoderWorkflow` — cancels a running workflow. Used by the
*     admin cancel endpoint.
*
* Routing: see `isTemporalRouted` below. Phase A.3 will gradually ramp
* `TEMPORAL_ROUTING_PERCENT` from 0 → 100 as the new pipeline soaks in
* production. While the percent is below 100, the legacy orchestrator
* path keeps running for the rest.
*
* Connection is lazy + cached. The Temporal SDK reuses HTTP/2 streams,
* so one connection per process is correct.
*
* Workflow type name + task queue MUST stay in sync with what the
* temporal-encoder/worker package registers. See
* temporal-encoder/worker/src/worker.ts in the encoder repo.
*/
var TEMPORAL_ADDRESS = private_env.TEMPORAL_ADDRESS;
var TEMPORAL_NAMESPACE = private_env.TEMPORAL_NAMESPACE ?? "default";
var TEMPORAL_TASK_QUEUE = private_env.TEMPORAL_TASK_QUEUE ?? "encoder";
var WORKFLOW_TYPE = "encodeMediaWorkflow";
var TRAILER_WORKFLOW_TYPE = "encodeTrailerWorkflow";
var cachedClient = null;
function getClient() {
	if (!TEMPORAL_ADDRESS) throw new Error("Temporal client is not configured — set TEMPORAL_ADDRESS to enable routing to the Temporal pipeline.");
	if (!cachedClient) cachedClient = (async () => {
		return new Client({
			connection: await Connection.connect({ address: TEMPORAL_ADDRESS }),
			namespace: TEMPORAL_NAMESPACE
		});
	})();
	return cachedClient;
}
/**
* Start the encodeMediaWorkflow. Returns workflowId + runId for storage on
* the media row so the cancel/status endpoints can address the workflow
* later.
*
* Idempotency: passing the same `jobId` twice raises
* `WorkflowExecutionAlreadyStartedError`. We surface that as a soft
* success — the caller already has a workflow in flight for this job.
*/
async function startEncoderWorkflow(input) {
	const handle = await (await getClient()).workflow.start(WORKFLOW_TYPE, {
		workflowId: input.jobId,
		taskQueue: TEMPORAL_TASK_QUEUE,
		args: [input],
		workflowExecutionTimeout: "24 hours",
		searchAttributes: input.mediaId ? { mediaId: [input.mediaId] } : void 0
	});
	return {
		workflowId: handle.workflowId,
		runId: (await handle.describe()).runId
	};
}
/**
* Start the encodeTrailerWorkflow. Re-encodes a freshly-uploaded trailer
* to a browser-safe H.264/yuv420p MP4 in the background so audio-only
* playback (HEVC/AV1/10-bit sources) stops happening.
*
* Idempotency: workflowId is derived from contentId + objectKey, so a
* duplicate commit can't spawn two parallel re-encodes against the same
* file. AlreadyStarted is surfaced as a soft success — the workflow in
* flight will finish whichever caller triggered first.
*/
async function startTrailerWorkflow(input) {
	const client = await getClient();
	const workflowId = `trailer_${input.contentId}_${input.objectKey.replace(/[^a-zA-Z0-9_-]/g, "_").slice(-60)}`;
	try {
		return { workflowId: (await client.workflow.start(TRAILER_WORKFLOW_TYPE, {
			workflowId,
			taskQueue: TEMPORAL_TASK_QUEUE,
			args: [input],
			workflowExecutionTimeout: "1 hour"
		})).workflowId };
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.includes("WorkflowExecutionAlreadyStarted") || msg.includes("AlreadyStarted")) return { workflowId };
		throw err;
	}
}
/**
* Cancel a running encoder workflow. Returns whether the workflow was
* found at all — caller can return 200 either way (cancelling an already-
* terminal workflow is harmless).
*/
async function cancelEncoderWorkflow(workflowId) {
	const client = await getClient();
	try {
		await client.workflow.getHandle(workflowId).cancel();
		return { found: true };
	} catch (err) {
		if (err instanceof Error && err.message.includes("NotFound")) return { found: false };
		throw err;
	}
}
//#endregion
export { startEncoderWorkflow as n, startTrailerWorkflow as r, cancelEncoderWorkflow as t };
