import { w as db, M as mediaLibrary } from './drizzle-CKUH7ukq.js';
import { m as mediaCardColumns } from './projections-B5XfbV-n.js';
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
		const err = e instanceof Error ? e : null;
		console.error("Failed to load movies:", err?.message || e);
		if (err?.cause) console.error("Cause:", err.cause);
		if (err?.stack) console.error("Stack:", err.stack.split("\n").slice(0, 5).join("\n"));
		return { movies: [] };
	}
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	load: load
});

const index = 62;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-C0D8sjme.js')).default;
const server_id = "src/routes/(app)/movies/+page.server.ts";
const imports = ["_app/immutable/nodes/62.Dil0QcdU.js","_app/immutable/chunks/BO1aleC0.js","_app/immutable/chunks/BrQ41psm.js","_app/immutable/chunks/CocL4akC.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/BYLiR5YE.js","_app/immutable/chunks/B8lZO5gc.js","_app/immutable/chunks/j5L7JOaG.js","_app/immutable/chunks/CpMAVUI4.js","_app/immutable/chunks/B3AYJye92.js","_app/immutable/chunks/BSdbgJIN2.js","_app/immutable/chunks/Clnoo-nb2.js","_app/immutable/chunks/Cvt29zcG2.js","_app/immutable/chunks/BpIG8Ix6.js","_app/immutable/chunks/CO5m0ek1.js"];
const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=62-HO_ib9Da.js.map
