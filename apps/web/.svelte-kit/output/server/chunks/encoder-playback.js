import { t as private_env } from "./shared-server.js";
//#region src/lib/server/encoder-playback.ts
/**
* Compose the public master-playlist URL for a completed encoder job.
*
* The platform webhook tells us when a job is ready but does NOT include
* the playback URL (per §1 of the integration contract — status/progress/
* stage only). The Temporal worker writes HLS to
* `${outputBucket}/${jobId}/master.m3u8`; this helper composes the public
* URL using the same rule the trailer pipeline already uses. The
* `encoder-output` bucket must have public-read for browsers to fetch
* the manifest (already in place — trailers are served from the same
* bucket).
*
* When a CDN is later put in front of MinIO, this is the one place to
* swap the base — everywhere else just reads `media_library.video_url`.
*/
function masterPlaylistUrl(jobId) {
	if (!jobId) throw new Error("masterPlaylistUrl: jobId is required");
	const bucket = private_env.ENCODER_OUTPUT_BUCKET || private_env.MINIO_OUTPUT_BUCKET || "encoder-output";
	const rawBase = (private_env.PUBLIC_ENCODER_MINIO_URL ?? "").trim();
	return `${rawBase ? `https://${rawBase.replace(/^https?:\/\//, "").replace(/\/+$/, "")}` : "https://encoder-s3.sepharstudios.com"}/${bucket}/${jobId}/master.m3u8`;
}
/**
* Pick the best playable URL for a media row.
*
* Order of preference:
*  1. Anything already persisted on `video_url` (handles legacy/static
*     uploads, live-recording finalizes, and rows the webhook already
*     populated on `ready`).
*  2. The deterministic MinIO master.m3u8 URL — but only if the row has
*     an `encoderJobId` AND processing has actually finished. We don't
*     return a URL for jobs still mid-encode; those would 404.
*
* Returns `null` if no playable URL is available yet.
*/
function resolvePlaybackUrl(row) {
	if (row.videoUrl && row.videoUrl.trim()) return row.videoUrl;
	if (row.encoderJobId && row.processingStatus === "ready") return masterPlaylistUrl(row.encoderJobId);
	return null;
}
//#endregion
export { resolvePlaybackUrl as n, masterPlaylistUrl as t };
