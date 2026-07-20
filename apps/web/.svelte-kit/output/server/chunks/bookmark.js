import { jt as spread_props } from "./ui-libs.js";
import { t as Icon } from "./Icon.js";
//#region ../../node_modules/@lucide/svelte/dist/icons/bookmark-check.svelte
function Bookmark_check($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "bookmark-check" },
		props,
		{ iconNode: [["path", { "d": "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" }], ["path", { "d": "m9 10 2 2 4-4" }]] }
	]));
}
//#endregion
//#region ../../node_modules/@lucide/svelte/dist/icons/bookmark.svelte
function Bookmark($$renderer, $$props) {
	let { $$slots, $$events, ...props } = $$props;
	Icon($$renderer, spread_props([
		{ name: "bookmark" },
		props,
		{ iconNode: [["path", { "d": "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" }]] }
	]));
}
//#endregion
export { Bookmark_check as n, Bookmark as t };
