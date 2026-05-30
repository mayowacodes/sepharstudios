import { J as reviews, j as mediaLibrary, t as db } from "../../../../chunks/drizzle.js";
import { r as scoreReviewQuality, t as moderateComment } from "../../../../chunks/ai-moderation.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/api/reviews/+server.ts
var GET = async ({ url }) => {
	const contentId = url.searchParams.get("contentId");
	if (!contentId) return json({ error: "contentId required" }, { status: 400 });
	return json(await db.select().from(reviews).where(and(eq(reviews.contentId, contentId), eq(reviews.isApproved, true))).orderBy(desc(reviews.createdAt)).limit(20));
};
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { contentId, contentType, rating, reviewText, profileId } = await request.json();
	if (rating < 1 || rating > 5) return json({ error: "Rating must be 1–5" }, { status: 400 });
	let aiApprove = false;
	let aiQualityScore = 0;
	if (reviewText && reviewText.trim().length > 0) {
		const [content] = await db.select({ title: mediaLibrary.title }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
		const contentTitle = content?.title ?? "Sephar Studios content";
		const [moderation, quality] = await Promise.all([moderateComment(reviewText, contentTitle), scoreReviewQuality(reviewText, rating, contentTitle)]);
		if (moderation?.verdict === "reject") return json({
			error: "Your review violated platform guidelines.",
			reason: moderation.reason
		}, { status: 422 });
		aiApprove = moderation?.verdict === "approve" && (quality?.qualityScore ?? 0) >= 5;
		aiQualityScore = quality?.qualityScore ?? 0;
	}
	const [existing] = await db.select().from(reviews).where(and(eq(reviews.userId, session.user.id), eq(reviews.contentId, contentId))).limit(1);
	if (existing) {
		const [updated] = await db.update(reviews).set({
			rating,
			reviewText,
			isApproved: aiApprove,
			updatedAt: /* @__PURE__ */ new Date()
		}).where(eq(reviews.id, existing.id)).returning();
		return json(updated);
	}
	const [review] = await db.insert(reviews).values({
		userId: session.user.id,
		profileId: profileId ?? null,
		contentId,
		contentType: contentType ?? "movie",
		rating,
		reviewText,
		isApproved: aiApprove
	}).returning();
	return json({
		...review,
		aiQualityScore
	}, { status: 201 });
};
//#endregion
export { GET, POST };
