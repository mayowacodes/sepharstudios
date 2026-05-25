import { j as json } from './index-BcOZ6EV9.js';
import { d as db, r as paystackSubscriptions, G as familyAddons } from './drizzle-CW7hPjGG.js';
import { eq, desc } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const GET = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
  if (!sub) {
    return json({ hasSubscription: false, plan: null, status: null });
  }
  const [addon] = await db.select().from(familyAddons).where(eq(familyAddons.userId, session.user.id)).limit(1);
  const now = /* @__PURE__ */ new Date();
  const trialDaysLeft = sub.trialEndDate ? Math.max(0, Math.ceil((new Date(sub.trialEndDate).getTime() - now.getTime()) / 864e5)) : null;
  return json({
    hasSubscription: true,
    plan: sub.plan,
    status: sub.status,
    isTrial: sub.status === "trial",
    trialEndDate: sub.trialEndDate,
    trialDaysLeft,
    currentPeriodEnd: sub.currentPeriodEnd,
    hasFamilyAddon: !!addon && addon.status === "active",
    maxProfiles: addon?.status === "active" ? addon.maxProfiles ?? 8 : 2
  });
};

export { GET };
//# sourceMappingURL=_server.ts-Cwlc8j3X.js.map
