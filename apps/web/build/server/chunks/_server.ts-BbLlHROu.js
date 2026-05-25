import { j as json } from './index-BcOZ6EV9.js';
import { d as db, F as trialBlacklist } from './drizzle-CW7hPjGG.js';
import { g as getPhoneHash, c as createOtp } from './otp-DlJFBysv.js';
import { eq } from 'drizzle-orm';
import { p as private_env } from './shared-server-BeisX7n9.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import 'crypto';

const POST = async ({ request }) => {
  const { phone } = await request.json();
  if (!phone?.trim()) return json({ error: "Phone number required" }, { status: 400 });
  const phoneHash = getPhoneHash(phone);
  const blacklisted = await db.select({ id: trialBlacklist.id }).from(trialBlacklist).where(eq(trialBlacklist.phoneHash, phoneHash)).then((r) => r[0]);
  if (blacklisted) {
    return json({ error: "This phone number has already been used for a free trial" }, { status: 409 });
  }
  const otp = createOtp(phone, 10 * 60 * 1e3);
  if (private_env.SMS_WEBHOOK_URL) {
    try {
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
  } else {
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
  }
  return json({ sent: true });
};

export { POST };
//# sourceMappingURL=_server.ts-BbLlHROu.js.map
