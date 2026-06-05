import { p as private_env } from './shared-server-DUDL94jl.js';

//#region src/lib/server/encoder-orchestrator.ts
var baseUrl = () => private_env.ORCHESTRATOR_BASE_URL || private_env.ENCODER_ORCHESTRATOR_URL;
var apiSecret = () => private_env.ORCHESTRATOR_API_SECRET || private_env.ENCODER_ORCHESTRATOR_API_SECRET;
function getConfig() {
	const url = baseUrl();
	const secret = apiSecret();
	if (!url || !secret) throw new Error("Encoder orchestrator is not configured");
	return {
		url: url.replace(/\/+$/, ""),
		secret
	};
}
async function orchestratorFetch(path, init = {}) {
	const config = getConfig();
	const response = await fetch(`${config.url}${path}`, {
		...init,
		headers: {
			"x-api-key": config.secret,
			"Content-Type": "application/json",
			...init.headers ?? {}
		}
	});
	const text = await response.text();
	const data = text ? JSON.parse(text) : {};
	if (!response.ok) {
		const message = typeof data?.message === "string" ? data.message : "Encoder orchestrator request failed";
		throw new Error(message);
	}
	return data;
}
async function createEncoderJob(input) {
	const body = {
		filename: input.filename,
		profile: input.profile ?? "vod-multi"
	};
	if (input.durationHint) body.durationHint = input.durationHint;
	if (input.mediaId) body.mediaId = input.mediaId;
	return orchestratorFetch("/v1/jobs", {
		method: "POST",
		body: JSON.stringify(body)
	});
}
/**
* Cancel a running job. The orchestrator flips state → CANCELLED; the
* worker learns on next /control poll, kills FFmpeg, and emits a
* `cancelled` progress webhook back to us. The caller should optimistically
* show "cancelling" until that webhook arrives.
*/
async function cancelEncoderJob(jobId) {
	return orchestratorFetch(`/v1/jobs/${encodeURIComponent(jobId)}/cancel`, {
		method: "POST",
		body: "{}"
	});
}
async function commitEncoderJob(jobId) {
	return orchestratorFetch(`/v1/jobs/${encodeURIComponent(jobId)}/commit`, {
		method: "POST",
		body: "{}"
	});
}
async function getEncoderJob(jobId) {
	return orchestratorFetch(`/v1/jobs/${encodeURIComponent(jobId)}`, { method: "GET" });
}
async function getEncoderPlayback(jobId, ttlSeconds = 3600) {
	return orchestratorFetch(`/v1/jobs/${encodeURIComponent(jobId)}/playback`, {
		method: "POST",
		body: JSON.stringify({ ttlSeconds })
	});
}

export { commitEncoderJob as a, createEncoderJob as b, cancelEncoderJob as c, getEncoderPlayback as d, getEncoderJob as g };
//# sourceMappingURL=encoder-orchestrator-CM-fqCvD.js.map
