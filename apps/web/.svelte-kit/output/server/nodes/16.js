import * as server from '../entries/pages/(admin)/admin/dashboard/_page.server.ts.js';

export const index = 16;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/admin/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/admin/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/16.CEKuMJ56.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/DT8gsAiO.js","_app/immutable/chunks/CeyGdX2a.js","_app/immutable/chunks/xgKUVLrI.js","_app/immutable/chunks/DohTB1ky.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/DdimEvq8.js","_app/immutable/chunks/BA8yylpa.js","_app/immutable/chunks/Bk_MNpG0.js","_app/immutable/chunks/DOh2A7rD.js","_app/immutable/chunks/Cpn5kCmN.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css","_app/immutable/assets/16.DXLEA_8O.css"];
export const fonts = [];
