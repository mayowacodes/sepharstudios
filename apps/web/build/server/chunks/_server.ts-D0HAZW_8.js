import { j as json } from './index-BcOZ6EV9.js';
import { d as db, r as paystackSubscriptions, F as trialBlacklist } from './drizzle-CW7hPjGG.js';
import { eq, inArray, or } from 'drizzle-orm';
import { v as verifyOtp, g as getPhoneHash } from './otp-DlJFBysv.js';
import { P as PLAN_PRICES_CENTS, a as createCustomer } from './paystack-BHqCqWrC.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import 'crypto';

const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { plan, phone, otp, deviceFingerprint } = await request.json();
  if (!plan || !PLAN_PRICES_CENTS[plan]) {
    return json({ error: "Invalid plan" }, { status: 400 });
  }
  if (!phone?.trim() || !otp?.trim()) {
    return json({ error: "Phone number and verification code are required" }, { status: 400 });
  }
  const otpValid = verifyOtp(phone, otp);
  if (!otpValid) {
    return json({ error: "Invalid or expired verification code" }, { status: 400 });
  }
  const existingSub = await db.select({ id: paystackSubscriptions.id, status: paystackSubscriptions.status }).from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).limit(1).then((r) => r[0] ?? null);
  if (existingSub && inArray(existingSub.status, ["trial", "active"])) {
    return json({ error: "You already have an active subscription" }, { status: 409 });
  }
  const phoneHash = getPhoneHash(phone);
  const blacklistConditions = [eq(trialBlacklist.phoneHash, phoneHash)];
  if (deviceFingerprint) {
    blacklistConditions.push(eq(trialBlacklist.deviceFingerprint, deviceFingerprint));
  }
  const blacklisted = await db.select({ id: trialBlacklist.id }).from(trialBlacklist).where(or(...blacklistConditions)).limit(1).then((r) => r[0] ?? null);
  if (blacklisted) {
    return json(
      { error: "This account is not eligible for a free trial" },
      { status: 409 }
    );
  }
  if (deviceFingerprint) {
    await db.insert(trialBlacklist).values({
      phoneHash,
      deviceFingerprint,
      reason: `trial_preflight_${session.user.id}`
    });
  }
  try {
    const customer = await createCustomer(session.user.email, session.user.name ?? session.user.email);
    return json({ eligible: true, customerCode: customer.customer_code });
  } catch (err) {
    console.error("Paystack createCustomer error:", err);
    return json({ eligible: true, customerCode: null });
  }
};

export { POST };
//# sourceMappingURL=_server.ts-D0HAZW_8.js.map
