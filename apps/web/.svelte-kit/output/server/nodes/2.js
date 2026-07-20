import * as server from '../entries/pages/(admin)/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.CL7cltRl.js","_app/immutable/chunks/Ds0-DAlX2.js","_app/immutable/chunks/s06JaHMU.js","_app/immutable/chunks/-c01j_DQ.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
