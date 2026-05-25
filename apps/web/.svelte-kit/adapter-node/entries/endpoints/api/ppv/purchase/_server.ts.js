import { json } from "@sveltejs/kit";
import { d as db, p as ppvContent, j as ppvPurchases, i as paystackSubscriptions } from "../../../../../chunks/drizzle.js";
import { and, eq, desc } from "drizzle-orm";
import { i as initializeTransaction } from "../../../../../chunks/paystack.js";
import { p as private_env } from "../../../../../chunks/shared-server.js";
const POST = async ({ request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { contentId } = await request.json();
  const userId = session.user.id;
  const [ppv] = await db.select().from(ppvContent).where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true))).limit(1);
  if (!ppv) return json({ error: "Content is not PPV" }, { status: 400 });
  const [existing] = await db.select().from(ppvPurchases).where(and(eq(ppvPurchases.userId, userId), eq(ppvPurchases.contentId, contentId))).limit(1);
  if (existing) return json({ error: "Already purchased" }, { status: 409 });
  try {
    const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, userId)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
    if (sub?.paystackAuthorizationCode) {
      const tx2 = await initializeTransaction({
        email: session.user.email,
        amountKobo: ppv.finalPriceCents,
        metadata: { userId, contentId, type: "ppv" }
      });
      return json({ authorizationUrl: tx2.authorization_url, reference: tx2.reference, priceCents: ppv.finalPriceCents });
    }
    const tx = await initializeTransaction({
      email: session.user.email,
      amountKobo: ppv.finalPriceCents,
      callbackUrl: `${private_env.PUBLIC_SITE_URL ?? "http://localhost:5173"}/api/ppv/complete`,
      metadata: { userId, contentId, type: "ppv" }
    });
    return json({ authorizationUrl: tx.authorization_url, reference: tx.reference, priceCents: ppv.finalPriceCents });
  } catch (err) {
    console.error("PPV purchase error:", err);
    return json({ error: "Payment initialization failed" }, { status: 500 });
  }
};
export {
  POST
};
