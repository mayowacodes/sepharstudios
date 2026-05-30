import * as server from '../entries/pages/(app)/sponsorships/_page.server.ts.js';

export const index = 60;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/sponsorships/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/sponsorships/+page.server.ts";
export const imports = ["_app/immutable/nodes/60.CHQYdITB.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/CFVmnJei2.js","_app/immutable/chunks/ClqGSka_2.js","_app/immutable/chunks/D8e-wLbb2.js","_app/immutable/chunks/BSFXd-fp.js","_app/immutable/chunks/B-hbAyTs2.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DXFs0FbB2.js","_app/immutable/chunks/Dg9nBQ42.js","_app/immutable/chunks/DJeEVz6c.js","_app/immutable/chunks/lQ-lZmSf.js","_app/immutable/chunks/BjlaZt9k.js","_app/immutable/chunks/CbnapNxy.js","_app/immutable/chunks/C62WXae12.js","_app/immutable/chunks/C9Hg4rJI2.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
