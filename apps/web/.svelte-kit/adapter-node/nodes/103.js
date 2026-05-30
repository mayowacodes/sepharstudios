import * as server from '../entries/pages/kids/kiddies/_page.server.ts.js';

export const index = 103;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/kids/kiddies/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/kids/kiddies/+page.server.ts";
export const imports = ["_app/immutable/nodes/103.CsdUurbd.js","_app/immutable/chunks/XW-9zQ9n.js","_app/immutable/chunks/BNDxLlt5.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/DDtEHMmn.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/DRN2iH4Q.js","_app/immutable/chunks/C62WXae12.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
