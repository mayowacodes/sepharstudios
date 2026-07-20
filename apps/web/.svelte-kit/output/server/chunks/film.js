import { jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/film.svelte
function Film($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "film" },
		props,
		{ iconNode: [
			["rect", {
				"width": "18",
				"height": "18",
				"x": "3",
				"y": "3",
				"rx": "2"
			}],
			["path", { "d": "M7 3v18" }],
			["path", { "d": "M3 7.5h4" }],
			["path", { "d": "M3 12h18" }],
			["path", { "d": "M3 16.5h4" }],
			["path", { "d": "M17 3v18" }],
			["path", { "d": "M17 7.5h4" }],
			["path", { "d": "M17 16.5h4" }]
		] }
	]));
}
//#endregion
export { Film as t };
