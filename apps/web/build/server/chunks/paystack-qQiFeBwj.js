import { p as private_env } from './shared-server-DUDL94jl.js';

//#region src/lib/payment/paystack.ts
var PAYSTACK_BASE = "https://api.paystack.co";
function headers() {
	return {
		Authorization: `Bearer ${private_env.PAYSTACK_SECRET_KEY}`,
		"Content-Type": "application/json"
	};
}
async function paystackFetch(path, options) {
	const res = await fetch(`${PAYSTACK_BASE}${path}`, {
		...options,
		headers: {
			...headers(),
			...options?.headers ?? {}
		}
	});
	const data = await res.json();
	if (!res.ok) throw new Error(data.message ?? "Paystack API error");
	return data;
}
async function createCustomer(email, name) {
	return (await paystackFetch("/customer", {
		method: "POST",
		body: JSON.stringify({
			email,
			first_name: name.split(" ")[0],
			last_name: name.split(" ").slice(1).join(" ") || name
		})
	})).data;
}
async function initializeTransaction(options) {
	return (await paystackFetch("/transaction/initialize", {
		method: "POST",
		body: JSON.stringify({
			email: options.email,
			amount: options.amountKobo,
			reference: options.reference ?? `sephar_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			callback_url: options.callbackUrl,
			metadata: options.metadata
		})
	})).data;
}
async function verifyTransaction(reference) {
	return (await paystackFetch(`/transaction/verify/${reference}`)).data;
}
async function chargeAuthorization(options) {
	return (await paystackFetch("/transaction/charge_authorization", {
		method: "POST",
		body: JSON.stringify({
			authorization_code: options.authorizationCode,
			email: options.email,
			amount: options.amountKobo,
			reference: options.reference ?? `sephar_${Date.now()}_${Math.random().toString(36).slice(2)}`,
			metadata: options.metadata
		})
	})).data;
}
async function createRefund(options) {
	const body = { transaction: options.transactionReference };
	if (options.amountKobo !== void 0) body.amount = options.amountKobo;
	if (options.merchantNote) body.merchant_note = options.merchantNote;
	if (options.customerNote) body.customer_note = options.customerNote;
	return (await paystackFetch("/refund", {
		method: "POST",
		body: JSON.stringify(body)
	})).data;
}
var PLAN_PRICES_CENTS = {
	freemium: 100,
	basic: 400,
	premium: 1e3,
	creator: 1e3
};
/**
* Per-plan capabilities. Single source of truth for profile caps, kids access,
* ad-supported flag, and renewal cadence. The verify endpoint snapshots these
* into `paystackSubscriptions` so a plan-config change doesn't retroactively
* change existing subscribers' entitlements.
*/
var PLAN_FEATURES = {
	freemium: {
		maxProfiles: 1,
		kidsAllowed: false,
		hasAds: true,
		renewalIntervalMonths: 2
	},
	basic: {
		maxProfiles: 2,
		kidsAllowed: false,
		hasAds: false,
		renewalIntervalMonths: 1
	},
	premium: {
		maxProfiles: 8,
		kidsAllowed: true,
		hasAds: false,
		renewalIntervalMonths: 1
	},
	creator: {
		maxProfiles: 2,
		kidsAllowed: false,
		hasAds: false,
		renewalIntervalMonths: 1
	}
};

export { PLAN_FEATURES as P, PLAN_PRICES_CENTS as a, createCustomer as b, chargeAuthorization as c, createRefund as d, initializeTransaction as i, verifyTransaction as v };
//# sourceMappingURL=paystack-qQiFeBwj.js.map
