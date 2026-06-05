import { w as db, ag as user, a5 as session } from './drizzle-CKUH7ukq.js';
import { e as error } from './index-Cv5VcsYq.js';
import { eq, sql, count } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';
import './utils-BAX50FA_.js';

//#region src/routes/(admin)/admin/dashboard/+page.server.ts
var load = async ({ locals }) => {
	if (!locals.user || locals.user.role !== "admin") throw error(403, "Forbidden");
	return {
		deviceStats: await db.select({
			deviceType: session.deviceType,
			count: count()
		}).from(session).groupBy(session.deviceType),
		recentSessions: await db.select({
			id: session.id,
			userAgent: session.userAgent,
			deviceType: session.deviceType,
			ipAddress: session.ipAddress,
			createdAt: session.createdAt,
			userName: user.name,
			userEmail: user.email
		}).from(session).innerJoin(user, eq(session.userId, user.id)).orderBy(sql`${session.createdAt} DESC`).limit(10)
	};
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 20;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BX8qHfmD.js')).default;
const server_id = "src/routes/(admin)/admin/dashboard/+page.server.ts";
const imports = ["_app/immutable/nodes/20.Cc50VPBh.js","_app/immutable/chunks/ClbVkl6_2.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/CnWGCCQr.js","_app/immutable/chunks/CdtIMIMZ2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/wL7JZQdi2.js","_app/immutable/chunks/BkC0Yiin.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/cb_S8grP2.js","_app/immutable/chunks/Cdksh5u5.js","_app/immutable/chunks/DTlEOWIm.js","_app/immutable/chunks/C_jsyxKw.js","_app/immutable/chunks/xxV29a9x.js","_app/immutable/chunks/Bhl5hNRt.js","_app/immutable/chunks/GKWuiuOh.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/20.COX9OWLn.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=20-2dlEust_.js.map
