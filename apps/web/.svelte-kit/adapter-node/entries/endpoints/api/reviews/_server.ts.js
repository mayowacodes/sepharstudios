import { json } from "@sveltejs/kit";
import { d as db, r as reviews } from "../../../../chunks/drizzle.js";
import { and, eq, desc } from "drizzle-orm";
const GET = async ({ url }) => {
  const contentId = url.searchParams.get("contentId");
  if (!contentId) return json({ error: "contentId required" }, { status: 400 });
  const rows = await db.select().from(reviews).where(and(eq(reviews.contentId, contentId), eq(reviews.isApproved, true))).orderBy(desc(reviews.createdAt)).limit(20);
  return json(rows);
};
const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { contentId, contentType, rating, reviewText, profileId } = await request.json();
  if (rating < 1 || rating > 5) return json({ error: "Rating must be 1–5" }, { status: 400 });
  const [existing] = await db.select().from(reviews).where(and(eq(reviews.userId, session.user.id), eq(reviews.contentId, contentId))).limit(1);
  if (existing) {
    const [updated] = await db.update(reviews).set({ rating, reviewText, updatedAt: /* @__PURE__ */ new Date() }).where(eq(reviews.id, existing.id)).returning();
    return json(updated);
  }
  const [review] = await db.insert(reviews).values({
    userId: session.user.id,
    profileId: profileId ?? null,
    contentId,
    contentType: contentType ?? "movie",
    rating,
    reviewText,
    isApproved: false
    // pending admin approval
  }).returning();
  return json(review, { status: 201 });
};
export {
  GET,
  POST
};
