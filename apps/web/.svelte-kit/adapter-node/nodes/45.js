import * as server from '../entries/pages/(app)/documentaries/_page.server.ts.js';

export const index = 45;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/documentaries/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/documentaries/+page.server.ts";
export const imports = ["_app/immutable/nodes/45.jiriIHZC.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/DDtEHMmn.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/BIvOMb_B.js","_app/immutable/chunks/DRN2iH4Q.js","_app/immutable/chunks/C62WXae12.js","_app/immutable/chunks/D3wrU__d2.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
