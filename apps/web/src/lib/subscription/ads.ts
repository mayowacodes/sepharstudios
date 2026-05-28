/**
 * Ads gating — single source of truth for whether the current user should be
 * shown ads. The actual ad SDK isn't wired yet (deferred per the payment-system
 * round). When you do wire one (Google AdSense, Spotim, etc.), gate the SDK
 * load and ad-slot mount points behind `shouldShowAds()`.
 *
 * The decision tree:
 *   - No subscription           → free anonymous viewer, show ads
 *   - Subscription cancelled    → access ended, show ads (or paywall — depends on UX)
 *   - Subscription paused       → dunning state, show ads while card is fixed
 *   - plan === 'freemium'       → always show ads (defining tier feature)
 *   - plan === 'basic' | 'premium' | 'creator' → ad-free
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
