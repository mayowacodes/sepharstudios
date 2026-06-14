import { env } from '$env/dynamic/private';

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
export function masterPlaylistUrl(jobId: string): string {
	if (!jobId) throw new Error('masterPlaylistUrl: jobId is required');

	const bucket = env.ENCODER_OUTPUT_BUCKET || env.MINIO_OUTPUT_BUCKET || 'encoder-output';

	// Same composition rule as the trailer commit endpoint — kept in sync
	// so a future hostname change (e.g. moving to a CDN) is a one-line edit.
	//
	// Critical: do NOT fall back to MINIO_PUBLIC_ENDPOINT. That points at the
	// MAIN MinIO (`s3.sepharstudios.com`), which doesn't have the
	// `encoder-output` bucket — wrong URLs were silently written here when
	// PUBLIC_ENCODER_MINIO_URL was unset, and every playback 403'd. Only
	// PUBLIC_ENCODER_MINIO_URL is correct; absence falls through to the
	// hardcoded production hostname.
	const rawBase = (env.PUBLIC_ENCODER_MINIO_URL ?? '').trim();
	const base = rawBase
		? `https://${rawBase.replace(/^https?:\/\//, '').replace(/\/+$/, '')}`
		: 'https://encoder-s3.sepharstudios.com';

	return `${base}/${bucket}/${jobId}/master.m3u8`;
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
export function resolvePlaybackUrl(row: {
	videoUrl?: string | null;
	encoderJobId?: string | null;
	processingStatus?: string | null;
}): string | null {
	if (row.videoUrl && row.videoUrl.trim()) return row.videoUrl;
	if (row.encoderJobId && row.processingStatus === 'ready') {
		return masterPlaylistUrl(row.encoderJobId);
	}
	return null;
}
