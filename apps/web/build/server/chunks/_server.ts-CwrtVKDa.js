import { d as db, P as paystackSubscriptions } from './drizzle-CsnNxG5m.js';
import { D as DEFAULT_SQUEEZE_SCALE, p as planBreaks } from './decision-h45JlQJX.js';
import { e as error, j as json } from './index.js-BP8aAXBX.js';
import { and, eq, inArray, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './redis-8sKVJ4Iw.js';
import 'ioredis';
import './ads-CWhe8cTk.js';
import './paystack-CI6fS_Y0.js';
import 'node:crypto';

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

export { GET };
//# sourceMappingURL=_server.ts-CwrtVKDa.js.map
