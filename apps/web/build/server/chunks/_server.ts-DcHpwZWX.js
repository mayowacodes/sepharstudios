import { j as json } from './index-BcOZ6EV9.js';
import { d as db, r as paystackSubscriptions, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import { p as private_env } from './shared-server-BeisX7n9.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

const GET = async ({ params, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const sub = await db.select({ plan: paystackSubscriptions.plan, status: paystackSubscriptions.status }).from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).then((r) => r[0]);
  if (!sub || !["premium", "creator"].includes(sub.plan ?? "")) {
    return json({ error: "Downloads require Premium or Creator plan" }, { status: 403 });
  }
  if (!["active", "trial"].includes(sub.status ?? "")) {
    return json({ error: "Active subscription required" }, { status: 403 });
  }
  const contentId = params.id;
  const content = await db.select({ videoUrl: mediaLibrary.videoUrl, isActive: mediaLibrary.isActive }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).then((r) => r[0]);
  if (!content || !content.isActive) return json({ error: "Content not found" }, { status: 404 });
  if (!content.videoUrl) return json({ error: "No video available for this content" }, { status: 404 });
  let manifestUrl = content.videoUrl;
  if (!manifestUrl.startsWith("http")) {
    const minioBase = private_env.MINIO_PUBLIC_URL ?? private_env.S3_ENDPOINT ?? "";
    manifestUrl = `${minioBase}/${manifestUrl}`;
  }
  return json({ manifestUrl, contentId });
};

export { GET };
//# sourceMappingURL=_server.ts-DcHpwZWX.js.map
