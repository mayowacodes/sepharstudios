import { j as json } from './index-BcOZ6EV9.js';
import { p as private_env } from './shared-server-BeisX7n9.js';
import { d as db, r as paystackSubscriptions } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

const POST = async ({ request }) => {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const secret = private_env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return json({ error: "PAYSTACK_SECRET_KEY is not configured" }, { status: 500 });
  }
  const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");
  if (hash !== signature) {
    return json({ error: "Invalid signature" }, { status: 401 });
  }
  const event = JSON.parse(body);
  switch (event.event) {
    case "charge.success": {
      const data = event.data;
      const userId = data.metadata?.userId;
      if (!userId) break;
      await db.update(paystackSubscriptions).set({ status: "active", updatedAt: /* @__PURE__ */ new Date() }).where(eq(paystackSubscriptions.userId, userId));
      break;
    }
    case "subscription.disable": {
      const data = event.data;
      await db.update(paystackSubscriptions).set({ status: "cancelled", cancelledAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq(paystackSubscriptions.paystackSubscriptionCode, data.subscription_code));
      break;
    }
    case "invoice.payment_failed": {
      const data = event.data;
      await db.update(paystackSubscriptions).set({ status: "paused", updatedAt: /* @__PURE__ */ new Date() }).where(eq(paystackSubscriptions.paystackSubscriptionCode, data.subscription.subscription_code));
      break;
    }
  }
  return json({ received: true });
};

export { POST };
//# sourceMappingURL=_server.ts-fPrDXpQf.js.map
