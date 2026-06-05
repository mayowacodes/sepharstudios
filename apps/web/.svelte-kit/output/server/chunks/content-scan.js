import { H as mediaLibrary, t as db } from "./drizzle.js";
import { n as notifyAdmins } from "./notify.js";
import { n as tryParseJson, t as runAi } from "./ai.js";
import { eq } from "drizzle-orm";
//#region src/lib/server/content-scan.ts
/**
* R+5 — Pre-publish content scan runner.
*
* Triggered by /api/encoder/scan-ready when the orchestrator finishes
* producing transcript + frame samples. We:
*   1. Download transcript.txt
*   2. Feed it (with content metadata) to the AI for theology +
*      family-safe evaluation
*   3. Persist the verdict to media_library.content_scan_report
*   4. Flip content_scan_status → 'complete'
*   5. Notify admins to review
*/
var TRANSCRIPT_MAX_CHARS = 12e3;
/**
* Run the AI scan for one content row. Idempotent: safe to re-run on the
* same row (overwrites the AI verdict; preserves the artifact URLs).
*/
async function runContentScan(mediaId) {
	const [row] = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		description: mediaLibrary.description,
		mediaType: mediaLibrary.mediaType,
		genres: mediaLibrary.genres,
		topics: mediaLibrary.topics,
		bibleReference: mediaLibrary.bibleReference,
		ageRating: mediaLibrary.ageRating,
		creatorId: mediaLibrary.creatorId,
		contentScanReport: mediaLibrary.contentScanReport
	}).from(mediaLibrary).where(eq(mediaLibrary.id, mediaId)).limit(1);
	if (!row || !row.contentScanReport) {
		console.warn(`[content-scan] ${mediaId} has no scan report; skipping`);
		return;
	}
	let transcript = "";
	let txtUrl;
	const subs = row.contentScanReport.subtitles;
	if (Array.isArray(subs) && subs.length > 0) txtUrl = (subs.find((s) => s.default) ?? subs[0])?.txtUrl;
	if (!txtUrl) txtUrl = row.contentScanReport.transcript?.txtUrl;
	if (txtUrl) try {
		const res = await fetch(txtUrl, { signal: AbortSignal.timeout(2e4) });
		if (res.ok) transcript = (await res.text()).slice(0, TRANSCRIPT_MAX_CHARS);
	} catch (err) {
		console.warn(`[content-scan] ${mediaId} transcript fetch failed:`, err);
	}
	const result = await runAi({
		userId: null,
		surface: "content-scan",
		modelType: "agent",
		temperature: .1,
		maxTokens: 768,
		messages: [{
			role: "system",
			content: "You evaluate content on a Christian streaming platform for doctrinal alignment + family safety. The transcript is the actual content (not just the creator-supplied description). Be precise and charitable."
		}, {
			role: "user",
			content: `Evaluate this content.

Title: "${row.title}"
Type: ${row.mediaType}
Genres: ${(row.genres ?? []).join(", ")}
Topics: ${(row.topics ?? []).join(", ")}
Bible reference (creator): ${row.bibleReference ?? "—"}
Description: """${(row.description ?? "").slice(0, 800)}"""

Transcript excerpt (first ${TRANSCRIPT_MAX_CHARS} chars):
"""${transcript || "(no transcript available — evaluate from metadata only)"}"""

Return ONLY this JSON:
{
  "verdict": "approve | flag | reject",
  "theologyScore": 0-10,
  "familySafeScore": 0-10,
  "recommendedAgeRating": "All | 7+ | 13+ | 16+ | 18+",
  "flags": ["short reasons"],
  "reason": "1-2 sentence overall verdict",
  "transcriptExcerpts": [
    { "text": "quoted line", "reason": "why this matters" }
  ]
}

Verdict guide:
- approve: aligned with historical Christian doctrine, family-safe within stated age rating
- flag: needs human review (borderline, mismatch between metadata and content, mild concerns)
- reject: clearly contradicts core doctrine OR contains material unsuited to a family-safe platform

Score guide:
- theologyScore 10 = clearly aligned; 5 = ambiguous; 0 = directly contradicts core doctrine
- familySafeScore 10 = all ages; 5 = needs age gate; 0 = inappropriate at any rating

Pull up to 5 short transcriptExcerpts that the admin should specifically read.`
		}]
	});
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const baseReport = row.contentScanReport;
	if (!result.ok) {
		await db.update(mediaLibrary).set({
			contentScanStatus: "failed",
			contentScanReport: {
				...baseReport,
				completedAt: now,
				aiVerdict: void 0
			},
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, mediaId));
		console.warn(`[content-scan] ${mediaId} AI run failed: ${result.message}`);
		return;
	}
	const verdict = tryParseJson(result.content);
	if (!verdict) {
		await db.update(mediaLibrary).set({
			contentScanStatus: "failed",
			contentScanReport: {
				...baseReport,
				completedAt: now
			},
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaLibrary.id, mediaId));
		console.warn(`[content-scan] ${mediaId} AI returned unparseable JSON`);
		return;
	}
	await db.update(mediaLibrary).set({
		contentScanStatus: "complete",
		contentScanReport: {
			...baseReport,
			aiVerdict: verdict,
			completedAt: now
		},
		updatedAt: /* @__PURE__ */ new Date()
	}).where(eq(mediaLibrary.id, mediaId));
	if (verdict.verdict === "flag" || verdict.verdict === "reject") await notifyAdmins({
		kind: "system",
		title: verdict.verdict === "reject" ? `Scan rejected: "${row.title.slice(0, 50)}"` : `Scan flagged: "${row.title.slice(0, 50)}"`,
		message: verdict.reason.slice(0, 180),
		actionUrl: `/admin/review/${row.id}`
	}).catch((err) => console.warn(`[content-scan] ${mediaId} admin notification failed:`, err));
}
//#endregion
export { runContentScan as t };
