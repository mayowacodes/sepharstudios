import { a as user, j as mediaLibrary, t as db } from "../../../../../../../chunks/drizzle.js";
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
	const existing = await db.select({
		id: mediaLibrary.id,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).then((r) => r[0]);
	if (!existing) return json({ error: "Content not found" }, { status: 404 });
	if (payload.result === "approved" && payload.publishNow && !existing.videoUrl && existing.encoderJobId && existing.processingStatus !== "ready") return json({ error: "Video is still processing and cannot be published yet" }, { status: 409 });
	const updatePayload = {
		status,
		reviewNotes: payload.feedback ?? null,
		rejectionReason: payload.rejectionReason ?? null,
		reviewedAt: /* @__PURE__ */ new Date(),
		reviewedBy: session.user.id
	};
	if (payload.result === "approved" && payload.publishNow) updatePayload.isActive = true;
	if (payload.result === "rejected") updatePayload.isActive = false;
	await db.update(mediaLibrary).set(updatePayload).where(eq(mediaLibrary.id, contentId));
	return json({
		success: true,
		contentId,
		status
	});
};
//#endregion
export { POST };
