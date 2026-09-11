import { a as attributes, c as clsx$1, t as bind_props } from './index.js-BP8aAXBX.js';
import { c as cn } from './utils2-CqskQpUP.js';

//#region src/lib/components/ui/skeleton/skeleton.svelte
function Skeleton($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, class: className, $$slots, $$events, ...restProps } = $$props;
		$$renderer.push(`<div${attributes({
			"data-slot": "skeleton",
			class: clsx$1(cn("portal-skeleton rounded-md", className)),
			...restProps
		}, "svelte-18guw72")}></div>`);
		bind_props($$props, { ref });
	});
}

export { Skeleton as S };
//# sourceMappingURL=skeleton-6hclnaPy.js.map
