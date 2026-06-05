import { Dt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/archive.svelte
function Archive($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "archive" },
		props,
		{ iconNode: [
			["rect", {
				"width": "20",
				"height": "5",
				"x": "2",
				"y": "3",
				"rx": "1"
			}],
			["path", { "d": "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
			["path", { "d": "M10 12h4" }]
		] }
	]));
}
//#endregion
export { Archive as t };
