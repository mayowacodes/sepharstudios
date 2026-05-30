import { n as db, a0 as user, B as mediaLibrary, E as notificationPreferences, F as notifications } from './drizzle-BjmsPAPl.js';
import { a as sendNewReleaseNotification } from './notifications-CKo51rvz.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './server2-D6YOLBns.js';
import './index-DBqjc0Yf.js';

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
	const emailPromises = recipients.map(async (r) => {
		try {
			await sendNewReleaseNotification(r.email, r.name, content.title, content.mediaType ?? "content", contentId);
		} catch {
			console.error(`Failed to notify ${r.email} for content ${contentId}`);
		}
	});
	Promise.all(emailPromises).catch((err) => {
		console.error("publish notification batch failed unexpectedly:", err);
	});
	return json({
		success: true,
		contentId,
		notifying: recipients.length
	});
};

export { POST };
//# sourceMappingURL=_server.ts-Vu2ie8tT.js.map
