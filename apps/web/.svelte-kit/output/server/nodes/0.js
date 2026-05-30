import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CNBZB6Fv.js","_app/immutable/chunks/82XWPh1s.js","_app/immutable/chunks/BgHc62fs.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/FqtpMiZa.js","_app/immutable/chunks/QvtZIkiR.js","_app/immutable/chunks/SDVjwcu-.js","_app/immutable/chunks/CkPKcep_2.js","_app/immutable/chunks/BQYPg9Bi2.js","_app/immutable/chunks/JzLYpYNz2.js","_app/immutable/chunks/CLamccOh.js","_app/immutable/chunks/DZEuVi262.js","_app/immutable/chunks/B-hbAyTs2.js","_app/immutable/chunks/CehpPB2E2.js","_app/immutable/chunks/Cj9sdKvC.js","_app/immutable/chunks/D3wrU__d2.js","_app/immutable/chunks/A7Vb2tMq.js","_app/immutable/chunks/DD3oU49q.js","_app/immutable/chunks/CYoPNDXM.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/PWAInstallPrompt.Cw6HcEey.css","_app/immutable/assets/0.CNo69J0V.css","_app/immutable/assets/app.Svhq_xni.css"];
export const fonts = [];
