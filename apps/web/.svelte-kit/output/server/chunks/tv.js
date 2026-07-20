import { jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/tv.svelte
function Tv($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "tv" },
		props,
		{ iconNode: [["path", { "d": "m17 2-5 5-5-5" }], ["rect", {
			"width": "20",
			"height": "15",
			"x": "2",
			"y": "7",
			"rx": "2"
		}]] }
	]));
}
//#endregion
export { Tv as t };
