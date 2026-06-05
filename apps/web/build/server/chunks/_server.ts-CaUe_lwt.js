import { w as db, Y as ppvContent, V as paystackSubscriptions, Z as ppvPurchases } from './drizzle-CKUH7ukq.js';
import { j as json } from './index-Cv5VcsYq.js';
import { and, eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

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

export { GET };
//# sourceMappingURL=_server.ts-CaUe_lwt.js.map
