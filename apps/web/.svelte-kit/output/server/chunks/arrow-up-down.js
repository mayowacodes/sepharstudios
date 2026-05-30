import { yt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/arrow-up-down.svelte
function Arrow_up_down($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "arrow-up-down" },
		props,
		{ iconNode: [
			["path", { "d": "m21 16-4 4-4-4" }],
			["path", { "d": "M17 20V4" }],
			["path", { "d": "m3 8 4-4 4 4" }],
			["path", { "d": "M7 4v16" }]
		] }
	]));
}
//#endregion
export { Arrow_up_down as t };
