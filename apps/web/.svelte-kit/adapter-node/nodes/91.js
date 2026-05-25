import * as server from '../entries/pages/kids/kiddies/_page.server.ts.js';

export const index = 91;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/kids/kiddies/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/kids/kiddies/+page.server.ts";
export const imports = ["_app/immutable/nodes/91.DJM-g5mC.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/B09jOzlm.js","_app/immutable/chunks/CK77ZMFc.js","_app/immutable/chunks/_r6ywi_I.js","_app/immutable/chunks/aVfC764u.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/BqqE9v9i.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
export const fonts = [];
