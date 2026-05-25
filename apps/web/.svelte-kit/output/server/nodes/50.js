

export const index = 50;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/press/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/50.j_LX_gKd.js","_app/immutable/chunks/Dm3kmBgO.js"];
export const stylesheets = ["_app/immutable/assets/ui-libs.BmaF0Alh.css"];
export const fonts = [];
