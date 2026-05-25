import { p as private_env } from './shared-server-BeisX7n9.js';

const baseUrl = () => private_env.ORCHESTRATOR_BASE_URL || private_env.ENCODER_ORCHESTRATOR_URL;
const apiSecret = () => private_env.ORCHESTRATOR_API_SECRET || private_env.ENCODER_ORCHESTRATOR_API_SECRET;
function getConfig() {
  const url = baseUrl();
  const secret = apiSecret();
  if (!url || !secret) {
    throw new Error("Encoder orchestrator is not configured");
  }
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
  return orchestratorFetch("/v1/jobs", {
    method: "POST",
    body: JSON.stringify(body)
  });
}
async function commitEncoderJob(jobId) {
  return orchestratorFetch(`/v1/jobs/${encodeURIComponent(jobId)}/commit`, {
    method: "POST",
    body: "{}"
  });
}
async function getEncoderJob(jobId) {
  return orchestratorFetch(`/v1/jobs/${encodeURIComponent(jobId)}`, {
    method: "GET"
  });
}
async function getEncoderPlayback(jobId, ttlSeconds = 3600) {
  return orchestratorFetch(`/v1/jobs/${encodeURIComponent(jobId)}/playback`, {
    method: "POST",
    body: JSON.stringify({ ttlSeconds })
  });
}

export { commitEncoderJob as a, getEncoderPlayback as b, createEncoderJob as c, getEncoderJob as g };
//# sourceMappingURL=encoder-orchestrator-BjJh_NPv.js.map
