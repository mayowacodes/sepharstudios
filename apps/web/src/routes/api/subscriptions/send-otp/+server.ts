import { json, type RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/db/drizzle';
import { trialBlacklist } from '$lib/db/schema/sepharstudios';
import { createOtp, getPhoneHash } from '$lib/server/otp';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request }) => {
  const { phone } = await request.json();
  if (!phone?.trim()) return json({ error: 'Phone number required' }, { status: 400 });

  const phoneHash = getPhoneHash(phone);

  const blacklisted = await db
    .select({ id: trialBlacklist.id })
    .from(trialBlacklist)
    .where(eq(trialBlacklist.phoneHash, phoneHash))
    .then((r) => r[0]);

  if (blacklisted) {
    return json({ error: 'This phone number has already been used for a free trial' }, { status: 409 });
  }

  const otp = createOtp(phone, 10 * 60 * 1000);

  if (env.SMS_WEBHOOK_URL) {
    try {
      await fetch(env.SMS_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          message: `Your Sephar Studios verification code is: ${otp}. Valid for 10 minutes.`
        })
      });
    } catch {
      console.error('SMS send failed');
    }
  } else {
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
  }

  return json({ sent: true });
};
