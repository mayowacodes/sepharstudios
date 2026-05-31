import { json, type RequestHandler } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db } from '$lib/db/drizzle';
import { mediaLibrary, contentSubtitleTracks } from '$lib/db/schema/sepharstudios';
import { and, eq } from 'drizzle-orm';
import { runContentScan } from '$lib/server/content-scan';

/**
 * POST /api/encoder/scan-ready
 *
 * Webhook from the orchestrator (gateway model). Fires ONCE after the
 * final `ready` progress webhook (§2 of the integration contract).
 * Delivers: subtitles[] (transcription + machine-translations),
 * thumbnails (poster + sprite VTT for scrubbing previews), sampled
 * frames, and basic clip info.
 *
 * Partial-payload tolerance: when the orchestrator's `SCAN_TIMEOUT_MINUTES`
 * trips, it still fires this webhook with whatever it has — `subtitles`
 * may be `[]`, `frames` may be `[]`, `thumbnails` may be missing. We treat
 * every field as best-effort and render/persist what's present.
 *
 * HMAC verified using ENCODER_WEBHOOK_SECRET (shared secret).
 */

function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
	if (!signature) return false;
	const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
	const a = Buffer.from(expected, 'hex');
	const b = Buffer.from(signature, 'hex');
	if (a.length !== b.length) return false;
	return timingSafeEqual(a, b);
}

interface SubtitleTrackPayload {
	language?: string;
	kind?: 'transcription' | 'translation';
	default?: boolean;
	vttUrl?: string;
	txtUrl?: string;
	durationSec?: number;
	wordCount?: number;
	quality?: {
		parseOk?: boolean;
		cueCount?: number;
		avgLogProb?: number;
		noSpeechRatio?: number;
		avgCompressionRatio?: number;
		wordRate?: number;
		suspectedHallucination?: boolean;
		machineTranslated?: boolean;
	};
}

interface ScanReadyBody {
	jobId?: string;
	mediaId?: string;
	subtitles?: SubtitleTrackPayload[];
	thumbnails?: {
		posterUrl?: string;
		spriteUrls?: string[];
		vttUrl?: string;
	};
	frames?: Array<{ index: number; timestampSec: number; url: string }>;
	audioAvailable?: boolean;
	videoDurationSec?: number;
	/** True when the orchestrator's scan-timeout fired with partial results. */
	partial?: boolean;
}

export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text();
	const secret = env.ENCODER_WEBHOOK_SECRET;
	if (secret) {
		const sig = request.headers.get('x-encoder-signature');
		if (!verifySignature(rawBody, sig, secret)) {
			return json({ error: 'Invalid signature' }, { status: 401 });
		}
	}

	let body: ScanReadyBody;
	try {
		body = JSON.parse(rawBody);
	} catch {
		return json({ error: 'Malformed JSON' }, { status: 400 });
	}

	if (!body.jobId) return json({ error: 'jobId is required' }, { status: 400 });

	// Resolve mediaId — orchestrator may know it (preferred) or we look it up.
	let mediaId = body.mediaId;
	let existingPoster: string | null | undefined;
	if (mediaId) {
		const [row] = await db.select({ id: mediaLibrary.id, posterUrl: mediaLibrary.posterUrl })
			.from(mediaLibrary)
			.where(eq(mediaLibrary.id, mediaId))
			.limit(1);
		mediaId = row?.id;
		existingPoster = row?.posterUrl;
	} else {
		const [row] = await db.select({ id: mediaLibrary.id, posterUrl: mediaLibrary.posterUrl })
			.from(mediaLibrary)
			.where(eq(mediaLibrary.encoderJobId, body.jobId))
			.limit(1);
		mediaId = row?.id;
		existingPoster = row?.posterUrl;
	}

	if (!mediaId) {
		// Unknown job/media — 200 so the orchestrator doesn't pile DLQ entries.
		return json({ ok: true, matched: false });
	}

	const subtitles = Array.isArray(body.subtitles) ? body.subtitles : [];
	const frames = Array.isArray(body.frames) ? body.frames : [];
	const thumbnails = body.thumbnails ?? {};
	const now = new Date();

	// Persist the scan report alongside player artifacts. We mirror
	// thumbnails.vtt + spriteUrls to dedicated columns so the watch page
	// doesn't have to dig into JSONB on every request.
	await db.update(mediaLibrary)
		.set({
			contentScanStatus: 'in_progress',
			contentScanReport: {
				subtitles: subtitles.map((s) => ({
					language: s.language ?? 'unknown',
					kind: s.kind ?? 'transcription',
					default: !!s.default,
					vttUrl: s.vttUrl,
					txtUrl: s.txtUrl,
					durationSec: s.durationSec,
					wordCount: s.wordCount,
					quality: s.quality
				})),
				thumbnails: {
					posterUrl: thumbnails.posterUrl,
					spriteUrls: Array.isArray(thumbnails.spriteUrls) ? thumbnails.spriteUrls : [],
					vttUrl: thumbnails.vttUrl
				},
				frames,
				audioAvailable: body.audioAvailable ?? subtitles.length > 0,
				videoDurationSec: body.videoDurationSec,
				partial: !!body.partial,
				startedAt: now.toISOString()
			},
			previewThumbnailsVtt: thumbnails.vttUrl ?? null,
			previewSpriteUrls: Array.isArray(thumbnails.spriteUrls) ? thumbnails.spriteUrls : [],
			// Auto-poster ONLY when the creator hasn't picked their own. Never
			// stomp a creator-picked poster.
			posterAutoUrl: thumbnails.posterUrl ?? null,
			...(thumbnails.posterUrl && !existingPoster ? { posterUrl: thumbnails.posterUrl } : {}),
			updatedAt: now
		})
		.where(eq(mediaLibrary.id, mediaId));

	// Attach each subtitle/translation track as a viewer-facing caption
	// row. The orchestrator's `kind` ('transcription'/'translation') maps
	// onto our viewer-facing `kind` field as 'subtitles' (both go in the
	// captions track list); the auto_generated flag distinguishes them
	// from any tracks the creator uploads manually.
	for (const track of subtitles) {
		if (!track.vttUrl || !track.language) continue;
		const lang = track.language.toLowerCase();
		// Clear any prior auto-generated track for this language so a
		// re-scan replaces it rather than duplicating.
		await db.delete(contentSubtitleTracks)
			.where(and(
				eq(contentSubtitleTracks.contentId, mediaId),
				eq(contentSubtitleTracks.autoGenerated, true),
				eq(contentSubtitleTracks.language, lang)
			));
		const machineFlag = track.quality?.machineTranslated ? ' · machine' : '';
		const labelSuffix = track.kind === 'translation' ? ` (auto translation${machineFlag})` : ' (auto)';
		await db.insert(contentSubtitleTracks).values({
			contentId: mediaId,
			kind: 'subtitles',
			language: lang,
			label: `${lang.toUpperCase()}${labelSuffix}`,
			fileUrl: track.vttUrl,
			isDefault: !!track.default,
			autoGenerated: true
		});
	}

	// Fire-and-forget the AI scan. The orchestrator's webhook returns
	// quickly — we don't want to make it wait on Whisper-sized AI calls.
	// Errors are caught and logged inside the runner.
	const id = mediaId;
	queueMicrotask(() => {
		void runContentScan(id).catch((err) => {
			console.error(`[scan-ready] runContentScan failed for ${id}:`, err);
		});
	});

	return json({ ok: true, mediaId, attached: subtitles.length, framesCount: frames.length });
};
