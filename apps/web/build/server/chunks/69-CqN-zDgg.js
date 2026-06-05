import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { m as mediaCardColumns } from './projections-B5XfbV-n.js';
import { f as faithTVShows } from './shows-CM5HuZnq.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/(app)/shows/+page.server.ts
var load = async () => {
	try {
		return { shows: await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "show"), eq(mediaLibrary.isActive, true))) };
	} catch (error) {
		console.error("Shows load failed, using fallback data:", error);
		return { shows: faithTVShows };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 69;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BqdIsGoe.js')).default;
const server_id = "src/routes/(app)/shows/+page.server.ts";
const imports = ["_app/immutable/nodes/69.BTJHgXRd.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/B8lZO5gc.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/BpIG8Ix6.js","_app/immutable/chunks/CpMAVUI4.js","_app/immutable/chunks/B3AYJye92.js","_app/immutable/chunks/CO5m0ek1.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=69-CqN-zDgg.js.map
