import { env } from '$env/dynamic/private';

const PAYSTACK_BASE = 'https://api.paystack.co';

function headers() {
	return {
		Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
		'Content-Type': 'application/json'
	};
}

async function paystackFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${PAYSTACK_BASE}${path}`, {
		...options,
		headers: { ...headers(), ...(options?.headers ?? {}) }
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? 'Paystack API error');
	return data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PaystackCustomer {
	customer_code: string;
	email: string;
	id: number;
}

export interface PaystackAuthorization {
	authorization_code: string;
	card_type: string;
	last4: string;
	bank: string;
	brand: string;
	signature: string;
	reusable: boolean;
}

export interface PaystackTransaction {
	id: number;
	reference: string;
	amount: number;
	status: string;
	authorization: PaystackAuthorization;
	customer: PaystackCustomer;
}

// ─── Customer ─────────────────────────────────────────────────────────────────

export async function createCustomer(email: string, name: string): Promise<PaystackCustomer> {
	const res = await paystackFetch<{ data: PaystackCustomer }>('/customer', {
		method: 'POST',
		body: JSON.stringify({ email, first_name: name.split(' ')[0], last_name: name.split(' ').slice(1).join(' ') || name })
	});
	return res.data;
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export async function initializeTransaction(options: {
	email: string;
	amountKobo: number; // in smallest currency unit (kobo for NGN, cents for USD)
	reference?: string;
	callbackUrl?: string;
	metadata?: Record<string, unknown>;
}): Promise<{ authorization_url: string; access_code: string; reference: string }> {
	const res = await paystackFetch<{ data: { authorization_url: string; access_code: string; reference: string } }>('/transaction/initialize', {
		method: 'POST',
		body: JSON.stringify({
			email: options.email,
			amount: options.amountKobo,
			reference: options.reference ?? `sephar_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			callback_url: options.callbackUrl,
			metadata: options.metadata
		})
	});
	return res.data;
}

export async function verifyTransaction(reference: string): Promise<PaystackTransaction> {
	const res = await paystackFetch<{ data: PaystackTransaction }>(`/transaction/verify/${reference}`);
	return res.data;
}

// ─── Recurring charge ─────────────────────────────────────────────────────────

export async function chargeAuthorization(options: {
	authorizationCode: string;
	email: string;
	amountKobo: number;
	reference?: string;
	metadata?: Record<string, unknown>;
}): Promise<PaystackTransaction> {
	const res = await paystackFetch<{ data: PaystackTransaction }>('/transaction/charge_authorization', {
		method: 'POST',
		body: JSON.stringify({
			authorization_code: options.authorizationCode,
			email: options.email,
			amount: options.amountKobo,
			reference: options.reference ?? `sephar_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			metadata: options.metadata
		})
	});
	return res.data;
}

// ─── Refunds ──────────────────────────────────────────────────────────────────

export interface PaystackRefund {
	id: number;
	transaction: { id: number; reference: string };
	amount: number;
	currency: string;
	status: string;
	refunded_at: string | null;
}

export async function createRefund(options: {
	transactionReference: string;
	amountKobo?: number; // omit to refund the full amount
	merchantNote?: string;
	customerNote?: string;
}): Promise<PaystackRefund> {
	const body: Record<string, unknown> = { transaction: options.transactionReference };
	if (options.amountKobo !== undefined) body.amount = options.amountKobo;
	if (options.merchantNote) body.merchant_note = options.merchantNote;
	if (options.customerNote) body.customer_note = options.customerNote;
	const res = await paystackFetch<{ data: PaystackRefund }>('/refund', {
		method: 'POST',
		body: JSON.stringify(body)
	});
	return res.data;
}

// ─── Plan amount helpers (USD cents → Paystack amount) ────────────────────────
// Paystack processes USD in cents (100 = $1.00)
//
// Pricing model (2026-05-28):
//   freemium: $1 every 2 months, 1 profile, no kids profile, ads-supported
//   basic:    $4/month,           2 profiles, no kids profile, ad-free
//   premium:  $10/month,          8 profiles, kids profile,    ad-free (family tier)
//   creator:  $10/month,          for content creators (unchanged tier)
//
// Family add-on ($5/month) is **deprecated** — its capabilities are now folded
// into the `premium` tier. The familyAddons table remains for backwards
// compatibility with existing subscribers.

export const PLAN_PRICES_CENTS = {
	freemium: 100,  // $1.00 / 2 months
	basic: 400,     // $4.00/month
	premium: 1000,  // $10.00/month — replaces basic+family-addon
	creator: 1000   // $10.00/month — creator tier
} as const;

export type PlanName = keyof typeof PLAN_PRICES_CENTS;

/**
 * Per-plan capabilities. Single source of truth for profile caps, kids access,
 * ad-supported flag, and renewal cadence. The verify endpoint snapshots these
 * into `paystackSubscriptions` so a plan-config change doesn't retroactively
 * change existing subscribers' entitlements.
 */
export const PLAN_FEATURES: Record<PlanName, {
	maxProfiles: number;
	kidsAllowed: boolean;
	hasAds: boolean;
	renewalIntervalMonths: number;
}> = {
	freemium: { maxProfiles: 1, kidsAllowed: false, hasAds: true,  renewalIntervalMonths: 2 },
	basic:    { maxProfiles: 2, kidsAllowed: false, hasAds: false, renewalIntervalMonths: 1 },
	premium:  { maxProfiles: 8, kidsAllowed: true,  hasAds: false, renewalIntervalMonths: 1 },
	creator:  { maxProfiles: 2, kidsAllowed: false, hasAds: false, renewalIntervalMonths: 1 }
};

/**
 * @deprecated kept only for the legacy family_addons table reconciliation.
 * Premium tier now includes 8 profiles natively; no need to charge an add-on.
 */
export const FAMILY_ADDON_CENTS = 500;
