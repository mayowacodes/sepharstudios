import { aO as spread_props } from './ui-libs-BjzLDLAh.js';
import { I as Icon } from './Icon-CM89Lxh4.js';

//#region ../../node_modules/@lucide/svelte/dist/icons/smartphone.svelte
function Smartphone($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "smartphone" },
		props,
		{ iconNode: [["rect", {
			"width": "14",
			"height": "20",
			"x": "5",
			"y": "2",
			"rx": "2",
			"ry": "2"
		}], ["path", { "d": "M12 18h.01" }]] }
	]));
}

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

export { Smartphone as S, Tablet as T };
//# sourceMappingURL=tablet-C6bv4mAi.js.map
