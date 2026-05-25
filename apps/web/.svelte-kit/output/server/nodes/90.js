

export const index = 90;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(web3)/wallet/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/90.CSw8XLeb.js","_app/immutable/chunks/Dm3kmBgO.js","_app/immutable/chunks/B162LzS4.js","_app/immutable/chunks/ZIwaknx8.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/xgKUVLrI.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
export const fonts = [];
