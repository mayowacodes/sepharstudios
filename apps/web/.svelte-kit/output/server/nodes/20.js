import * as server from '../entries/pages/(admin)/admin/dashboard/_page.server.ts.js';

export const index = 20;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(admin)/admin/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(admin)/admin/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/20.gvSNv1vA.js","_app/immutable/chunks/DhU7OF18.js","_app/immutable/chunks/s06JaHMU.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/zgc81Jtu.js","_app/immutable/chunks/D80l4zCt.js","_app/immutable/chunks/BLxXymMl2.js","_app/immutable/chunks/XEjqrvqO2.js","_app/immutable/chunks/BNkz-vVe.js","_app/immutable/chunks/DWPaeh8t.js","_app/immutable/chunks/C8O-dUT5.js","_app/immutable/chunks/BHQAf7WE2.js","_app/immutable/chunks/BizVcGNe.js","_app/immutable/chunks/DytKhMs5.js","_app/immutable/chunks/DAT0U2Za.js","_app/immutable/chunks/CuuMq4O2.js","_app/immutable/chunks/C2rSzT-p2.js","_app/immutable/chunks/CZSs2JHk2.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/20.COX9OWLn.css"];
export const fonts = [];
