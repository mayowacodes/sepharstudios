

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(auth)/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DD6mT7y8.js","_app/immutable/chunks/s06JaHMU.js","_app/immutable/chunks/-c01j_DQ.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.C1tyNZCz.css"];
export const fonts = [];
