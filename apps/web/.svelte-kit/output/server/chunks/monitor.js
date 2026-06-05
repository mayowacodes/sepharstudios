import { Dt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/monitor.svelte
function Monitor($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "monitor" },
		props,
		{ iconNode: [
			["rect", {
				"width": "20",
				"height": "14",
				"x": "2",
				"y": "3",
				"rx": "2"
			}],
			["line", {
				"x1": "8",
				"x2": "16",
				"y1": "21",
				"y2": "21"
			}],
			["line", {
				"x1": "12",
				"x2": "12",
				"y1": "17",
				"y2": "21"
			}]
		] }
	]));
}
//#endregion
export { Monitor as t };
