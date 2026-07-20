import { jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/tablet.svelte
function Tablet($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "tablet" },
		props,
		{ iconNode: [["rect", {
			"width": "16",
			"height": "20",
			"x": "4",
			"y": "2",
			"rx": "2",
			"ry": "2"
		}], ["line", {
			"x1": "12",
			"x2": "12.01",
			"y1": "18",
			"y2": "18"
		}]] }
	]));
}
//#endregion
export { Tablet as t };
