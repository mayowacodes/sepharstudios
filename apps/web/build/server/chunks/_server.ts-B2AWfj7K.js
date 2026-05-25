import { j as json } from './index-BcOZ6EV9.js';
import { d as db, p as ppvContent, v as ppvPurchases, r as paystackSubscriptions } from './drizzle-CW7hPjGG.js';
import { and, eq, desc } from 'drizzle-orm';
import { i as initializeTransaction } from './paystack-BHqCqWrC.js';
import { p as private_env } from './shared-server-BeisX7n9.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

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

export { POST };
//# sourceMappingURL=_server.ts-B2AWfj7K.js.map
