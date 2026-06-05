import { p as private_env } from './shared-server-DUDL94jl.js';
import { w as db, af as trialBlacklist } from './drizzle-CKUH7ukq.js';
import { g as getPhoneHash, c as createOtp, O as OtpCooldownError } from './otp-BTBbVH3W.js';
import { j as json } from './index-Cv5VcsYq.js';
import { eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './redis-B0W1dNO5.js';
import 'ioredis';
import 'crypto';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/api/subscriptions/send-otp/+server.ts
var POST = async ({ request }) => {
	const { phone } = await request.json();
	if (!phone?.trim()) return json({ error: "Phone number required" }, { status: 400 });
	const phoneHash = getPhoneHash(phone);
	if (await db.select({ id: trialBlacklist.id }).from(trialBlacklist).where(eq(trialBlacklist.phoneHash, phoneHash)).then((r) => r[0])) return json({ error: "This phone number has already been used for a free trial" }, { status: 409 });
	let otp;
	try {
		otp = await createOtp(phone, 600 * 1e3);
	} catch (err) {
		if (err instanceof OtpCooldownError) return json({ error: `Please wait ${err.retryAfterSec} seconds before requesting another code.` }, {
			status: 429,
			headers: { "Retry-After": String(err.retryAfterSec) }
		});
		console.error("OTP creation failed:", err);
		return json({ error: "Could not issue verification code right now" }, { status: 503 });
	}
	if (private_env.SMS_WEBHOOK_URL) try {
		await fetch(private_env.SMS_WEBHOOK_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				to: phone,
				message: `Your Sephar Studios verification code is: ${otp}. Valid for 10 minutes.`
			})
		});
	} catch {
		console.error("SMS send failed");
	}
	else console.log(`[DEV] OTP for ${phone}: ${otp}`);
	return json({ sent: true });
};

export { POST };
//# sourceMappingURL=_server.ts-D_rvgMas.js.map
