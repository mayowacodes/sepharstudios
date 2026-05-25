import { j as json } from './index-BcOZ6EV9.js';
import { d as db, E as profiles, m as mediaLibrary, w as mediaWatchProgress } from './drizzle-CW7hPjGG.js';
import { eq, desc } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ url, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const profileId = url.searchParams.get("profileId");
  if (!profileId) return json({ error: "profileId required" }, { status: 400 });
  const profile = await db.select({ userId: profiles.userId, name: profiles.name, type: profiles.type }).from(profiles).where(eq(profiles.id, profileId)).then((r) => r[0]);
  if (!profile || profile.userId !== session.user.id) {
    return json({ error: "Profile not found" }, { status: 404 });
  }
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
  const history = await db.select({
    contentId: mediaWatchProgress.contentId,
    positionSeconds: mediaWatchProgress.positionSeconds,
    durationSeconds: mediaWatchProgress.durationSeconds,
    completionPercent: mediaWatchProgress.completionPercent,
    updatedAt: mediaWatchProgress.updatedAt,
    title: mediaLibrary.title,
    mediaType: mediaLibrary.mediaType,
    thumbnail: mediaLibrary.thumbnail,
    ageRating: mediaLibrary.ageRating
  }).from(mediaWatchProgress).leftJoin(mediaLibrary, eq(mediaWatchProgress.contentId, mediaLibrary.id)).where(
    eq(mediaWatchProgress.profileId, profileId)
  ).orderBy(desc(mediaWatchProgress.updatedAt)).limit(50);
  const totalSeconds = history.reduce((sum, h) => sum + (h.positionSeconds ?? 0), 0);
  const totalWatchHours = totalSeconds / 3600;
  return json({
    profile: { id: profileId, name: profile.name, type: profile.type },
    reportPeriod: { from: since.toISOString(), to: (/* @__PURE__ */ new Date()).toISOString() },
    totalWatchHours: Math.round(totalWatchHours * 10) / 10,
    contentWatched: history.map((h) => ({
      title: h.title,
      mediaType: h.mediaType,
      thumbnail: h.thumbnail,
      ageRating: h.ageRating,
      completionPercent: h.completionPercent,
      watchedAt: h.updatedAt
    }))
  });
};

export { GET };
//# sourceMappingURL=_server.ts-B7QDivsd.js.map
