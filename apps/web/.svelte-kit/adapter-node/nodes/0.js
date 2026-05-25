import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CtSIAosB.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/DulpkoeT.js","_app/immutable/chunks/C6RMN0iQ.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/BH2yH8Hf.js","_app/immutable/chunks/Bk_MNpG0.js","_app/immutable/chunks/qdopO_8X.js","_app/immutable/chunks/BYjb41BY.js","_app/immutable/chunks/Dgq_wHBJ.js","_app/immutable/chunks/Cpn5kCmN.js","_app/immutable/chunks/a6Hysjkp.js","_app/immutable/chunks/BsR08jWl.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css","_app/immutable/assets/PWAInstallPrompt.DWaE0Rvy.css","_app/immutable/assets/0.CGjUMvCg.css","_app/immutable/assets/app.B-WN2yld.css"];
export const fonts = [];
