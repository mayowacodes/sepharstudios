import * as server from '../entries/pages/(creator)/_layout.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(creator)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/6.C58vZVFN.js","_app/immutable/chunks/DDVVLm_82.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
