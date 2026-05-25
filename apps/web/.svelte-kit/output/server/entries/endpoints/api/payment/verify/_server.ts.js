import { json } from "@sveltejs/kit";
import { v as verifyTransaction } from "../../../../../chunks/paystack.js";
import { d as db, z as trialBlacklist, i as paystackSubscriptions, A as familyAddons, n as notificationPreferences } from "../../../../../chunks/drizzle.js";
import { eq } from "drizzle-orm";
import { a as sendTrialWelcome } from "../../../../../chunks/notifications.js";
const GET = async ({ url, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref");
  if (!reference) return json({ error: "Missing reference" }, { status: 400 });
  try {
    const tx = await verifyTransaction(reference);
    if (tx.status !== "success") {
      return json({ error: "Payment not successful" }, { status: 402 });
    }
    const meta = tx;
    const { plan, addFamily, isTrial } = meta.metadata;
    const userId = session.user.id;
    const cardSig = tx.authorization?.signature;
    if (cardSig && isTrial) {
      const blocked = await db.select().from(trialBlacklist).where(eq(trialBlacklist.cardSignature, cardSig)).limit(1);
      if (blocked.length > 0) {
        return json({ error: "This payment method has already been used for a free trial." }, { status: 409 });
      }
    }
    const now = /* @__PURE__ */ new Date();
    const trialEnd = new Date(now);
    trialEnd.setMonth(trialEnd.getMonth() + 3);
    const [sub] = await db.insert(paystackSubscriptions).values({
      userId,
      plan,
      status: isTrial ? "trial" : "active",
      trialStartDate: isTrial ? now : null,
      trialEndDate: isTrial ? trialEnd : null,
      currentPeriodStart: now,
      currentPeriodEnd: isTrial ? trialEnd : new Date(now.setMonth(now.getMonth() + 1)),
      paystackCustomerCode: tx.customer?.customer_code,
      paystackAuthorizationCode: tx.authorization?.authorization_code,
      cardSignature: cardSig,
      cardLast4: tx.authorization?.last4,
      cardBrand: tx.authorization?.brand
    }).returning();
    if (addFamily && sub) {
      await db.insert(familyAddons).values({
        subscriptionId: sub.id,
        userId,
        paystackAuthorizationCode: tx.authorization?.authorization_code
      });
    }
    if (cardSig && isTrial) {
      await db.insert(trialBlacklist).values({
        cardSignature: cardSig,
        reason: `trial_started_by_${userId}`
      });
    }
    await db.insert(notificationPreferences).values({ userId }).onConflictDoNothing();
    await sendTrialWelcome(session.user.email, session.user.name, plan, trialEnd);
    return json({ success: true, plan, trialEndDate: trialEnd });
  } catch (err) {
    console.error("Payment verify error:", err);
    return json({ error: "Verification failed" }, { status: 500 });
  }
};
export {
  GET
};
