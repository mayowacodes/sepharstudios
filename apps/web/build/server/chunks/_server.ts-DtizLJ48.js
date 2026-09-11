import { j as json, p as private_env } from './index.js-CxPEndTa.js';
import { d as db, _ as paymentIntents } from './drizzle-C3SH12nS.js';
import { i as isPlanName, e as isPaidPlan, f as initializeTransaction } from './paystack-DWLDZ9qO.js';
import { v as verifyOtp } from './otp-BA3I5D8A.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'drizzle-orm';
import './redis-7fSdOjSS.js';
import 'ioredis';
import 'crypto';

//#region src/routes/api/payment/initialize/+server.ts
var POST = async ({ request, locals }) => {
	const session = await locals.auth.getSession();
	if (!session) return json({ error: "Unauthorized" }, { status: 401 });
	const { plan, addFamily, phone, otp } = await request.json();
	if (phone && otp) {
		if (!await verifyOtp(phone, otp)) return json({ error: "Invalid or expired verification code" }, { status: 400 });
	} else if (phone || otp) return json({ error: "Phone number and OTP are both required" }, { status: 400 });
	if (!isPlanName(plan)) return json({ error: "Invalid plan" }, { status: 400 });
	if (!isPaidPlan(plan)) return json({ error: "This plan is free — activate it via /api/subscriptions/start-free" }, { status: 400 });
	try {
		const verificationAmountCents = 50;
		const tx = await initializeTransaction({
			email: session.user.email,
			amountKobo: verificationAmountCents,
			callbackUrl: `${private_env.PUBLIC_SITE_URL ?? "http://localhost:5173"}/api/payment/verify`,
			metadata: {
				userId: session.user.id,
				plan,
				addFamily: addFamily ?? false,
				isTrial: true
			}
		});
		await db.insert(paymentIntents).values({
			reference: tx.reference,
			userId: session.user.id,
			kind: "subscription",
			plan,
			amountCents: verificationAmountCents,
			addFamily: addFamily ?? false,
			isTrial: true
		});
		return json({
			authorizationUrl: tx.authorization_url,
			reference: tx.reference
		});
	} catch (err) {
		console.error("Paystack init error:", err);
		return json({ error: "Payment initialization failed" }, { status: 500 });
	}
};

export { POST };
//# sourceMappingURL=_server.ts-DtizLJ48.js.map
