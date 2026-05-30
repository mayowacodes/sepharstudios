import { B as playlists, j as mediaLibrary, t as db, z as playlistItems } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
//#region src/routes/api/playlists/[id]/items/+server.ts
var GET = async ({ params, locals }) => {
	try {
		const session = await locals.auth.getSession();
		if (!session) return json({ error: "Unauthorized" }, { status: 401 });
		const [playlist] = await db.select().from(playlists).where(and(eq(playlists.id, params.id), eq(playlists.userId, session.user.id))).limit(1);
		if (!playlist) return json({ error: "Not found" }, { status: 404 });
		return json(await db.select({
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
		}).from(playlistItems).innerJoin(mediaLibrary, eq(playlistItems.contentId, mediaLibrary.id)).where(eq(playlistItems.playlistId, params.id)));
	} catch (e) {
		console.error("GET /api/playlists/[id]/items failed", e);
		return json({ error: "Failed to load playlist items" }, { status: 500 });
	}
};
var POST = async ({ params, request, locals }) => {
	try {
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
	} catch (e) {
		console.error("POST /api/playlists/[id]/items failed", e);
		return json({ error: "Failed to add item" }, { status: 500 });
	}
};
var DELETE = async ({ params, url, locals }) => {
	try {
		const session = await locals.auth.getSession();
		if (!session) return json({ error: "Unauthorized" }, { status: 401 });
		const contentId = url.searchParams.get("contentId");
		if (!contentId) return json({ error: "contentId required" }, { status: 400 });
		const [playlist] = await db.select().from(playlists).where(and(eq(playlists.id, params.id), eq(playlists.userId, session.user.id))).limit(1);
		if (!playlist) return json({ error: "Not found" }, { status: 404 });
		await db.delete(playlistItems).where(and(eq(playlistItems.playlistId, params.id), eq(playlistItems.contentId, contentId)));
		return json({ success: true });
	} catch (e) {
		console.error("DELETE /api/playlists/[id]/items failed", e);
		return json({ error: "Failed to remove item" }, { status: 500 });
	}
};
//#endregion
export { DELETE, GET, POST };
