import { j as json } from './index-BcOZ6EV9.js';
import { d as db, c as user, m as mediaLibrary, n as notificationPreferences } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import { s as sendNewReleaseNotification } from './notifications-Bgqx6FUT.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import './server-nMhuZPcS.js';

const POST = async ({ params, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
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
  if (content.isActive) return json({ message: "Already published", notified: 0 });
  if (!content.videoUrl && content.encoderJobId && content.processingStatus !== "ready") {
    return json({ error: "Video is still processing and cannot be published yet" }, { status: 409 });
  }
  await db.update(mediaLibrary).set({
    isActive: true,
    status: "published",
    reviewedAt: /* @__PURE__ */ new Date(),
    reviewedBy: session.user.id
  }).where(eq(mediaLibrary.id, contentId));
  const recipients = await db.select({ email: user.email, name: user.name }).from(notificationPreferences).innerJoin(user, eq(notificationPreferences.userId, user.id)).where(eq(notificationPreferences.newReleases, true));
  let notified = 0;
  const emailPromises = recipients.map(async (r) => {
    try {
      await sendNewReleaseNotification(r.email, r.name, content.title, content.mediaType ?? "content", contentId);
      notified++;
    } catch {
      console.error(`Failed to notify ${r.email} for content ${contentId}`);
    }
  });
  Promise.all(emailPromises).catch(() => {
  });
  return json({ success: true, contentId, notifying: recipients.length });
};

export { POST };
//# sourceMappingURL=_server.ts-Bdk7zNyZ.js.map
