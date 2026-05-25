import { j as json } from './index-BcOZ6EV9.js';
import { d as db, E as profiles } from './drizzle-CW7hPjGG.js';
import { and, eq } from 'drizzle-orm';
import './utils-FiC4zhrQ.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';

const PUT = async ({ params, request, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const { name, avatarColor, avatarEmoji, contentRating, safeModeEnabled } = await request.json();
  const [updated] = await db.update(profiles).set({ name, avatarColor, avatarEmoji, contentRating, safeModeEnabled, updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(profiles.id, params.id), eq(profiles.userId, session.user.id))).returning();
  if (!updated) return json({ error: "Not found" }, { status: 404 });
  return json(updated);
};
const DELETE = async ({ params, locals }) => {
  const session = await locals.auth.getSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  await db.delete(profiles).where(and(eq(profiles.id, params.id), eq(profiles.userId, session.user.id)));
  return json({ success: true });
};

export { DELETE, PUT };
//# sourceMappingURL=_server.ts-Cq8oa31V.js.map
