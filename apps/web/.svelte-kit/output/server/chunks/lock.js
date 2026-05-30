import { yt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/lock.svelte
function Lock($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "lock" },
		props,
		{ iconNode: [["rect", {
			"width": "18",
			"height": "11",
			"x": "3",
			"y": "11",
			"rx": "2",
			"ry": "2"
		}], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]] }
	]));
}
//#endregion
export { Lock as t };
