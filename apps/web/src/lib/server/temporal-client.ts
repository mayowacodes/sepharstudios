import { env } from '$env/dynamic/private';
import { Client, Connection, type WorkflowHandle } from '@temporalio/client';

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

const TEMPORAL_ADDRESS = env.TEMPORAL_ADDRESS;
const TEMPORAL_NAMESPACE = env.TEMPORAL_NAMESPACE ?? 'default';
const TEMPORAL_TASK_QUEUE = env.TEMPORAL_TASK_QUEUE ?? 'encoder';
const WORKFLOW_TYPE = 'encodeMediaWorkflow';
const TRAILER_WORKFLOW_TYPE = 'encodeTrailerWorkflow';

let cachedClient: Promise<Client> | null = null;

function getClient(): Promise<Client> {
	if (!TEMPORAL_ADDRESS) {
		throw new Error(
			'Temporal client is not configured — set TEMPORAL_ADDRESS to enable routing to the Temporal pipeline.'
		);
	}
	if (!cachedClient) {
		cachedClient = (async () => {
			const connection = await Connection.connect({ address: TEMPORAL_ADDRESS });
			return new Client({ connection, namespace: TEMPORAL_NAMESPACE });
		})();
	}
	return cachedClient;
}

export interface StartEncoderWorkflowInput {
	/** Stable id; reused as the workflowId so a duplicate submit is rejected by Temporal. */
	jobId: string;
	mediaId?: string;
	inputBucket: string;
	inputObject: string;
	outputBucket: string;
	outputPrefix?: string;
	profile?: 'vod-480' | 'vod-multi' | 'vod-multi-2k' | 'vod-multi-4k';
	durationHintSec?: number;
}

export interface StartEncoderWorkflowResult {
	workflowId: string;
	runId: string;
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
export async function startEncoderWorkflow(
	input: StartEncoderWorkflowInput
): Promise<StartEncoderWorkflowResult> {
	const client = await getClient();
	const handle = await client.workflow.start(WORKFLOW_TYPE, {
		workflowId: input.jobId,
		taskQueue: TEMPORAL_TASK_QUEUE,
		args: [input],
		// 24h workflow execution timeout — well above the longest encode
		// we'd ever expect; catches a stuck workflow without prematurely
		// failing legit long-running ones.
		workflowExecutionTimeout: '24 hours',
		searchAttributes: input.mediaId ? { mediaId: [input.mediaId] } : undefined
	});
	return { workflowId: handle.workflowId, runId: (await handle.describe()).runId };
}

// ── Robust trailer pipeline ─────────────────────────────────────────────────

export interface StartTrailerWorkflowInput {
	contentId: string;
	bucket: string;
	objectKey: string;
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
export async function startTrailerWorkflow(
	input: StartTrailerWorkflowInput
): Promise<{ workflowId: string }> {
	const client = await getClient();
	// Deterministic id so a re-delivery of /trailer-upload/commit
	// doesn't double-spawn. The objectKey already encodes a timestamp,
	// so it's unique per upload.
	const workflowId = `trailer_${input.contentId}_${input.objectKey.replace(/[^a-zA-Z0-9_-]/g, '_').slice(-60)}`;
	try {
		const handle = await client.workflow.start(TRAILER_WORKFLOW_TYPE, {
			workflowId,
			taskQueue: TEMPORAL_TASK_QUEUE,
			args: [input],
			workflowExecutionTimeout: '1 hour'
		});
		return { workflowId: handle.workflowId };
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		if (msg.includes('WorkflowExecutionAlreadyStarted') || msg.includes('AlreadyStarted')) {
			return { workflowId };
		}
		throw err;
	}
}

/**
 * Cancel a running encoder workflow. Returns whether the workflow was
 * found at all — caller can return 200 either way (cancelling an already-
 * terminal workflow is harmless).
 */
export async function cancelEncoderWorkflow(workflowId: string): Promise<{ found: boolean }> {
	const client = await getClient();
	try {
		const handle: WorkflowHandle = client.workflow.getHandle(workflowId);
		await handle.cancel();
		return { found: true };
	} catch (err) {
		if (err instanceof Error && err.message.includes('NotFound')) {
			return { found: false };
		}
		throw err;
	}
}

/**
 * Feature-flag check — does this submission route through the new
 * Temporal pipeline?
 *
 * `TEMPORAL_ROUTING_PERCENT` is 0–100 (default 0 — legacy stays the
 * default until the flag is explicitly set in Dokploy env). The seed
 * (mediaId or jobId) makes the choice deterministic per job — a retry
 * of the same job picks the same backend, so we never accidentally
 * split a single submit across both pipelines.
 *
 * When percent is 0 → never Temporal. When percent is 100 → always
 * Temporal. In between, the hash of the seed mod 100 < percent.
 */
export function isTemporalRouted(seed: string): boolean {
	const raw = env.TEMPORAL_ROUTING_PERCENT ?? '0';
	const percent = Math.max(0, Math.min(100, Number.parseInt(raw, 10) || 0));
	if (percent <= 0) return false;
	if (percent >= 100) return true;
	// Cheap deterministic hash — sum of char codes mod 100.
	let acc = 0;
	for (let i = 0; i < seed.length; i++) acc = (acc + seed.charCodeAt(i)) % 1000;
	return acc % 100 < percent;
}
