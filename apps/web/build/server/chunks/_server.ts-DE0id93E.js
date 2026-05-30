import { n as db, S as reviews, R as reviewHelpful } from './drizzle-BjmsPAPl.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, and, sql } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

//#region src/routes/api/reviews/[id]/helpful/+server.ts
var POST = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const reviewId = params.id;
	if (!await db.select({
		id: reviews.id,
		helpfulCount: reviews.helpfulCount
	}).from(reviews).where(eq(reviews.id, reviewId)).then((r) => r[0])) return json({ error: "Review not found" }, { status: 404 });
	const existing = await db.select({ id: reviewHelpful.id }).from(reviewHelpful).where(and(eq(reviewHelpful.reviewId, reviewId), eq(reviewHelpful.userId, session.user.id))).then((r) => r[0]);
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

export { POST };
//# sourceMappingURL=_server.ts-DE0id93E.js.map
