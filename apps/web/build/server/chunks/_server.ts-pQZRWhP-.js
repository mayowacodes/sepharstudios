import { p as private_env, j as json } from './index.js-DwRgOKlO.js';
import { d as db, m as mediaLibrary, N as paystackSubscriptions } from './drizzle-DlGuU73K.js';
import { a as adsAllowedOnCategory, s as shouldShowAds } from './ads-DcZhqEPs.js';
import { eq, and, inArray, desc } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './paystack-DUH_7_zN.js';

//#region src/routes/api/promo/vast-tag/+server.ts
/**
* GET /api/promo/vast-tag?contentId=...
*
* NOTE ON THE PATH: this lives under /api/promo/, not /api/ads/, deliberately.
* EasyList — the filter list behind uBlock Origin, AdBlock Plus and most
* mobile content blockers — blocks the substring `/api/ads/` by default, so the
* previous path was silently unreachable for a large share of viewers. Any
* future ad endpoint belongs under /api/promo/ for the same reason.
*
* Returns the VAST tag URL the VideoPlayer should request for a pre-roll
* ad. Resolves the viewer's plan to decide whether ads apply.
*
* Response: { url: string | null, kind: 'preroll' | null }
*
* `url=null` means "no ad" — either the user is paying, the network env
* isn't configured, or the content opted out. The VideoPlayer treats
* `null` as "skip the pre-roll" so this endpoint is safe to call always.
*
* Configuration:
*   ADS_VAST_TAG_URL — base URL of the VAST tag (e.g. Google IMA, Magnite).
*                      The endpoint appends standard macros: `[CONTENT_ID]`,
*                      `[CACHEBUSTER]`, `[REFERRER]`.
*   ADS_DESCRIPTION_URL — optional canonical content URL passed to the ad
*                          network for contextual targeting.
*/
function expandMacros(template, contentId, referrer) {
	const cacheBuster = Math.floor(Math.random() * 1e9).toString();
	let out = template.replaceAll("[CONTENT_ID]", contentId ?? "").replaceAll("[CACHEBUSTER]", cacheBuster);
	if (referrer) out = out.replaceAll("[REFERRER]", encodeURIComponent(referrer));
	return out;
}
var GET = async ({ locals, url, request }) => {
	const baseTag = private_env.ADS_VAST_TAG_URL;
	if (!baseTag) return json({
		url: null,
		kind: null
	});
	const contentId = url.searchParams.get("contentId");
	if (contentId) {
		const [row] = await db.select({ category: mediaLibrary.category }).from(mediaLibrary).where(eq(mediaLibrary.id, contentId)).limit(1);
		if (!adsAllowedOnCategory(row?.category)) return json({
			url: null,
			kind: null
		});
	}
	const session = await locals.auth.getSession();
	if (!session) return json({
		url: expandMacros(baseTag, url.searchParams.get("contentId"), request.headers.get("referer")),
		kind: "preroll"
	});
	const [active] = await db.select({
		plan: paystackSubscriptions.plan,
		status: paystackSubscriptions.status
	}).from(paystackSubscriptions).where(and(eq(paystackSubscriptions.userId, session.user.id), inArray(paystackSubscriptions.status, ["active", "trial"]))).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	let sub = active;
	if (!sub) [sub] = await db.select({
		plan: paystackSubscriptions.plan,
		status: paystackSubscriptions.status
	}).from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
	if (!shouldShowAds({
		plan: sub?.plan,
		status: sub?.status
	})) return json({
		url: null,
		kind: null
	});
	return json({
		url: expandMacros(baseTag, url.searchParams.get("contentId"), request.headers.get("referer")),
		kind: "preroll"
	});
};

export { GET };
//# sourceMappingURL=_server.ts-pQZRWhP-.js.map
