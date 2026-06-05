import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { and, eq, desc } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/(app)/browse/+page.server.ts
var load = async () => {
	try {
		return {
			shows: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "show"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			movies: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			documentaries: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "documentary"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10)
		};
	} catch (error) {
		console.error("Browse page load failed:", error);
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

const index = 49;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CGRnaqfa.js')).default;
const server_id = "src/routes/(app)/browse/+page.server.ts";
const imports = ["_app/immutable/nodes/49.ClIwWqT0.js","_app/immutable/chunks/5yOrK39y.js","_app/immutable/chunks/BO1aleC0.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/B8lZO5gc.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/CpMAVUI4.js","_app/immutable/chunks/B3AYJye92.js","_app/immutable/chunks/ksrgpQJr.js","_app/immutable/chunks/WIVOej1P.js","_app/immutable/chunks/C9Hg4rJI2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=49-CxfaNj9o.js.map
