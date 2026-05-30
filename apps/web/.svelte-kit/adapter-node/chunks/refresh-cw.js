import { yt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/refresh-cw.svelte
function Refresh_cw($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "refresh-cw" },
		props,
		{ iconNode: [
			["path", { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
			["path", { "d": "M21 3v5h-5" }],
			["path", { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
			["path", { "d": "M8 16H3v5" }]
		] }
	]));
}
//#endregion
export { Refresh_cw as t };
