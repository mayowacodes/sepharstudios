import { j as json } from './index-BcOZ6EV9.js';
import { d as db, r as paystackSubscriptions } from './drizzle-CW7hPjGG.js';
import { eq, desc } from 'drizzle-orm';
import { b as sendCancellationConfirmation } from './notifications-Bgqx6FUT.js';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import './server-nMhuZPcS.js';

const POST = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const [sub] = await db.select().from(paystackSubscriptions).where(eq(paystackSubscriptions.userId, session.user.id)).orderBy(desc(paystackSubscriptions.createdAt)).limit(1);
  if (!sub) return json({ error: "No active subscription" }, { status: 404 });
  await db.update(paystackSubscriptions).set({ status: "cancelled", cancelledAt: /* @__PURE__ */ new Date(), updatedAt: /* @__PURE__ */ new Date() }).where(eq(paystackSubscriptions.id, sub.id));
  const accessUntil = sub.trialEndDate ?? sub.currentPeriodEnd ?? /* @__PURE__ */ new Date();
  await sendCancellationConfirmation(session.user.email, session.user.name, accessUntil);
  return json({ success: true, accessUntil });
};

export { POST };
//# sourceMappingURL=_server.ts-BHzgjnjj.js.map
