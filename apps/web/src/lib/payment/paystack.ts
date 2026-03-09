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

// ─── Plan amount helpers (USD cents → Paystack amount) ────────────────────────
// Paystack processes USD in cents (100 = $1.00)

export const PLAN_PRICES_CENTS = {
	basic: 300,     // $3.00/month
	premium: 1000,  // $10.00/month
	creator: 1500   // $15.00/month
} as const;

export const FAMILY_ADDON_CENTS = 500; // $5.00/month

export type PlanName = keyof typeof PLAN_PRICES_CENTS;
