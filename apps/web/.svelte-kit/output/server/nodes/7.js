

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(web3)/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.BgNV2KLj.js","_app/immutable/chunks/PPVm8Dsz.js","_app/immutable/chunks/Dm3kmBgO.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css","_app/immutable/assets/7.32jdhMTg.css"];
export const fonts = [];
