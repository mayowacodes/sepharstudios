import { M as mediaWatchProgress, j as mediaLibrary, t as db } from "../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq, ne } from "drizzle-orm";
//#region src/routes/api/watch/history/+server.ts
var GET = async ({ url, locals }) => {
	try {
		const user = locals.user;
		if (!user) return json({ error: "Unauthorized" }, { status: 401 });
		const profileId = url.searchParams.get("profileId");
		const limit = Number(url.searchParams.get("limit") ?? "10");
		return json((await db.select({
			progress: mediaWatchProgress,
			content: {
				id: mediaLibrary.id,
				title: mediaLibrary.title,
				thumbnail: mediaLibrary.thumbnail,
				posterUrl: mediaLibrary.posterUrl,
				mediaType: mediaLibrary.mediaType,
				duration: mediaLibrary.duration
			}
		}).from(mediaWatchProgress).innerJoin(mediaLibrary, eq(mediaWatchProgress.contentId, mediaLibrary.id)).where(and(eq(mediaWatchProgress.userId, user.id), ne(mediaWatchProgress.isCompleted, true), profileId ? eq(mediaWatchProgress.profileId, profileId) : void 0)).orderBy(desc(mediaWatchProgress.updatedAt)).limit(limit)).map((r) => ({
			...r.content,
			positionSeconds: r.progress.positionSeconds,
			durationSeconds: r.progress.durationSeconds,
			completionPercent: r.progress.completionPercent,
			lastWatched: r.progress.updatedAt
		})));
	} catch (e) {
		console.error("GET /api/watch/history failed", e);
		return json({ error: "Failed to load watch history" }, { status: 500 });
	}
};
//#endregion
export { GET };
