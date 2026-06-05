import { env } from '$env/dynamic/private';

const baseUrl = () => env.ORCHESTRATOR_BASE_URL || env.ENCODER_ORCHESTRATOR_URL;
const apiSecret = () => env.ORCHESTRATOR_API_SECRET || env.ENCODER_ORCHESTRATOR_API_SECRET;

type JsonObject = Record<string, unknown>;

export interface CreateEncoderJobInput {
	filename: string;
	profile?: 'vod-480' | 'vod-multi' | 'vod-multi-2k' | 'vod-multi-4k';
	durationHint?: number;
	/**
	 * Optional media row id. When supplied, the orchestrator echoes it back
	 * on every webhook (progress + scan-ready), letting us route the
	 * webhook to the right row WITHOUT a jobId → mediaId lookup.
	 *
	 * Strongly recommended: pass the media_library.id so the webhook
	 * handlers can resolve in O(1).
	 */
	mediaId?: string;
}

export interface EncoderJobStatus {
	jobId: string;
	status: string;
	profile?: string;
	filename?: string;
	errorMessage?: string;
	durationActual?: number;
	completedAt?: string;
}

function getConfig() {
	const url = baseUrl();
	const secret = apiSecret();

	if (!url || !secret) {
		throw new Error('Encoder orchestrator is not configured');
	}

	return {
		url: url.replace(/\/+$/, ''),
		secret
	};
}

async function orchestratorFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
	const config = getConfig();
	const response = await fetch(`${config.url}${path}`, {
		...init,
		headers: {
			'x-api-key': config.secret,
			'Content-Type': 'application/json',
			...(init.headers ?? {})
		}
	});

	const text = await response.text();

	// Parse JSON with a guard. Previously this was a bare `JSON.parse(text)`,
	// which threw SyntaxError before the `!response.ok` branch could
	// surface a useful error — so any non-JSON failure (502 Bad Gateway
	// HTML from Traefik, plain-text "Bad Request" from the orchestrator,
	// etc.) reached callers as the cryptic `Unexpected identifier "Bad"`
	// instead of the actual status + body. Now we keep the parsed data
	// when it's valid JSON, fall back to the raw text otherwise, and
	// always include both the HTTP status and a short preview of the
	// response body in the thrown error so the caller log says what's
	// actually wrong.
	let data: JsonObject = {};
	let parseError: string | null = null;
	if (text) {
		try {
			data = JSON.parse(text) as JsonObject;
		} catch (e) {
			parseError = e instanceof Error ? e.message : String(e);
		}
	}

	if (!response.ok) {
		const message =
			typeof data?.message === 'string'
				? data.message
				: text
					? `Encoder orchestrator ${response.status}: ${text.slice(0, 200)}`
					: `Encoder orchestrator request failed with HTTP ${response.status}`;
		throw new Error(message);
	}

	// 2xx but body didn't parse as JSON — that's still an error (we asked
	// for JSON and got something else). Surface it instead of returning
	// an empty object and letting the caller silently misbehave.
	if (parseError) {
		throw new Error(
			`Encoder orchestrator returned HTTP ${response.status} with non-JSON body: ${text.slice(0, 200)} (parse error: ${parseError})`
		);
	}

	return data as T;
}

export async function createEncoderJob(input: CreateEncoderJobInput) {
	const body: JsonObject = {
		filename: input.filename,
		profile: input.profile ?? 'vod-multi'
	};

	if (input.durationHint) body.durationHint = input.durationHint;
	if (input.mediaId) body.mediaId = input.mediaId;

	return orchestratorFetch<{
		jobId: string;
		upload: { url: string; method: string; expiresAt: string };
	}>('/v1/jobs', {
		method: 'POST',
		body: JSON.stringify(body)
	});
}

/**
 * Cancel a running job. The orchestrator flips state → CANCELLED; the
 * worker learns on next /control poll, kills FFmpeg, and emits a
 * `cancelled` progress webhook back to us. The caller should optimistically
 * show "cancelling" until that webhook arrives.
 */
export async function cancelEncoderJob(jobId: string) {
	return orchestratorFetch<{ jobId: string; status: string }>(
		`/v1/jobs/${encodeURIComponent(jobId)}/cancel`,
		{ method: 'POST', body: '{}' }
	);
}

export async function commitEncoderJob(jobId: string) {
	return orchestratorFetch<{
		jobId: string;
		status: string;
		encoderJobId: string;
	}>(`/v1/jobs/${encodeURIComponent(jobId)}/commit`, {
		method: 'POST',
		body: '{}'
	});
}

export async function getEncoderJob(jobId: string) {
	return orchestratorFetch<EncoderJobStatus>(`/v1/jobs/${encodeURIComponent(jobId)}`, {
		method: 'GET'
	});
}

export async function getEncoderPlayback(jobId: string, ttlSeconds = 3600) {
	return orchestratorFetch<{
		jobId: string;
		playback: {
			master: string;
			renditions: Record<string, string>;
			expiresAt: string;
			drmReady: boolean;
		};
	}>(`/v1/jobs/${encodeURIComponent(jobId)}/playback`, {
		method: 'POST',
		body: JSON.stringify({ ttlSeconds })
	});
}

