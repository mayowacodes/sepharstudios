import * as server from '../entries/pages/watch/_id_/_page.server.ts.js';

export const index = 110;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/watch/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/watch/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/110.BEVMdINL.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/82XWPh1s.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/QvtZIkiR.js","_app/immutable/chunks/SDVjwcu-.js","_app/immutable/chunks/CkPKcep_2.js","_app/immutable/chunks/BQYPg9Bi2.js","_app/immutable/chunks/CehpPB2E2.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/DJeEVz6c.js","_app/immutable/chunks/JP0VO0aB.js","_app/immutable/chunks/BJK24hT9.js","_app/immutable/chunks/A7Vb2tMq.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
