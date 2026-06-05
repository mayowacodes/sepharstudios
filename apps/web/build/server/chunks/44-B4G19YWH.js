import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { and, eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/(app)/+page.server.ts
var load = async () => {
	try {
		return {
			shows: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "show"), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			movies: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.isActive, true), eq(mediaLibrary.visibility, "public"))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			documentaries: []
		};
	} catch (error) {
		console.error("Homepage load failed, using fallback data:", error);
		return {
			shows: [],
			movies: [],
			documentaries: []
		};
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 44;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-BJ1vLtZx.js')).default;
const server_id = "src/routes/(app)/+page.server.ts";
const imports = ["_app/immutable/nodes/44.CiKxsVa3.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/5yOrK39y.js","_app/immutable/chunks/BO1aleC0.js","_app/immutable/chunks/B8lZO5gc.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/CpMAVUI4.js","_app/immutable/chunks/B3AYJye92.js","_app/immutable/chunks/DdntYR2r.js","_app/immutable/chunks/DbP8MhBG2.js","_app/immutable/chunks/DZXko5A82.js","_app/immutable/chunks/DQQV4u0O2.js","_app/immutable/chunks/BC4b7XLa.js","_app/immutable/chunks/GKWuiuOh.js","_app/immutable/chunks/ksrgpQJr.js","_app/immutable/chunks/WIVOej1P.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/BpIG8Ix6.js","_app/immutable/chunks/Br-4Pvvx2.js","_app/immutable/chunks/Bi5Z_0sk2.js","_app/immutable/chunks/DODF31ro2.js","_app/immutable/chunks/DrlkLnen2.js","_app/immutable/chunks/BWRTIYVB.js","_app/immutable/chunks/BEUU43kw.js","_app/immutable/chunks/QWdkadOk.js","_app/immutable/chunks/Dqag1JzJ.js","_app/immutable/chunks/CrES2T96.js","_app/immutable/chunks/CO5m0ek1.js","_app/immutable/chunks/C9Hg4rJI2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/44.CGSypq3K.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=44-B4G19YWH.js.map
