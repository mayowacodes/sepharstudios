

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.BvNeJv7M.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/DFj_1Ztd.js","_app/immutable/chunks/_r6ywi_I.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
export const fonts = [];
