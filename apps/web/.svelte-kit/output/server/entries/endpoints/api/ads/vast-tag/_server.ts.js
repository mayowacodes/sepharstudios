import { t as private_env } from "../../../../../chunks/shared-server.js";
import { t as db, tt as paystackSubscriptions } from "../../../../../chunks/drizzle.js";
import { t as PLAN_FEATURES } from "../../../../../chunks/paystack.js";
import { json } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";
//#region src/lib/subscription/ads.ts
/**
* Ads gating — single source of truth for whether the current user should be
* shown ads. The VAST tag is fetched from /api/ads/vast-tag and consumed by
* VideoPlayer as a pre-roll; both surfaces gate on `shouldShowAds()`. Set
* `ADS_VAST_TAG_URL` env to enable; leave unset to no-op (free of ads even
* for non-paying viewers, useful for staging).
*
* The decision tree:
*   - No subscription           → free anonymous viewer, show ads
*   - Subscription cancelled    → access ended, show ads (or paywall — depends on UX)
*   - Subscription paused       → dunning state, show ads while card is fixed
*   - plan === 'freemium'       → always show ads (defining tier feature)
*   - plan === 'basic' | 'premium' | 'creator' → ad-free
*/
function shouldShowAds(ctx) {
	if (!ctx || !ctx.plan) return true;
	if (ctx.status !== "active" && ctx.status !== "trial") return true;
	const features = PLAN_FEATURES[ctx.plan];
	if (!features) return true;
	return features.hasAds;
}
//#endregion
//#region src/routes/api/ads/vast-tag/+server.ts
/**
* GET /api/ads/vast-tag?contentId=...
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
	const session = await locals.auth.getSession();
	if (!session) return json({
		url: expandMacros(baseTag, url.searchParams.get("contentId"), request.headers.get("referer")),
		kind: "preroll"
	});
	const [sub] = await db.select({
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
//#endregion
export { GET };
