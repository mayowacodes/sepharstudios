import { ak as attributes, an as clsx$1, al as bind_props } from './ui-libs-BjzLDLAh.js';
import { c as cn } from './utils2-BaRxD-PE.js';

//#region src/lib/components/ui/skeleton/skeleton.svelte
function Skeleton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "skeleton",
			class: clsx$1(cn("bg-accent animate-pulse rounded-md", className)),
			...restProps
		})}></div>`);
		bind_props($$props, { ref });
	});
}

export { Skeleton as S };
//# sourceMappingURL=skeleton-DCiPgxrC.js.map
