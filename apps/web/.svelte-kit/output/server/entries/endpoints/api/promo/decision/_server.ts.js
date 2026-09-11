import { t as private_env } from "../../../../../chunks/shared-server.js";
import { t as db, tt as mediaLibrary, ut as paystackSubscriptions } from "../../../../../chunks/drizzle.js";
import { o as getPresignedUrl } from "../../../../../chunks/minio.js";
import { a as recordFrequency, o as recordServed, r as decide } from "../../../../../chunks/decision.js";
import { i as enforceRateLimit } from "../../../../../chunks/rate-limit.js";
import { t as fingerprintFromHeaders } from "../../../../../chunks/ua-country.js";
import { error, json } from "@sveltejs/kit";
import { and, desc, eq, inArray } from "drizzle-orm";
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
//#endregion
export { POST };
