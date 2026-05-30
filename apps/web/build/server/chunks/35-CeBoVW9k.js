import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
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
			shows: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "show"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
			movies: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.isActive, true))).orderBy(desc(mediaLibrary.createdAt)).limit(10),
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

const index = 35;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-DWlT_Zp6.js')).default;
const server_id = "src/routes/(app)/+page.server.ts";
const imports = ["_app/immutable/nodes/35.Cxwde6EH.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/XW-9zQ9n.js","_app/immutable/chunks/BNDxLlt5.js","_app/immutable/chunks/DDtEHMmn.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DRN2iH4Q.js","_app/immutable/chunks/C62WXae12.js","_app/immutable/chunks/82XWPh1s.js","_app/immutable/chunks/QvtZIkiR.js","_app/immutable/chunks/SDVjwcu-.js","_app/immutable/chunks/CkPKcep_2.js","_app/immutable/chunks/BQYPg9Bi2.js","_app/immutable/chunks/C7Jcj1hB.js","_app/immutable/chunks/nBlad11C.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/BIvOMb_B.js","_app/immutable/chunks/BmCcR3tb.js","_app/immutable/chunks/CndME5cl.js","_app/immutable/chunks/tfBWhTdt.js","_app/immutable/chunks/JP0VO0aB.js","_app/immutable/chunks/CAXe3h9n2.js","_app/immutable/chunks/B7zz7ItD2.js","_app/immutable/chunks/B-hbAyTs2.js","_app/immutable/chunks/wATHbqUL2.js","_app/immutable/chunks/D3wrU__d2.js","_app/immutable/chunks/C9Hg4rJI2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/35.CGSypq3K.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=35-CeBoVW9k.js.map
