import { w as db, V as paystackSubscriptions, af as trialBlacklist } from './drizzle-CKUH7ukq.js';
import { a as PLAN_PRICES_CENTS, b as createCustomer } from './paystack-qQiFeBwj.js';
import { v as verifyOtp, g as getPhoneHash } from './otp-BTBbVH3W.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq, or } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './redis-B0W1dNO5.js';
import 'ioredis';
import 'crypto';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/subscriptions/start-trial/+server.ts
/**
* POST /api/subscriptions/start-trial
*
* Pre-flight check before Paystack card entry.
* Verifies OTP, runs all three anti-abuse layers, creates Paystack customer.
* Returns { eligible: true, customerCode } or an error.
*/
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { plan, phone, otp, deviceFingerprint } = await request.json();
	if (!plan || !PLAN_PRICES_CENTS[plan]) return json({ error: "Invalid plan" }, { status: 400 });
	if (!phone?.trim() || !otp?.trim()) return json({ error: "Phone number and verification code are required" }, { status: 400 });
	if (!await verifyOtp(phone, otp)) return json({ error: "Invalid or expired verification code" }, { status: 400 });
	const existingSub = await db.select({
		id: paystackSubscriptions.id,
		status: paystackSubscriptions.status
	}).from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).limit(1).then((r) => r[0] ?? null);
	if (existingSub && ["trial", "active"].includes(existingSub.status)) return json({ error: "You already have an active subscription" }, { status: 409 });
	const phoneHash = getPhoneHash(phone);
	const blacklistConditions = [eq(trialBlacklist.phoneHash, phoneHash)];
	if (deviceFingerprint) blacklistConditions.push(eq(trialBlacklist.deviceFingerprint, deviceFingerprint));
	if (await db.select({ id: trialBlacklist.id }).from(trialBlacklist).where(or(...blacklistConditions)).limit(1).then((r) => r[0] ?? null)) return json({ error: "This account is not eligible for a free trial" }, { status: 409 });
	if (deviceFingerprint) await db.insert(trialBlacklist).values({
		phoneHash,
		deviceFingerprint,
		reason: `trial_preflight_${session.user.id}`
	});
	try {
		return json({
			eligible: true,
			customerCode: (await createCustomer(session.user.email, session.user.name ?? session.user.email)).customer_code
		});
	} catch (err) {
		console.error("Paystack createCustomer error:", err);
		return json({
			eligible: true,
			customerCode: null
		});
	}
};

export { POST };
//# sourceMappingURL=_server.ts-P5XprBdC.js.map
