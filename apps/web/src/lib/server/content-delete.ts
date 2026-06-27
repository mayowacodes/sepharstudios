import { env } from '$env/dynamic/private';
import { db } from '$lib/db/drizzle';
import {
	mediaLibrary,
	ppvPurchases,
	quizSessions,
	bibleStoryProgress
} from '$lib/db/schema/sepharstudios';
import { eq, inArray } from 'drizzle-orm';
import { encoderMinioClient } from '$lib/server/minio';
import { cancelEncoderWorkflow } from '$lib/server/temporal-client';

/**
 * Permanently removes a media_library row + every dependent artifact.
 *
 * Difference from the soft-archive that lives on the existing DELETE
 * endpoints: that path just sets isActive=false + status='archived' and
 * leaves history. This function does the destructive equivalent of the
 * /api/creator/content/bulk?action=delete-permanent path BUT scoped to
 * one row, with two extras the bulk endpoint doesn't do today: it
 * cancels an in-flight Temporal encoder workflow first, and it cleans
 * up MinIO objects (encoder-input source, encoder-output HLS segments,
 * assets) after the DB delete commits.
 *
 * MinIO cleanup runs after the DB delete and is best-effort: log
 * failures, don't fail the API call. A user-facing "Deleted, cleaning
 * up storage in the background" toast is the contract.
 *
 * Returns a discriminated union — callers translate the `reason`
 * codes into HTTP responses.
 */

const INPUT_BUCKET = env.ENCODER_INPUT_BUCKET || env.MINIO_INPUT_BUCKET || 'encoder-input';
const OUTPUT_BUCKET = env.ENCODER_OUTPUT_BUCKET || env.MINIO_OUTPUT_BUCKET || 'encoder-output';
const PUBLIC_MINIO_URL = (env.PUBLIC_MINIO_URL ?? '').replace(/\/+$/, '');
const PUBLIC_ENCODER_MINIO_URL = (env.PUBLIC_ENCODER_MINIO_URL ?? '').replace(/\/+$/, '');

export type DeleteContentResult =
	| {
			ok: true;
			deleted: true;
			minio: { sourceRemoved: boolean; outputObjects: number; assetObjects: number };
	  }
	| { ok: false; reason: 'ppv_purchases_exist' | 'not_found' };

interface ContentRowSnapshot {
	encoderJobId: string | null;
	processingStatus: string | null;
	assets: Array<string | null>;
}

export async function permanentlyDeleteContent(
	contentId: string,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_actorId: string
): Promise<DeleteContentResult> {
	// 1. Fetch the row — we need encoderJobId for MinIO cleanup + every
	//    asset URL so we can remove them from object storage after the
	//    cascade.
	const [row] = await db
		.select({
			id: mediaLibrary.id,
			encoderJobId: mediaLibrary.encoderJobId,
			processingStatus: mediaLibrary.processingStatus,
			thumbnail: mediaLibrary.thumbnail,
			backdropUrl: mediaLibrary.backdropUrl,
			posterUrl: mediaLibrary.posterUrl,
			posterLandscapeUrl: mediaLibrary.posterLandscapeUrl,
			posterSquareUrl: mediaLibrary.posterSquareUrl,
			logoTitleUrl: mediaLibrary.logoTitleUrl,
			trailerUrl: mediaLibrary.trailerUrl
		})
		.from(mediaLibrary)
		.where(eq(mediaLibrary.id, contentId))
		.limit(1);

	if (!row) return { ok: false, reason: 'not_found' };

	// 2. Block when paid PPV purchases exist — same guard as the bulk
	//    endpoint. Viewers paid; voiding their access can't be a single
	//    button click. Archive remains available.
	const [purchase] = await db
		.select({ contentId: ppvPurchases.contentId })
		.from(ppvPurchases)
		.where(eq(ppvPurchases.contentId, contentId))
		.limit(1);
	if (purchase) return { ok: false, reason: 'ppv_purchases_exist' };

	// Snapshot what we'll need for MinIO cleanup AFTER the row is gone.
	const snapshot: ContentRowSnapshot = {
		encoderJobId: row.encoderJobId,
		processingStatus: row.processingStatus,
		assets: [
			row.thumbnail,
			row.backdropUrl,
			row.posterUrl,
			row.posterLandscapeUrl,
			row.posterSquareUrl,
			row.logoTitleUrl,
			row.trailerUrl
		]
	};

	// 3. Cancel an in-flight Temporal encoder workflow before we drop the
	//    row. Otherwise the workflow finishes and posts a `ready` webhook
	//    that 404s. Best-effort: workflow-not-found means it already
	//    finished or never ran.
	if (
		row.encoderJobId &&
		(row.processingStatus === 'created' || row.processingStatus === 'in_progress')
	) {
		try {
			await cancelEncoderWorkflow(row.encoderJobId);
		} catch (err) {
			console.warn(
				`[content-delete] cancelEncoderWorkflow(${row.encoderJobId}) failed; continuing with delete:`,
				err
			);
		}
	}

	// 4. NULL nullable refs that don't CASCADE, then drop the row. The
	//    rest (mediaWatchProgress, comingSoonSubscriptions, playlistItems,
	//    episodes, reviews, ppvContent, contentPricing,
	//    contentSubtitleTracks, contentThumbnailVariants) all CASCADE.
	//    Wrap in a transaction so a partial state can't survive.
	try {
		await db.transaction(async (tx) => {
			await tx
				.update(quizSessions)
				.set({ contentId: null })
				.where(eq(quizSessions.contentId, contentId));
			await tx
				.update(bibleStoryProgress)
				.set({ contentId: null })
				.where(eq(bibleStoryProgress.contentId, contentId));
			await tx.delete(mediaLibrary).where(eq(mediaLibrary.id, contentId));
		});
	} catch (err) {
		console.error('[content-delete] DB delete failed for', contentId, err);
		throw err;
	}

	// 5. MinIO cleanup — fire-and-forget. The user-facing response is
	//    "Deleted, cleaning up storage in the background"; failures here
	//    leak objects but don't roll back the (already committed) delete.
	const cleanupStats = { sourceRemoved: false, outputObjects: 0, assetObjects: 0 };
	void cleanupMinio(snapshot, cleanupStats).catch((err) => {
		console.warn(`[content-delete] MinIO cleanup partial failure for ${contentId}:`, err);
	});

	return {
		ok: true,
		deleted: true,
		// These counts reflect what we ATTEMPTED to clean, not what
		// fully succeeded (the cleanup is async). The caller treats
		// this as an optimistic acknowledgement, not a guarantee.
		minio: cleanupStats
	};
}

// ─── MinIO cleanup ────────────────────────────────────────────────────

async function cleanupMinio(snapshot: ContentRowSnapshot, stats: {
	sourceRemoved: boolean;
	outputObjects: number;
	assetObjects: number;
}): Promise<void> {
	const { encoderJobId, assets } = snapshot;

	// Encoder source + HLS output objects. Both buckets get a recursive
	// list + bulk remove keyed by the job prefix.
	if (encoderJobId) {
		try {
			const sourceKey = `${encoderJobId}/source`;
			await encoderMinioClient.removeObject(INPUT_BUCKET, sourceKey);
			stats.sourceRemoved = true;
		} catch (err) {
			console.warn(`[content-delete] removeObject failed for source ${encoderJobId}:`, err);
		}

		// Old key shape (legacy): YYYY/MM/DD/<jobId>/source.mp4 — try a
		// list + delete by prefix too so re-encodes from the date-style
		// path also get cleaned. Cheap when the prefix is empty.
		try {
			const outputCount = await removeAllUnderPrefix(OUTPUT_BUCKET, `${encoderJobId}/`);
			stats.outputObjects = outputCount;
		} catch (err) {
			console.warn(
				`[content-delete] removeAllUnderPrefix failed for ${OUTPUT_BUCKET}/${encoderJobId}/:`,
				err
			);
		}
	}

	// Asset objects — stored as full URLs on the row. Strip the public
	// host + bucket so we can call removeObject(bucket, key). Skip any
	// URL we can't parse (external CDN URLs, legacy placeholders).
	for (const assetUrl of assets) {
		if (!assetUrl) continue;
		const parsed = parseMinioObject(assetUrl);
		if (!parsed) continue;
		try {
			await encoderMinioClient.removeObject(parsed.bucket, parsed.key);
			stats.assetObjects += 1;
		} catch (err) {
			console.warn(`[content-delete] removeObject failed for asset ${assetUrl}:`, err);
		}
	}
}

async function removeAllUnderPrefix(bucket: string, prefix: string): Promise<number> {
	const objects: string[] = [];
	const stream = encoderMinioClient.listObjectsV2(bucket, prefix, true);
	await new Promise<void>((resolve, reject) => {
		stream.on('data', (obj: { name: string }) => {
			if (obj.name) objects.push(obj.name);
		});
		stream.on('end', () => resolve());
		stream.on('error', (err: Error) => reject(err));
	});
	if (objects.length === 0) return 0;
	await encoderMinioClient.removeObjects(bucket, objects);
	return objects.length;
}

function parseMinioObject(fullUrl: string): { bucket: string; key: string } | null {
	// Both hosts are stripped to the host portion only; the next path
	// segment is the bucket, the rest is the object key.
	const candidates = [PUBLIC_MINIO_URL, PUBLIC_ENCODER_MINIO_URL].filter(Boolean);
	for (const host of candidates) {
		if (fullUrl.startsWith(host + '/')) {
			const tail = fullUrl.slice(host.length + 1);
			const slash = tail.indexOf('/');
			if (slash > 0) {
				return { bucket: tail.slice(0, slash), key: tail.slice(slash + 1) };
			}
		}
	}
	// Last-chance fallback: try to parse `<scheme>://<host>/<bucket>/<key…>`
	try {
		const u = new URL(fullUrl);
		const parts = u.pathname.replace(/^\/+/, '').split('/');
		if (parts.length >= 2) {
			return { bucket: parts[0]!, key: parts.slice(1).join('/') };
		}
	} catch {
		// Not a URL — skip.
	}
	return null;
}
