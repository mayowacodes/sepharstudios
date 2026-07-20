import { Tt as bind_props, Ut as clsx, wt as attributes } from "./ui-libs.js";
import { t as cn } from "./utils2.js";
//#region src/lib/components/ui/skeleton/skeleton.svelte
function Skeleton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "skeleton",
			class: clsx(cn("portal-skeleton rounded-md", className)),
			...restProps
		}, "svelte-18guw72")}></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
export { Skeleton as t };
