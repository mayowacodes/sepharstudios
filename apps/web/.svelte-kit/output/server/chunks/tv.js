import { yt as spread_props } from "./ui-libs.js";
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
export { Tablet as n, Monitor as r, Tv as t };
