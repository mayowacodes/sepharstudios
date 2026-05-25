import { json } from "@sveltejs/kit";
import { P as PLAN_PRICES_CENTS, i as initializeTransaction } from "../../../../../chunks/paystack.js";
import { v as verifyOtp } from "../../../../../chunks/otp.js";
import { p as private_env } from "../../../../../chunks/shared-server.js";
const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { plan, addFamily, phone, otp } = await request.json();
  if (phone && otp) {
    const valid = verifyOtp(phone, otp);
    if (!valid) {
      return json({ error: "Invalid or expired verification code" }, { status: 400 });
    }
  } else if (phone || otp) {
    return json({ error: "Phone number and OTP are both required" }, { status: 400 });
  }
  if (!PLAN_PRICES_CENTS[plan]) {
    return json({ error: "Invalid plan" }, { status: 400 });
  }
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
    return json({ authorizationUrl: tx.authorization_url, reference: tx.reference });
  } catch (err) {
    console.error("Paystack init error:", err);
    return json({ error: "Payment initialization failed" }, { status: 500 });
  }
};
export {
  POST
};
