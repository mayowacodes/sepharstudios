import { p as private_env } from './shared-server-DUDL94jl.js';
import Stripe from 'stripe';

//#region src/lib/server/stripe.ts
/**
* Lazy Stripe SDK wrapper. Mirrors the pattern of meilisearch.ts —
* zero cost when Stripe isn't called, and `isStripeConfigured()` lets
* callers degrade gracefully when env is missing.
*
* Env:
*   STRIPE_SECRET_KEY        required for any API call
*   STRIPE_WEBHOOK_SECRET    required to verify webhook signatures
*   STRIPE_CONNECT_CLIENT_ID required to build OAuth redirect URLs (only
*                            if you ever expose Standard accounts; Express
*                            onboarding via accountLinks does not need it)
*/
var cached = null;
function isStripeConfigured() {
	return !!private_env.STRIPE_SECRET_KEY;
}
function getStripe() {
	if (cached) return cached;
	if (!private_env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
	cached = new Stripe(private_env.STRIPE_SECRET_KEY, {
		apiVersion: "2026-05-27.dahlia",
		typescript: true
	});
	return cached;
}
function getWebhookSecret() {
	if (!private_env.STRIPE_WEBHOOK_SECRET) throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
	return private_env.STRIPE_WEBHOOK_SECRET;
}

export { getWebhookSecret as a, getStripe as g, isStripeConfigured as i };
//# sourceMappingURL=stripe2-CDDbjsFl.js.map
