import { json } from "@sveltejs/kit";
import { d as db, m as mediaLibrary, k as mediaWatchProgress } from "../../../../../chunks/drizzle.js";
import { eq, and, ne, desc } from "drizzle-orm";
const GET = async ({ url, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const profileId = url.searchParams.get("profileId");
  const limit = Number(url.searchParams.get("limit") ?? "10");
  const rows = await db.select({
    progress: mediaWatchProgress,
    content: {
      id: mediaLibrary.id,
      title: mediaLibrary.title,
      thumbnail: mediaLibrary.thumbnail,
      posterUrl: mediaLibrary.posterUrl,
      mediaType: mediaLibrary.mediaType,
      duration: mediaLibrary.duration
    }
  }).from(mediaWatchProgress).innerJoin(mediaLibrary, eq(mediaWatchProgress.contentId, mediaLibrary.id)).where(and(
    eq(mediaWatchProgress.userId, session.user.id),
    ne(mediaWatchProgress.isCompleted, true),
    profileId ? eq(mediaWatchProgress.profileId, profileId) : void 0
  )).orderBy(desc(mediaWatchProgress.updatedAt)).limit(limit);
  return json(rows.map((r) => ({
    ...r.content,
    positionSeconds: r.progress.positionSeconds,
    durationSeconds: r.progress.durationSeconds,
    completionPercent: r.progress.completionPercent,
    lastWatched: r.progress.updatedAt
  })));
};
export {
  GET
};
