import { R as paystackSubscriptions, t as db, tt as trialBlacklist } from "../../../../../chunks/drizzle.js";
import { i as createCustomer, n as PLAN_PRICES_CENTS } from "../../../../../chunks/paystack.js";
import { i as verifyOtp, r as getPhoneHash } from "../../../../../chunks/otp.js";
import { json } from "@sveltejs/kit";
import { eq, inArray, or } from "drizzle-orm";
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
	if (existingSub && inArray(existingSub.status, ["trial", "active"])) return json({ error: "You already have an active subscription" }, { status: 409 });
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
//#endregion
export { POST };
