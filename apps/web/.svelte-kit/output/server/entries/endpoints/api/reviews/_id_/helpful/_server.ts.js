import { json } from "@sveltejs/kit";
import { d as db, r as reviews, D as reviewHelpful } from "../../../../../../chunks/drizzle.js";
import { eq, and, sql } from "drizzle-orm";
const POST = async ({ params, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const reviewId = params.id;
  const review = await db.select({ id: reviews.id, helpfulCount: reviews.helpfulCount }).from(reviews).where(eq(reviews.id, reviewId)).then((r) => r[0]);
  if (!review) return json({ error: "Review not found" }, { status: 404 });
  const existing = await db.select({ id: reviewHelpful.id }).from(reviewHelpful).where(and(
    eq(reviewHelpful.reviewId, reviewId),
    eq(reviewHelpful.userId, session.user.id)
  )).then((r) => r[0]);
  if (existing) {
    await db.delete(reviewHelpful).where(eq(reviewHelpful.id, existing.id));
    await db.update(reviews).set({ helpfulCount: sql`GREATEST(${reviews.helpfulCount} - 1, 0)` }).where(eq(reviews.id, reviewId));
    return json({ helpful: false });
  }
  await db.insert(reviewHelpful).values({
    reviewId,
    userId: session.user.id,
    isHelpful: true
  });
  await db.update(reviews).set({ helpfulCount: sql`COALESCE(${reviews.helpfulCount}, 0) + 1` }).where(eq(reviews.id, reviewId));
  return json({ helpful: true });
};
export {
  POST
};
