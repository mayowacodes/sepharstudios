import { j as json } from './index-BcOZ6EV9.js';
import { P as PLAN_PRICES_CENTS, i as initializeTransaction } from './paystack-BHqCqWrC.js';
import { v as verifyOtp } from './otp-DlJFBysv.js';
import { p as private_env } from './shared-server-BeisX7n9.js';
import './utils-FiC4zhrQ.js';
import 'crypto';

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

export { POST };
//# sourceMappingURL=_server.ts-DLutqT6a.js.map
