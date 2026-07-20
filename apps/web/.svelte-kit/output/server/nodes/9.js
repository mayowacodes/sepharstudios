import * as server from '../entries/pages/(web3)/_layout.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(web3)/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/(web3)/+layout.server.ts";
export const imports = ["_app/immutable/nodes/9.DMt9E11m.js","_app/immutable/chunks/kNaey6uv.js","_app/immutable/chunks/s06JaHMU.js","_app/immutable/chunks/-c01j_DQ.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/9.tLQ6TuLX.css"];
export const fonts = [];
