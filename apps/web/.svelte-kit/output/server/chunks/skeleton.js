import { Rt as clsx, bt as attributes, xt as bind_props } from "./ui-libs.js";
import { t as cn } from "./utils2.js";
//#region src/lib/components/ui/skeleton/skeleton.svelte
function Skeleton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "skeleton",
			class: clsx(cn("bg-accent animate-pulse rounded-md", className)),
			...restProps
		})}></div>`);
		bind_props($$props, { ref });
	});
}
//#endregion
export { Skeleton as t };
