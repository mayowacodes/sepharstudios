import { d as db, s as session, c as user } from './drizzle-CW7hPjGG.js';
import { e as error } from './index-BcOZ6EV9.js';
import { count, eq, sql } from 'drizzle-orm';
import 'drizzle-orm/postgres-js';
import 'postgres';
import './shared-server-BeisX7n9.js';
import 'drizzle-orm/pg-core';
import './utils-FiC4zhrQ.js';

const load = async ({ locals }) => {
  if (!locals.user || locals.user.role !== "admin") {
    throw error(403, "Forbidden");
  }
  const deviceStats = await db.select({
    deviceType: session.deviceType,
    count: count()
  }).from(session).groupBy(session.deviceType);
  const recentSessions = await db.select({
    id: session.id,
    userAgent: session.userAgent,
    deviceType: session.deviceType,
    ipAddress: session.ipAddress,
    createdAt: session.createdAt,
    userName: user.name,
    userEmail: user.email
  }).from(session).innerJoin(user, eq(session.userId, user.id)).orderBy(sql`${session.createdAt} DESC`).limit(10);
  return {
    deviceStats,
    recentSessions
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-utKFqCke.js')).default;
const server_id = "src/routes/(admin)/admin/dashboard/+page.server.ts";
const imports = ["_app/immutable/nodes/16.CEKuMJ56.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/DT8gsAiO.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/DohTB1ky.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/DdimEvq8.js","_app/immutable/chunks/BA8yylpa.js","_app/immutable/chunks/Bk_MNpG0.js","_app/immutable/chunks/DOh2A7rD.js","_app/immutable/chunks/Cpn5kCmN.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css","_app/immutable/assets/16.DXLEA_8O.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-D8IjOvmQ.js.map
