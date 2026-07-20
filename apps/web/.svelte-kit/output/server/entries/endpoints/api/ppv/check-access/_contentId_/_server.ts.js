import { at as ppvPurchases, it as ppvContent, t as db, tt as paystackSubscriptions } from "../../../../../../chunks/drizzle.js";
import { json } from "@sveltejs/kit";
import { and, desc, eq } from "drizzle-orm";
//#region src/routes/api/ppv/check-access/[contentId]/+server.ts
var GET = async ({ params, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({
		canWatch: false,
		reason: "unauthenticated"
	});
	const contentId = params.contentId;
	const userId = session.user.id;
	const [ppv] = await db.select().from(ppvContent).where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true))).limit(1);
	if (!ppv) {
		const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, userId)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
		const hasActiveSub = sub && ["trial", "active"].includes(sub.status);
		return json({
			canWatch: hasActiveSub,
			isPPV: false,
			reason: hasActiveSub ? "subscribed" : "no_subscription"
		});
	}
	const [purchase] = await db.select().from(ppvPurchases).where(and(eq(ppvPurchases.userId, userId), eq(ppvPurchases.contentId, contentId))).limit(1);
	if (purchase) return json({
		canWatch: true,
		isPPV: true,
		alreadyPurchased: true,
		priceCents: ppv.finalPriceCents
	});
	return json({
		canWatch: false,
		isPPV: true,
		alreadyPurchased: false,
		priceCents: ppv.finalPriceCents,
		reason: "ppv_required"
	});
};
//#endregion
export { GET };
