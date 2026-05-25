import { json } from "@sveltejs/kit";
import { d as db, z as trialBlacklist } from "../../../../../chunks/drizzle.js";
import { g as getPhoneHash, c as createOtp } from "../../../../../chunks/otp.js";
import { eq } from "drizzle-orm";
import { p as private_env } from "../../../../../chunks/shared-server.js";
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
export {
  POST
};
