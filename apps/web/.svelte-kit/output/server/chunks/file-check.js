import { jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/file-check.svelte
function File_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "file-check" },
		props,
		{ iconNode: [
			["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }],
			["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
			["path", { "d": "m9 15 2 2 4-4" }]
		] }
	]));
}
//#endregion
export { File_check as t };
