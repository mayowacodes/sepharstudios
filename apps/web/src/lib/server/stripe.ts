import Stripe from 'stripe';
import { env } from '$env/dynamic/private';

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

let cached: Stripe | null = null;

export function isStripeConfigured(): boolean {
	return !!env.STRIPE_SECRET_KEY;
}

export function getStripe(): Stripe {
	if (cached) return cached;
	if (!env.STRIPE_SECRET_KEY) {
		throw new Error('STRIPE_SECRET_KEY is not configured');
	}
	cached = new Stripe(env.STRIPE_SECRET_KEY, {
		// Pinned to the version the installed stripe package's types target.
		apiVersion: '2026-06-24.dahlia',
		typescript: true
	});
	return cached;
}

export function getWebhookSecret(): string {
	if (!env.STRIPE_WEBHOOK_SECRET) {
		throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
	}
	return env.STRIPE_WEBHOOK_SECRET;
}
