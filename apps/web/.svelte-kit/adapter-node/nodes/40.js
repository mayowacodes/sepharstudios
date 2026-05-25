import * as server from '../entries/pages/(app)/documentaries/_page.server.ts.js';

export const index = 40;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/documentaries/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/documentaries/+page.server.ts";
export const imports = ["_app/immutable/nodes/40.k4c9x3_j.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/DFj_1Ztd.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/aVfC764u.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/BqqE9v9i.js","_app/immutable/chunks/D8cC8Ip7.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/CTZ0jGgp.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
export const fonts = [];
