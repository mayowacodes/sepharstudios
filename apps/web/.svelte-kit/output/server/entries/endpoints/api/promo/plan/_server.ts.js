import { ct as paystackSubscriptions, t as db } from "../../../../../chunks/drizzle.js";
import { i as planBreaks, t as DEFAULT_SQUEEZE_SCALE } from "../../../../../chunks/decision.js";
import { error, json } from "@sveltejs/kit";
import { and, desc, eq, inArray } from "drizzle-orm";
//#region src/routes/api/promo/plan/+server.ts
async function buildAdPlanPayload(contentId, runtimeSeconds, userId) {
	let subscription = null;
	if (userId) {
		const [active] = await db.select({
			plan: paystackSubscriptions.plan,
			status: paystackSubscriptions.status
		}).from(paystackSubscriptions).where(and(eq(paystackSubscriptions.userId, userId), inArray(paystackSubscriptions.status, ["active", "trial"]))).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
		subscription = active ?? null;
	}
	return {
		breaks: await planBreaks(contentId, runtimeSeconds, subscription),
		duckMaxSeconds: 30,
		defaultSqueezeScale: DEFAULT_SQUEEZE_SCALE
	};
}
var GET = async ({ url, locals }) => {
	const contentId = url.searchParams.get("contentId");
	if (!contentId) throw error(400, "contentId is required");
	const runtimeRaw = url.searchParams.get("runtime");
	const runtime = runtimeRaw ? Number.parseInt(runtimeRaw, 10) : null;
	const session = await locals.auth.getSession();
	return json(await buildAdPlanPayload(contentId, Number.isFinite(runtime) ? runtime : null, session?.user.id ?? null));
};
//#endregion
export { GET };
