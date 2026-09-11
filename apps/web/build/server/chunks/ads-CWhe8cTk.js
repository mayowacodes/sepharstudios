import { P as PLAN_FEATURES } from './paystack-CI6fS_Y0.js';

//#region src/lib/subscription/ads.ts
/**
* Ads gating — single source of truth for whether the current user should be
* shown ads. The VAST tag is fetched from /api/promo/vast-tag and consumed by
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
*
* Content category overrides all of the above — see `adsAllowedOnCategory`.
*/
function shouldShowAds(ctx) {
	if (!ctx || !ctx.plan) return true;
	if (ctx.status !== "active" && ctx.status !== "trial") return true;
	const features = PLAN_FEATURES[ctx.plan];
	if (!features) return true;
	return features.hasAds;
}
/**
* Audience categories that never carry advertising, on any plan.
*
* Non-skippable ads against children's content is a regulatory exposure
* (COPPA in the US, the UK CAP code on advertising to minors) that the
* available inventory does not justify, and a reputational one for a
* faith-based platform whose kids portal is a primary acquisition hook.
*
* This is a category rule, not a plan rule, and it is deliberately the outer
* check: a freemium viewer watching a kids title gets no ads even though their
* plan says `hasAds: true`.
*/
var AD_FREE_CATEGORIES = /* @__PURE__ */ new Set(["kids", "teens"]);
function adsAllowedOnCategory(category) {
	return !category || !AD_FREE_CATEGORIES.has(category);
}

export { adsAllowedOnCategory as a, shouldShowAds as s };
//# sourceMappingURL=ads-CWhe8cTk.js.map
