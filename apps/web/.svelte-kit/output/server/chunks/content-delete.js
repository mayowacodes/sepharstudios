import { t as private_env } from "./shared-server.js";
import { K as mediaLibrary, _ as bibleStoryProgress, at as ppvPurchases, ct as quizSessions, t as db } from "./drizzle.js";
import { n as encoderMinioClient } from "./minio2.js";
import { t as cancelEncoderWorkflow } from "./temporal-client.js";
import { eq } from "drizzle-orm";
//#region src/lib/server/content-delete.ts
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
var INPUT_BUCKET = private_env.ENCODER_INPUT_BUCKET || private_env.MINIO_INPUT_BUCKET || "encoder-input";
var OUTPUT_BUCKET = private_env.ENCODER_OUTPUT_BUCKET || private_env.MINIO_OUTPUT_BUCKET || "encoder-output";
var PUBLIC_MINIO_URL = (private_env.PUBLIC_MINIO_URL ?? "").replace(/\/+$/, "");
var PUBLIC_ENCODER_MINIO_URL = (private_env.PUBLIC_ENCODER_MINIO_URL ?? "").replace(/\/+$/, "");
async function permanentlyDeleteContent(contentId, _actorId) {
	const [row] = await db.select({
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
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	if (!row) return {
		ok: false,
		reason: "not_found"
	};
	const [purchase] = await db.select({ contentId: ppvPurchases.contentId }).from(ppvPurchases).where(eq(ppvPurchases.contentId, contentId)).limit(1);
	if (purchase) return {
		ok: false,
		reason: "ppv_purchases_exist"
	};
	const snapshot = {
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
	if (row.encoderJobId && (row.processingStatus === "created" || row.processingStatus === "in_progress")) try {
		await cancelEncoderWorkflow(row.encoderJobId);
	} catch (err) {
		console.warn(`[content-delete] cancelEncoderWorkflow(${row.encoderJobId}) failed; continuing with delete:`, err);
	}
	try {
		await db.transaction(async (tx) => {
			await tx.update(quizSessions).set({ contentId: null }).where(eq(quizSessions.contentId, contentId));
			await tx.update(bibleStoryProgress).set({ contentId: null }).where(eq(bibleStoryProgress.contentId, contentId));
			await tx.delete(mediaLibrary).where(eq(mediaLibrary.id, contentId));
		});
	} catch (err) {
		console.error("[content-delete] DB delete failed for", contentId, err);
		throw err;
	}
	const cleanupStats = {
		sourceRemoved: false,
		outputObjects: 0,
		assetObjects: 0
	};
	cleanupMinio(snapshot, cleanupStats).catch((err) => {
		console.warn(`[content-delete] MinIO cleanup partial failure for ${contentId}:`, err);
	});
	return {
		ok: true,
		deleted: true,
		minio: cleanupStats
	};
}
async function cleanupMinio(snapshot, stats) {
	const { encoderJobId, assets } = snapshot;
	if (encoderJobId) {
		try {
			const sourceKey = `${encoderJobId}/source`;
			await encoderMinioClient.removeObject(INPUT_BUCKET, sourceKey);
			stats.sourceRemoved = true;
		} catch (err) {
			console.warn(`[content-delete] removeObject failed for source ${encoderJobId}:`, err);
		}
		try {
			stats.outputObjects = await removeAllUnderPrefix(OUTPUT_BUCKET, `${encoderJobId}/`);
		} catch (err) {
			console.warn(`[content-delete] removeAllUnderPrefix failed for ${OUTPUT_BUCKET}/${encoderJobId}/:`, err);
		}
	}
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
async function removeAllUnderPrefix(bucket, prefix) {
	const objects = [];
	const stream = encoderMinioClient.listObjectsV2(bucket, prefix, true);
	await new Promise((resolve, reject) => {
		stream.on("data", (obj) => {
			if (obj.name) objects.push(obj.name);
		});
		stream.on("end", () => resolve());
		stream.on("error", (err) => reject(err));
	});
	if (objects.length === 0) return 0;
	await encoderMinioClient.removeObjects(bucket, objects);
	return objects.length;
}
function parseMinioObject(fullUrl) {
	const candidates = [PUBLIC_MINIO_URL, PUBLIC_ENCODER_MINIO_URL].filter(Boolean);
	for (const host of candidates) if (fullUrl.startsWith(host + "/")) {
		const tail = fullUrl.slice(host.length + 1);
		const slash = tail.indexOf("/");
		if (slash > 0) return {
			bucket: tail.slice(0, slash),
			key: tail.slice(slash + 1)
		};
	}
	try {
		const parts = new URL(fullUrl).pathname.replace(/^\/+/, "").split("/");
		if (parts.length >= 2) return {
			bucket: parts[0],
			key: parts.slice(1).join("/")
		};
	} catch {}
	return null;
}
//#endregion
export { permanentlyDeleteContent as t };
