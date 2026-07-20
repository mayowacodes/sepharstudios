import { K as mediaLibrary, a as user, t as db } from "../../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/content/[id]/review/+server.ts
var POST = async ({ params, request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]))?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const contentId = params.id;
	if (!contentId) return json({ error: "Missing content ID" }, { status: 400 });
	const payload = await request.json();
	let status = "submitted";
	if (payload.result === "approved") status = payload.publishNow ? "published" : "approved";
	if (payload.result === "rejected") status = "rejected";
	if (payload.result === "approve_coming_soon") status = "coming_soon";
	const existing = await db.select({
		id: mediaLibrary.id,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		processingProgress: mediaLibrary.processingProgress,
		processingStage: mediaLibrary.processingStage
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).then((r) => r[0]);
	if (!existing) return json({ error: "Content not found" }, { status: 404 });
	if (payload.result === "approved" && payload.publishNow && !existing.videoUrl && existing.encoderJobId && existing.processingStatus !== "ready") {
		const pct = typeof existing.processingProgress === "number" ? existing.processingProgress : null;
		const stage = existing.processingStage || null;
		return json({
			error: `Video is still processing${pct !== null && stage ? ` (${stage}, ${pct}%)` : pct !== null ? ` (${pct}%)` : stage ? ` (${stage})` : ""}. Try again in a couple of minutes.`,
			processingStatus: existing.processingStatus,
			processingProgress: pct,
			processingStage: stage
		}, { status: 409 });
	}
	const updatePayload = {
		status,
		reviewNotes: payload.feedback ?? null,
		rejectionReason: payload.rejectionReason ?? null,
		reviewedAt: /* @__PURE__ */ new Date(),
		reviewedBy: session.user.id
	};
	if (payload.result === "approved" && payload.publishNow) updatePayload.isActive = true;
	if (payload.result === "rejected") updatePayload.isActive = false;
	if (payload.result === "approve_coming_soon") {
		updatePayload.isActive = false;
		if (payload.comingSoonReleaseDate) {
			const ts = Date.parse(payload.comingSoonReleaseDate);
			if (!Number.isNaN(ts)) updatePayload.scheduledPublishAt = new Date(ts);
		}
	}
	await db.update(mediaLibrary).set(updatePayload).where(eq(mediaLibrary.id, contentId));
	return json({
		success: true,
		contentId,
		status
	});
};
//#endregion
export { POST };
