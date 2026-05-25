import { j as json } from './index-BcOZ6EV9.js';
import { d as db, I as playlistItems, H as playlists, m as mediaLibrary } from './drizzle-CW7hPjGG.js';
import { and, eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ params, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const [playlist] = await db.select().from(playlists).where(and(eq(playlists.id, params.id), eq(playlists.userId, session.user.id))).limit(1);
  if (!playlist) return json({ error: "Not found" }, { status: 404 });
  const items = await db.select({
    itemId: playlistItems.id,
    addedAt: playlistItems.addedAt,
    sortOrder: playlistItems.sortOrder,
    content: {
      id: mediaLibrary.id,
      title: mediaLibrary.title,
      thumbnail: mediaLibrary.thumbnail,
      posterUrl: mediaLibrary.posterUrl,
      mediaType: mediaLibrary.mediaType,
      duration: mediaLibrary.duration,
      ageRating: mediaLibrary.ageRating,
      year: mediaLibrary.year
    }
  }).from(playlistItems).innerJoin(mediaLibrary, eq(playlistItems.contentId, mediaLibrary.id)).where(eq(playlistItems.playlistId, params.id));
  return json(items);
};
const POST = async ({ params, request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { contentId, contentType } = await request.json();
  const [playlist] = await db.select().from(playlists).where(and(eq(playlists.id, params.id), eq(playlists.userId, session.user.id))).limit(1);
  if (!playlist) return json({ error: "Not found" }, { status: 404 });
  const [existing] = await db.select().from(playlistItems).where(and(eq(playlistItems.playlistId, params.id), eq(playlistItems.contentId, contentId))).limit(1);
  if (existing) return json({ alreadyAdded: true });
  const [item] = await db.insert(playlistItems).values({
    playlistId: params.id,
    contentId,
    contentType: contentType ?? "movie"
  }).returning();
  return json(item, { status: 201 });
};
const DELETE = async ({ params, url, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const contentId = url.searchParams.get("contentId");
  if (!contentId) return json({ error: "contentId required" }, { status: 400 });
  await db.delete(playlistItems).where(and(eq(playlistItems.playlistId, params.id), eq(playlistItems.contentId, contentId)));
  return json({ success: true });
};

export { DELETE, GET, POST };
//# sourceMappingURL=_server.ts-B2EQDaIf.js.map
