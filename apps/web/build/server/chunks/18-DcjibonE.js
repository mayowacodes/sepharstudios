import { n as db, a0 as user, U as session } from './drizzle-BjmsPAPl.js';
import { e as error } from './index-5kYmxIr9.js';
import { eq, sql, count } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';
import './index-DBqjc0Yf.js';

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

const index = 18;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-0uejrpeB.js')).default;
const server_id = "src/routes/(admin)/admin/dashboard/+page.server.ts";
const imports = ["_app/immutable/nodes/18.RIPZZixZ.js","_app/immutable/chunks/DE6Vj2l8.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/CBGNjHFS.js","_app/immutable/chunks/D1qDYvHw.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/C3nRzqzI.js","_app/immutable/chunks/BISccKai.js","_app/immutable/chunks/D7jUrGVk.js","_app/immutable/chunks/DZEuVi262.js","_app/immutable/chunks/BQYPg9Bi2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/18.COX9OWLn.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-DcjibonE.js.map
