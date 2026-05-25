import { j as json } from './index-BcOZ6EV9.js';
import { d as db, p as ppvContent, r as paystackSubscriptions, v as ppvPurchases } from './drizzle-CW7hPjGG.js';
import { and, eq, desc } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ params, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ canWatch: false, reason: "unauthenticated" });
  const contentId = params.contentId;
  const userId = session.user.id;
  const [ppv] = await db.select().from(ppvContent).where(and(eq(ppvContent.contentId, contentId), eq(ppvContent.isActive, true))).limit(1);
  if (!ppv) {
    const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, userId)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
    const hasActiveSub = sub && ["trial", "active"].includes(sub.status);
    return json({ canWatch: hasActiveSub, isPPV: false, reason: hasActiveSub ? "subscribed" : "no_subscription" });
  }
  const [purchase] = await db.select().from(ppvPurchases).where(and(eq(ppvPurchases.userId, userId), eq(ppvPurchases.contentId, contentId))).limit(1);
  if (purchase) {
    return json({ canWatch: true, isPPV: true, alreadyPurchased: true, priceCents: ppv.finalPriceCents });
  }
  return json({
    canWatch: false,
    isPPV: true,
    alreadyPurchased: false,
    priceCents: ppv.finalPriceCents,
    reason: "ppv_required"
  });
};

export { GET };
//# sourceMappingURL=_server.ts-BlRVTyTR.js.map
