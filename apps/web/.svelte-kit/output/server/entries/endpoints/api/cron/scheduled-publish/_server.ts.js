import { t as private_env } from "../../../../../chunks/shared-server.js";
import { K as mediaLibrary, X as notifications, Y as notificationPreferences, a as user, t as db, v as comingSoonSubscriptions } from "../../../../../chunks/drizzle.js";
import { t as notify } from "../../../../../chunks/notify.js";
import { n as sendNewReleaseNotification } from "../../../../../chunks/notifications.js";
import { json } from "@sveltejs/kit";
import { and, eq, inArray, isNotNull, isNull, lte } from "drizzle-orm";
//#region src/routes/api/cron/scheduled-publish/+server.ts
/**
* POST /api/cron/scheduled-publish
*
* Looks for approved content rows whose `scheduledPublishAt` has elapsed,
* flips them to published, and fans out new-release notifications. Same
* effect as an admin clicking publish in /admin/content, but unattended.
*
* Auth: CRON_SECRET bearer (same as the other cron endpoints).
* Schedule: every 5 minutes.
*/
var BATCH = 50;
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured on server" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const now = /* @__PURE__ */ new Date();
	const due = await db.select({
		id: mediaLibrary.id,
		title: mediaLibrary.title,
		mediaType: mediaLibrary.mediaType,
		videoUrl: mediaLibrary.videoUrl,
		encoderJobId: mediaLibrary.encoderJobId,
		processingStatus: mediaLibrary.processingStatus,
		previousStatus: mediaLibrary.status
	}).from(mediaLibrary).where(and(inArray(mediaLibrary.status, ["approved", "coming_soon"]), eq(mediaLibrary.isActive, false), isNotNull(mediaLibrary.scheduledPublishAt), lte(mediaLibrary.scheduledPublishAt, now))).limit(BATCH);
	const result = {
		processed: 0,
		published: 0,
		skipped: 0,
		notified: 0,
		notifiedSubscribers: 0,
		errors: []
	};
	for (const c of due) {
		result.processed += 1;
		if (!(!!c.videoUrl || !!c.encoderJobId && c.processingStatus === "ready")) {
			result.skipped += 1;
			continue;
		}
		try {
			await db.update(mediaLibrary).set({
				isActive: true,
				status: "published",
				reviewedAt: now,
				updatedAt: now
			}).where(eq(mediaLibrary.id, c.id));
			result.published += 1;
			const recipients = await db.select({
				userId: user.id,
				email: user.email,
				name: user.name
			}).from(notificationPreferences).innerJoin(user, eq(notificationPreferences.userId, user.id)).where(eq(notificationPreferences.newReleases, true));
			if (recipients.length > 0) {
				await db.insert(notifications).values(recipients.map((r) => ({
					userId: r.userId,
					kind: "content_publish",
					title: `New ${c.mediaType}: ${c.title}`,
					message: "A new piece of content just landed on Sephar Studios.",
					actionUrl: `/watch/${c.id}`
				}))).onConflictDoNothing();
				for (const r of recipients) try {
					await sendNewReleaseNotification(r.email, r.name ?? "there", c.title, c.mediaType, c.id);
					result.notified += 1;
				} catch (err) {
					console.warn("[scheduled-publish] email failed", r.email, err);
				}
			}
			const subs = await db.select({
				userId: comingSoonSubscriptions.userId,
				contentId: comingSoonSubscriptions.contentId
			}).from(comingSoonSubscriptions).where(and(eq(comingSoonSubscriptions.contentId, c.id), isNull(comingSoonSubscriptions.notifiedAt)));
			for (const sub of subs) try {
				await notify({
					userId: sub.userId,
					kind: "content_publish",
					title: `${c.title} is live`,
					message: "The title you were waiting for just dropped.",
					actionUrl: `/watch/${c.id}`
				});
				result.notifiedSubscribers += 1;
			} catch (err) {
				console.warn("[scheduled-publish] notify-me dispatch failed", sub.userId, err);
			}
			if (subs.length > 0) await db.update(comingSoonSubscriptions).set({ notifiedAt: now }).where(and(eq(comingSoonSubscriptions.contentId, c.id), isNull(comingSoonSubscriptions.notifiedAt)));
		} catch (err) {
			result.errors.push(`${c.id}: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
	return json({
		ok: true,
		runAt: now.toISOString(),
		...result
	});
};
//#endregion
export { POST };
