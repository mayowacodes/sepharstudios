import { p as private_env } from './shared-server-DUDL94jl.js';
import { n as db, a0 as user, I as paystackSubscriptions, G as paymentIntents } from './drizzle-BjmsPAPl.js';
import { n as notify } from './notify-Cul2puxj.js';
import { a as PLAN_PRICES_CENTS, c as chargeAuthorization, P as PLAN_FEATURES } from './paystack-qQiFeBwj.js';
import { j as json } from './index-5kYmxIr9.js';
import { eq, and, inArray, lt, isNotNull } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'web-push';
import './index-DBqjc0Yf.js';

//#region src/routes/api/cron/renew-subscriptions/+server.ts
/**
* POST /api/cron/renew-subscriptions
*
* Recurring billing worker. Drives the renewal cycle that Paystack would
* normally drive via their Subscription API — but we don't use Paystack Plans,
* so we run our own. Invoke from an external cron (Dokploy schedule, EasyCron,
* GitHub Actions) once an hour:
*
*     curl -X POST https://sepharstudios.com/api/cron/renew-subscriptions \
*          -H "Authorization: Bearer $CRON_SECRET"
*
* For each subscription where `next_charge_at <= now()` and status='active':
*   1. Call `chargeAuthorization` against the saved card for the plan amount.
*   2. On success → extend `current_period_end` + `next_charge_at` by
*      `renewalIntervalMonths`, reset `failed_attempts`, notify the user.
*   3. On failure → bump `failed_attempts`, set status='paused' after 3 strikes,
*      revoke access after 7 days paused. Notify the user each time so they
*      can update their card.
*
* The endpoint is gated by a shared secret in `CRON_SECRET`. **Never invoke
* from a browser** — anyone with the secret can trigger charges.
*/
var MAX_FAILED_ATTEMPTS_BEFORE_PAUSE = 3;
var BATCH_SIZE = 50;
var POST = async ({ request }) => {
	const auth = request.headers.get("authorization");
	const expected = private_env.CRON_SECRET;
	if (!expected) return json({ error: "CRON_SECRET not configured on server" }, { status: 500 });
	if (auth !== `Bearer ${expected}`) return json({ error: "Unauthorized" }, { status: 401 });
	const now = /* @__PURE__ */ new Date();
	const due = await db.select({
		sub: paystackSubscriptions,
		email: user.email,
		userName: user.name
	}).from(paystackSubscriptions).innerJoin(user, eq(user.id, paystackSubscriptions.userId)).where(and(inArray(paystackSubscriptions.status, ["active", "trial"]), lt(paystackSubscriptions.nextChargeAt, now), isNotNull(paystackSubscriptions.paystackAuthorizationCode), isNotNull(paystackSubscriptions.nextChargeAt))).limit(BATCH_SIZE);
	const results = {
		processed: 0,
		charged: 0,
		failed: 0,
		paused: 0,
		errors: []
	};
	for (const { sub, email, userName: _userName } of due) {
		results.processed += 1;
		const plan = sub.plan;
		const features = PLAN_FEATURES[plan];
		if (!features) {
			results.errors.push(`sub ${sub.id}: unknown plan "${plan}"`);
			continue;
		}
		const amountCents = PLAN_PRICES_CENTS[plan];
		if (!amountCents) {
			results.errors.push(`sub ${sub.id}: no price for plan "${plan}"`);
			continue;
		}
		if (!sub.paystackAuthorizationCode) {
			results.errors.push(`sub ${sub.id}: no authorization code`);
			continue;
		}
		const reference = `renew_${sub.id}_${Date.now()}`;
		try {
			await db.insert(paymentIntents).values({
				reference,
				userId: sub.userId,
				kind: "renewal",
				plan,
				amountCents
			});
		} catch (err) {
			console.error("[cron] payment_intent insert failed:", err);
			continue;
		}
		try {
			const tx = await chargeAuthorization({
				authorizationCode: sub.paystackAuthorizationCode,
				email,
				amountKobo: amountCents,
				reference,
				metadata: {
					userId: sub.userId,
					plan,
					kind: "renewal"
				}
			});
			if (tx.status === "success") {
				const newPeriodEnd = new Date(now);
				newPeriodEnd.setMonth(newPeriodEnd.getMonth() + features.renewalIntervalMonths);
				await db.update(paystackSubscriptions).set({
					status: "active",
					currentPeriodStart: now,
					currentPeriodEnd: newPeriodEnd,
					nextChargeAt: newPeriodEnd,
					failedAttempts: 0,
					lastChargeAttemptAt: now,
					updatedAt: now
				}).where(eq(paystackSubscriptions.id, sub.id));
				await db.update(paymentIntents).set({
					status: "consumed",
					consumedAt: now
				}).where(eq(paymentIntents.reference, reference));
				results.charged += 1;
			} else throw new Error(`Paystack status: ${tx.status}`);
		} catch (err) {
			results.failed += 1;
			const attempts = sub.failedAttempts + 1;
			const shouldPause = attempts >= MAX_FAILED_ATTEMPTS_BEFORE_PAUSE;
			await db.update(paystackSubscriptions).set({
				failedAttempts: attempts,
				lastChargeAttemptAt: now,
				nextChargeAt: shouldPause ? null : new Date(now.getTime() + (attempts === 1 ? 36e5 : 864e5)),
				status: shouldPause ? "paused" : sub.status,
				updatedAt: now
			}).where(eq(paystackSubscriptions.id, sub.id));
			if (shouldPause) results.paused += 1;
			await notify({
				userId: sub.userId,
				kind: "subscription",
				title: shouldPause ? "Subscription paused — update your card" : "Payment failed",
				message: shouldPause ? `We couldn't process your renewal after ${attempts} attempts. Your subscription is paused. Update your card to restore access.` : `We couldn't process your renewal. We'll try again automatically (attempt ${attempts}/${MAX_FAILED_ATTEMPTS_BEFORE_PAUSE}).`,
				actionUrl: "/settings"
			});
			console.warn(`[cron] charge failed for sub ${sub.id} (attempt ${attempts}):`, err);
		}
	}
	return json({
		ok: true,
		runAt: now.toISOString(),
		...results
	});
};

export { POST };
//# sourceMappingURL=_server.ts-ErksAnJ5.js.map
