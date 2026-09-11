/**
 * Ads gating — single source of truth for whether the current user should be
 * shown ads.
 *
 * The old /api/promo/vast-tag endpoint is gone. Ads now go through
 * /api/promo/plan (the break schedule) and /api/promo/decision (the auction),
 * which gate on this function plus the category rule below. `ADS_VAST_TAG_URL`
 * still works, but as the house BACKFILL inside the auction rather than as the
 * only ad path — leave it unset to disable backfill.
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

import { PLAN_FEATURES, type PlanName } from '$lib/payment/paystack';

export interface AdsContext {
	plan?: string | null;
	status?: string | null;
}

export function shouldShowAds(ctx: AdsContext | null | undefined): boolean {
	if (!ctx || !ctx.plan) return true;

	// Treat any non-paying state as ad-supported. The paywall logic lives
	// elsewhere (route guards), so this function only answers "ads y/n",
	// not "should they have access at all."
	const inactive = ctx.status !== 'active' && ctx.status !== 'trial';
	if (inactive) return true;

	const features = PLAN_FEATURES[ctx.plan as PlanName];
	if (!features) return true; // unknown plan = safe default to ads-on

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
const AD_FREE_CATEGORIES = new Set(['kids', 'teens']);

export function adsAllowedOnCategory(category: string | null | undefined): boolean {
	return !category || !AD_FREE_CATEGORIES.has(category);
}

/**
 * The full answer: does this viewer, on this title, get ads?
 *
 * Prefer this over calling `shouldShowAds` directly whenever a content id is in
 * hand — plan alone is not sufficient.
 */
export function shouldShowAdsFor(
	ctx: AdsContext | null | undefined,
	category: string | null | undefined
): boolean {
	return adsAllowedOnCategory(category) && shouldShowAds(ctx);
}
