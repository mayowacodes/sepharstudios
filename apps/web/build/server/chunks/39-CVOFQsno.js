import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
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

const index = 39;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DWwWA3TV.js')).default;
const server_id = "src/routes/(app)/browse/+page.server.ts";
const imports = ["_app/immutable/nodes/39.B_vKKfcL.js","_app/immutable/chunks/XW-9zQ9n.js","_app/immutable/chunks/BNDxLlt5.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/DDtEHMmn.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DRN2iH4Q.js","_app/immutable/chunks/C62WXae12.js","_app/immutable/chunks/C7Jcj1hB.js","_app/immutable/chunks/nBlad11C.js","_app/immutable/chunks/C9Hg4rJI2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=39-CVOFQsno.js.map
