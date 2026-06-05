import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/kids/teens/+page.server.ts
var load = async () => {
	try {
		return { content: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.category, "teens"), eq(mediaLibrary.isActive, true))) };
	} catch (e) {
		console.error("Failed to load teens content", e);
		return { content: [] };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 125;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-KYUS3l3f.js')).default;
const server_id = "src/routes/kids/teens/+page.server.ts";
const imports = ["_app/immutable/nodes/125.Cpammi2k.js","_app/immutable/chunks/5yOrK39y.js","_app/immutable/chunks/BO1aleC0.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/B8lZO5gc.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/CpMAVUI4.js","_app/immutable/chunks/B3AYJye92.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/125.Brez6pGR.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=125-DtdrEa3M.js.map
