import { n as db, B as mediaLibrary } from './drizzle-BjmsPAPl.js';
import { and, eq } from 'drizzle-orm';
import './rolldown-runtime-pTpnEGsq.js';
import './shared-server-DUDL94jl.js';
import 'drizzle-orm/postgres-js';
import 'postgres';
import 'drizzle-orm/pg-core';

//#region src/routes/kids/kiddies/+page.server.ts
var load = async () => {
	try {
		return { content: await db.select().from(mediaLibrary).where(and(eq(mediaLibrary.category, "kids"), eq(mediaLibrary.isActive, true))) };
	} catch (e) {
		console.error("Failed to load kiddies content", e);
		return { content: [] };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 103;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-CiWS4xzv.js')).default;
const server_id = "src/routes/kids/kiddies/+page.server.ts";
const imports = ["_app/immutable/nodes/103.CsdUurbd.js","_app/immutable/chunks/XW-9zQ9n.js","_app/immutable/chunks/BNDxLlt5.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/DDtEHMmn.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DRN2iH4Q.js","_app/immutable/chunks/C62WXae12.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=103-kGelNAKr.js.map
