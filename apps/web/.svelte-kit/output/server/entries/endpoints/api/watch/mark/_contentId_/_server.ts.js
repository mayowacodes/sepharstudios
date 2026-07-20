import { q as mediaWatchProgress, t as db } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, eq, isNull } from "drizzle-orm";
//#region src/routes/api/watch/mark/[contentId]/+server.ts
/**
* POST   /api/watch/mark/<contentId>?as=watched       → upsert progress row at 100%
* POST   /api/watch/mark/<contentId>?as=unwatched     → delete the show-level progress row
*
* Manual override for the auto-tracked watch progress. Powers the "Mark
* as Watched" / "Mark as Unwatched" affordance on detail pages — useful
* when a viewer finished a title outside the platform (someone else's
* profile, a public showing, etc.) and wants the title to stop showing
* up in their Resume / Continue Watching rows.
*
* Scope: only the SHOW-level row (episodeId IS NULL). Episode-level
* progress isn't touched — those still come from real playback events
* + auto-advance. This keeps the override mechanic simple and avoids
* a confusing "marked the show watched but episodes still show
* partial" inconsistency for partial-watch + manual-complete users.
*/
var POST = async ({ params, url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "unauthorized" }, { status: 401 });
	const contentId = params.contentId;
	if (!contentId) return json({ error: "contentId required" }, { status: 400 });
	const as = url.searchParams.get("as");
	if (as !== "watched" && as !== "unwatched") return json({ error: "as must be 'watched' or 'unwatched'" }, { status: 400 });
	if (as === "watched") {
		const [existing] = await db.select({ id: mediaWatchProgress.id }).from(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, session.user.id), eq(mediaWatchProgress.contentId, contentId), isNull(mediaWatchProgress.episodeId))).limit(1);
		if (existing) await db.update(mediaWatchProgress).set({
			completionPercent: 100,
			isCompleted: true,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(mediaWatchProgress.id, existing.id));
		else await db.insert(mediaWatchProgress).values({
			userId: session.user.id,
			contentId,
			episodeId: null,
			positionSeconds: 0,
			completionPercent: 100,
			isCompleted: true
		});
		return json({ state: "watched" });
	}
	await db.delete(mediaWatchProgress).where(and(eq(mediaWatchProgress.userId, session.user.id), eq(mediaWatchProgress.contentId, contentId), isNull(mediaWatchProgress.episodeId)));
	return json({ state: "unwatched" });
};
//#endregion
export { POST };
