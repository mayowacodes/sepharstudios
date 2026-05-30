import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { m as mediaCardColumns } from './projections-BHErtuYo.js';
import { and, eq, ne } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/(app)/movies/+page.server.ts
var load = async () => {
	try {
		return { movies: await db.select(mediaCardColumns).from(mediaLibrary).where(and(eq(mediaLibrary.mediaType, "movie"), eq(mediaLibrary.isActive, true), ne(mediaLibrary.category, "kids"), ne(mediaLibrary.category, "teens"))) };
	} catch (e) {
		console.error("Failed to load movies:", e?.message || e);
		if (e?.cause) console.error("Cause:", e.cause);
		if (e?.stack) console.error("Stack:", e.stack?.split("\n").slice(0, 5).join("\n"));
		return { movies: [] };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 52;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Fgf8pqP2.js')).default;
const server_id = "src/routes/(app)/movies/+page.server.ts";
const imports = ["_app/immutable/nodes/52.D4wm9sou.js","_app/immutable/chunks/BNDxLlt5.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/DDtEHMmn.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DRN2iH4Q.js","_app/immutable/chunks/C62WXae12.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/BIvOMb_B.js","_app/immutable/chunks/D3wrU__d2.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=52-DaxHkhfe.js.map
