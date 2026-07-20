import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.CNb7fblb.js","_app/immutable/chunks/Bb0m7NVN.js","_app/immutable/chunks/s06JaHMU.js","_app/immutable/chunks/-c01j_DQ.js","_app/immutable/chunks/VMPOMPa52.js","_app/immutable/chunks/C8O-dUT5.js","_app/immutable/chunks/DQxXU2zO.js","_app/immutable/chunks/DQiQp1F0.js","_app/immutable/chunks/CRufBKpF2.js","_app/immutable/chunks/CZSs2JHk2.js","_app/immutable/chunks/BZ1xlci62.js","_app/immutable/chunks/DagUrq742.js","_app/immutable/chunks/DAT0U2Za.js","_app/immutable/chunks/Dv8dP52O2.js","_app/immutable/chunks/ClMKaqNa2.js","_app/immutable/chunks/CbTZKJ_u.js","_app/immutable/chunks/DlRKhlfN2.js","_app/immutable/chunks/BeTSnelp2.js","_app/immutable/chunks/BUTViEfE.js","_app/immutable/chunks/CWH0nVcy.js","_app/immutable/chunks/BSfoyFaD.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/PWAInstallPrompt.Cw6HcEey.css","_app/immutable/assets/0.CNo69J0V.css","_app/immutable/assets/app.D8bi1IzS.css"];
export const fonts = [];
