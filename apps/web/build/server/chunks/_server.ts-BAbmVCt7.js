import { j as json } from './index-BcOZ6EV9.js';
import { d as db, c as user } from './drizzle-CW7hPjGG.js';
import { eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const POST = async ({ locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const adminUser = await db.select({ role: user.role }).from(user).where(eq(user.id, session.user.id)).then((r) => r[0]);
  if (adminUser?.role !== "admin") return json({ error: "Forbidden" }, { status: 403 });
  return json({ success: true, message: "Test email queued" });
};

export { POST };
//# sourceMappingURL=_server.ts-BAbmVCt7.js.map
