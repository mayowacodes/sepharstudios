import { e as error, j as json, p as private_env } from './index.js-BP8aAXBX.js';
import { d as db, P as paystackSubscriptions, m as mediaLibrary } from './drizzle-CsnNxG5m.js';
import { f as getPresignedUrl } from './minio-B7gIRc1u.js';
import { d as decide, r as recordServed, a as recordFrequency } from './decision-h45JlQJX.js';
import { e as enforceRateLimit } from './rate-limit-8igsU22q.js';
import { f as fingerprintFromHeaders } from './ua-country-BNOH1xSS.js';
import { and, eq, inArray, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'minio';
import './redis-8sKVJ4Iw.js';
import 'ioredis';
import './ads-CWhe8cTk.js';
import './paystack-CI6fS_Y0.js';
import 'node:crypto';

//#region src/routes/api/promo/decision/+server.ts
/**
* POST /api/promo/decision  →  AdDecisionPayload
*
* Runs the auction for one break and returns the winning creative, resolved to
* a short-lived signed URL.
*
* POST rather than GET, and called at the break rather than up front, for the
* same reason the PPV paywall strips playback URLs server-side: anything
* returned from a page load is serialized into the payload and readable in the
* network tab. A creative URL held for the whole session is one a viewer can
* enumerate, pre-block, or scrape for campaign intelligence.
*
* Must never be called during SSR — the native builds reach it cross-origin
* with a bearer token, and it depends on request headers for device/country.
*/
var CREATIVE_URL_TTL_SECONDS = 900;
var POST = async ({ request, locals, url, getClientAddress }) => {
	const session = await locals.auth.getSession();
	await enforceRateLimit(`promo:decision:${session?.user.id ?? getClientAddress()}`, {
		capacity: 20,
		refillPerSec: .5
	});
	const body = await request.json().catch(() => null);
	const contentId = body?.contentId;
	if (!contentId) throw error(400, "contentId is required");
	const fp = fingerprintFromHeaders(request.headers);
	let subscription = null;
	if (session) {
		const [active] = await db.select({
			plan: paystackSubscriptions.plan,
			status: paystackSubscriptions.status
		}).from(paystackSubscriptions).where(and(eq(paystackSubscriptions.userId, session.user.id), inArray(paystackSubscriptions.status, ["active", "trial"]))).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
		subscription = active ?? null;
	}
	const explain = session?.user.role === "admin" && url.searchParams.get("explain") === "1";
	const { decision, rejections } = await decide({
		contentId,
		breakId: body?.breakId,
		userId: session?.user.id ?? null,
		deviceType: fp.deviceType,
		country: fp.country,
		subscription
	}, { explain });
	if (!decision) return json({
		ad: null,
		...explain ? { rejections } : {}
	});
	let src;
	if (decision.kind === "vast") src = decision.src ?? "";
	else {
		if (!decision.src) return json({ ad: null });
		src = await getPresignedUrl(private_env.ADS_CREATIVE_BUCKET || "sephar-promo", decision.src, CREATIVE_URL_TTL_SECONDS);
	}
	const [content] = await db.select({ creatorId: mediaLibrary.creatorId }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
	await recordServed(decision, {
		contentId,
		breakId: body?.breakId,
		userId: session?.user.id ?? null,
		deviceType: fp.deviceType,
		country: fp.country
	}, content?.creatorId ?? null);
	recordFrequency(decision.campaignId, session?.user.id ?? "anon", 24);
	return json({
		ad: {
			...decision,
			src
		},
		...explain ? { rejections } : {}
	});
};

export { POST };
//# sourceMappingURL=_server.ts-xkpmmw9-.js.map
