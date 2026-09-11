import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.BGfdqDT4.js","_app/immutable/chunks/QTnfLwEv.js","_app/immutable/chunks/BsVwIFTV.js","_app/immutable/chunks/DOVwZL-N.js","_app/immutable/chunks/Bin8K3vy.js","_app/immutable/chunks/BuFlayix.js","_app/immutable/chunks/DA_W6qOS.js","_app/immutable/chunks/CVvb29p6.js","_app/immutable/chunks/DRUPmJi1.js","_app/immutable/chunks/B3nkk3ZW2.js","_app/immutable/chunks/HuCy9WZI.js","_app/immutable/chunks/CyXjWlT9.js","_app/immutable/chunks/D-hotoLu.js","_app/immutable/chunks/f3MSlbhE2.js","_app/immutable/chunks/BveA2u-e2.js","_app/immutable/chunks/Bm_L5_zK2.js","_app/immutable/chunks/CIT8kfMd.js","_app/immutable/chunks/Bc9cMxm7.js","_app/immutable/chunks/BWkGkCHl2.js","_app/immutable/chunks/BIatSNj92.js","_app/immutable/chunks/Bh1jI0ca.js","_app/immutable/chunks/CL_HWHFc2.js","_app/immutable/chunks/jz5m4ZJj2.js","_app/immutable/chunks/PIDQPO3q2.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css","_app/immutable/assets/PWAInstallPrompt.Cw6HcEey.css","_app/immutable/assets/0.BK5z3ecK.css","_app/immutable/assets/app.BxdWYkJq.css"];
export const fonts = [];
