import { I as paymentIntents, P as notificationPreferences, R as paystackSubscriptions, t as db, tt as trialBlacklist, x as familyAddons } from "../../../../../chunks/drizzle.js";
import { r as sendTrialWelcome } from "../../../../../chunks/notifications.js";
import { s as verifyTransaction, t as PLAN_FEATURES } from "../../../../../chunks/paystack.js";
import { t as track } from "../../../../../chunks/analytics.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
//#region src/routes/api/payment/verify/+server.ts
var GET = async ({ url, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
	if (!reference) return json({ error: "Missing reference" }, { status: 400 });
	const [intent] = await db.select().from(paymentIntents).where(eq(paymentIntents.reference, reference)).limit(1);
	if (!intent) return json({ error: "Unknown payment reference" }, { status: 404 });
	if (intent.userId !== session.user.id) return json({ error: "Reference does not belong to this account" }, { status: 403 });
	if (intent.status === "consumed") {
		const [existingSub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).limit(1);
		return json({
			success: true,
			plan: intent.plan,
			trialEndDate: existingSub?.trialEndDate,
			alreadyConsumed: true
		});
	}
	try {
		const tx = await verifyTransaction(reference);
		if (tx.status !== "success") return json({ error: "Payment not successful" }, { status: 402 });
		const plan = intent.plan;
		const features = PLAN_FEATURES[plan];
		if (!features) {
			console.error("Unknown plan in intent:", {
				reference,
				plan
			});
			return json({ error: "Unknown plan" }, { status: 502 });
		}
		const addFamily = intent.addFamily;
		const isTrial = intent.isTrial;
		const userId = session.user.id;
		const cardSig = tx.authorization?.signature;
		if (cardSig && isTrial) {
			if ((await db.select().from(trialBlacklist).where(eq(trialBlacklist.cardSignature, cardSig)).limit(1)).length > 0) return json({ error: "This payment method has already been used for a free trial." }, { status: 409 });
		}
		const now = /* @__PURE__ */ new Date();
		const trialEnd = new Date(now);
		trialEnd.setMonth(trialEnd.getMonth() + 3);
		const [sub] = await db.transaction(async (tx2) => {
			const periodEnd = isTrial ? trialEnd : (() => {
				const d = new Date(now);
				d.setMonth(d.getMonth() + features.renewalIntervalMonths);
				return d;
			})();
			const subRow = await tx2.insert(paystackSubscriptions).values({
				userId,
				plan,
				status: isTrial ? "trial" : "active",
				trialStartDate: isTrial ? now : null,
				trialEndDate: isTrial ? trialEnd : null,
				currentPeriodStart: now,
				currentPeriodEnd: periodEnd,
				maxProfiles: features.maxProfiles,
				kidsAllowed: features.kidsAllowed,
				nextChargeAt: periodEnd,
				paystackCustomerCode: tx.customer?.customer_code,
				paystackAuthorizationCode: tx.authorization?.authorization_code,
				cardSignature: cardSig,
				cardLast4: tx.authorization?.last4,
				cardBrand: tx.authorization?.brand
			}).returning();
			if (addFamily && subRow[0]) await tx2.insert(familyAddons).values({
				subscriptionId: subRow[0].id,
				userId,
				paystackAuthorizationCode: tx.authorization?.authorization_code
			});
			if (cardSig && isTrial) await tx2.insert(trialBlacklist).values({
				cardSignature: cardSig,
				reason: `trial_started_by_${userId}`
			}).onConflictDoNothing();
			await tx2.update(paymentIntents).set({
				status: "consumed",
				consumedAt: /* @__PURE__ */ new Date()
			}).where(eq(paymentIntents.reference, reference));
			return subRow;
		});
		await db.insert(notificationPreferences).values({ userId }).onConflictDoNothing();
		await sendTrialWelcome(session.user.email, session.user.name, plan, trialEnd);
		await track(userId, "subscribe", {
			plan,
			isTrial,
			addFamily
		});
		return json({
			success: true,
			plan,
			trialEndDate: trialEnd
		});
	} catch (err) {
		console.error("Payment verify error:", err);
		return json({ error: "Verification failed" }, { status: 500 });
	}
};
//#endregion
export { GET };
