import * as server from '../entries/pages/watch/_id_/_page.server.ts.js';

export const index = 98;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/watch/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/watch/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/98.tdqXKl6u.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/Cp2x8l1r.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
export const fonts = [];
