import { p as private_env } from "./shared-server.js";
const PAYSTACK_BASE = "https://api.paystack.co";
function headers() {
  return {
    Authorization: `Bearer ${private_env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json"
  };
}
async function paystackFetch(path, options) {
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: { ...headers(), ...options?.headers ?? {} }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Paystack API error");
  return data;
}
async function createCustomer(email, name) {
  const res = await paystackFetch("/customer", {
    method: "POST",
    body: JSON.stringify({ email, first_name: name.split(" ")[0], last_name: name.split(" ").slice(1).join(" ") || name })
  });
  return res.data;
}
async function initializeTransaction(options) {
  const res = await paystackFetch("/transaction/initialize", {
    method: "POST",
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
async function verifyTransaction(reference) {
  const res = await paystackFetch(`/transaction/verify/${reference}`);
  return res.data;
}
async function chargeAuthorization(options) {
  const res = await paystackFetch("/transaction/charge_authorization", {
    method: "POST",
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
const PLAN_PRICES_CENTS = {
  basic: 300,
  // $3.00/month
  premium: 1e3,
  // $10.00/month
  creator: 1500
  // $15.00/month
};
export {
  PLAN_PRICES_CENTS as P,
  createCustomer as a,
  chargeAuthorization as c,
  initializeTransaction as i,
  verifyTransaction as v
};
