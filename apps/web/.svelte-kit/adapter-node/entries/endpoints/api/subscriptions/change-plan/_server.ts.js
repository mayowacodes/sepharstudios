import { json } from "@sveltejs/kit";
import { d as db, i as paystackSubscriptions } from "../../../../../chunks/drizzle.js";
import { eq, desc } from "drizzle-orm";
import { P as PLAN_PRICES_CENTS } from "../../../../../chunks/paystack.js";
const VALID_PLANS = /* @__PURE__ */ new Set(["basic", "premium", "creator"]);
const POST = async ({ locals, request }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { plan } = await request.json();
  if (!plan || !VALID_PLANS.has(plan)) {
    return json({ error: "Invalid plan" }, { status: 400 });
  }
  const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
  if (!sub || !["trial", "active"].includes(sub.status ?? "")) {
    return json({ error: "No active subscription to change" }, { status: 404 });
  }
  if (sub.plan === plan) {
    return json({ error: `You are already on the ${plan} plan` }, { status: 409 });
  }
  await db.update(paystackSubscriptions).set({
    plan,
    updatedAt: /* @__PURE__ */ new Date()
  }).where(eq(paystackSubscriptions.id, sub.id));
  return json({
    success: true,
    plan,
    monthlyPriceCents: PLAN_PRICES_CENTS[plan],
    effective: "next_billing_cycle"
  });
};
export {
  POST
};
