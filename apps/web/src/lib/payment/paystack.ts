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
// Pricing model (2026-09-10 — free-for-all launch, repriced):
//   basic:    $0,        2 profiles, kids profile, ads-supported  <- entry tier
//   premium:  $1/month,  8 profiles, kids profile, ad-free
//   creator:  $2/month,  8 profiles, ad-free, creator tooling
//
// `basic` absorbed the old `freemium` tier: it is now the free, ad-supported
// entry point, and it inherited freemium's kids access. A "free for all"
// platform that paywalls the entire kids portal is not free for the families it
// most wants, and kids content is the strongest acquisition hook in a
// faith-based catalog. Its 2-profile cap is a consequence of that — a kids
// profile occupies a slot, so a 1-profile plan could not hold both a parent and
// a child and `kidsAllowed` would have been decorative.
//
// `freemium` is RETAINED BELOW as a deprecated alias. Subscription rows store
// the plan as a plain string, so removing the key would make
// PLAN_FEATURES['freemium'] undefined for every existing subscriber — their
// entitlements come from the snapshot columns, but every lookup that resolves
// live config (ads gating, renewal, plan-change validation) would fall through
// to its unknown-plan branch. Keep the alias until those rows are migrated.
//
// Ads never serve on kids/teens content regardless of plan — see the category
// rule in $lib/subscription/ads.ts. Non-skippable advertising to children
// carries regulatory exposure (COPPA, the UK CAP code) that the inventory does
// not justify.
//
// Family add-on ($5/month) is **deprecated** — its capabilities are folded into
// premium. The familyAddons table remains for backwards compatibility.

export const PLAN_PRICES_CENTS = {
	basic: 0,       // free — no charge cycle, never touches Paystack
	premium: 100,   // $1.00/month
	creator: 200,   // $2.00/month
	/** @deprecated Alias for `basic`. Kept so existing subscription rows resolve. */
	freemium: 0
} as const;

export type PlanName = keyof typeof PLAN_PRICES_CENTS;

/**
 * Is `v` a real plan name?
 *
 * Use this instead of `!PLAN_PRICES_CENTS[plan]` for validation. Freemium costs
 * 0, and 0 is falsy — a truthiness check silently rejects the free tier as an
 * unknown plan. That is exactly the bug this replaced in
 * /api/payment/initialize and /api/subscriptions/start-trial.
 */
export function isPlanName(v: unknown): v is PlanName {
	return typeof v === 'string' && Object.prototype.hasOwnProperty.call(PLAN_PRICES_CENTS, v);
}

/**
 * Does this plan involve money? Free plans must never reach Paystack: there is
 * nothing to charge, no authorization to store, and no renewal to schedule.
 */
/**
 * Resolve a stored plan name to the tier it means today.
 *
 * `freemium` was merged into `basic` on 2026-09-10. Rows written before that
 * still say 'freemium', so anything comparing plan names — entitlement checks,
 * upgrade paths, reporting — must canonicalise first or it will treat the same
 * tier as two different ones.
 */
export function canonicalPlan(plan: string): PlanName {
	return plan === 'freemium' ? 'basic' : (plan as PlanName);
}

export function isPaidPlan(plan: PlanName): boolean {
	return PLAN_PRICES_CENTS[plan] > 0;
}

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
	basic:    { maxProfiles: 2, kidsAllowed: true,  hasAds: true,  renewalIntervalMonths: 0 },
	premium:  { maxProfiles: 8, kidsAllowed: true,  hasAds: false, renewalIntervalMonths: 1 },
	creator:  { maxProfiles: 8, kidsAllowed: true,  hasAds: false, renewalIntervalMonths: 1 },
	// Deprecated alias — identical to `basic` so legacy rows behave correctly.
	freemium: { maxProfiles: 2, kidsAllowed: true,  hasAds: true,  renewalIntervalMonths: 0 }
};

/**
 * @deprecated kept only for the legacy family_addons table reconciliation.
 * Premium tier now includes 8 profiles natively; no need to charge an add-on.
 */
export const FAMILY_ADDON_CENTS = 500;
