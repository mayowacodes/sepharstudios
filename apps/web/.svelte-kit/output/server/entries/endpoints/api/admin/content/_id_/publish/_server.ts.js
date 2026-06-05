import { G as notificationPreferences, H as mediaLibrary, K as notifications, a as user, t as db } from "../../../../../../../chunks/drizzle.js";
import { n as sendNewReleaseNotification } from "../../../../../../../chunks/notifications.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/admin/content/[id]/publish/+server.ts
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	if ((await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]))?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
	const contentId = params.id;
	if (!contentId) return json({ error: "Missing content ID" }, { status: 400 });
	const content = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		mediaType: mediaLibrary.mediaType,
		isActive: mediaLibrary.isActive,
		processingStatus: mediaLibrary.processingStatus,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId
	}).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).then((r) => r[0]);
	if (!content) return json({ error: "Content not found" }, { status: 404 });
	if (content.isActive) return json({
		message: "Already published",
		notified: 0
	});
	if (!content.videoUrl && content.encoderJobId && content.processingStatus !== "ready") return json({ error: "Video is still processing and cannot be published yet" }, { status: 409 });
	await db.update(mediaLibrary).set({
		isActive: true,
		status: "published",
		reviewedAt: /* @__PURE__ */ new Date(),
		reviewedBy: session.user.id
	}).where(eq(mediaLibrary.id, contentId));
	const recipients = await db.select({
		userId: user.id,
		email: user.email,
		name: user.name
	}).from(notificationPreferences).innerJoin(user, eq(notificationPreferences.userId, user.id)).where(eq(notificationPreferences.newReleases, true));
	if (recipients.length > 0) await db.insert(notifications).values(recipients.map((r) => ({
		userId: r.userId,
		kind: "content_publish",
		title: `New: ${content.title}`,
		message: `A new ${content.mediaType ?? "release"} just dropped on Sephar Studios. Tap to watch.`,
		actionUrl: `/watch/${contentId}`
	}))).catch((err) => console.error("publish in-app notification batch failed:", err));
	const emailResults = await Promise.allSettled(recipients.map(async (r) => {
		try {
			await sendNewReleaseNotification(r.email, r.name, content.title, content.mediaType ?? "content", contentId);
			return {
				email: r.email,
				ok: true
			};
		} catch (err) {
			console.error(`Failed to notify ${r.email} for content ${contentId}:`, err);
			return {
				email: r.email,
				ok: false,
				error: err instanceof Error ? err.message : "unknown"
			};
		}
	}));
	let delivered = 0;
	let failed = 0;
	for (const r of emailResults) if (r.status === "fulfilled" && r.value.ok) delivered++;
	else failed++;
	return json({
		success: true,
		contentId,
		recipients: recipients.length,
		delivered,
		failed
	});
};
//#endregion
export { POST };
