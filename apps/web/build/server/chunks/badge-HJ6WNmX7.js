import { ak as element, ae as bind_props, ad as attributes, ag as clsx$1 } from './ui-libs-TtGtWAGI.js';
import { c as cn } from './utils2-C8dWVCac.js';
import { t as tv } from './index-CGfbhb6a.js';

//#region src/lib/components/ui/badge/badge.svelte
var badgeVariants = tv({
	base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
		secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
		destructive: "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white",
		outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let { ref = null, href, class: className, variant = "default", children, $$slots, $$events, ...restProps } = $$props;
		element($$renderer, href ? "a" : "span", () => {
			$$renderer.push(`${attributes({
				"data-slot": "badge",
				href,
				class: clsx$1(cn(badgeVariants({ variant }), className)),
				...restProps
			})}`);
		}, () => {
			children?.($$renderer);
			$$renderer.push(`<!---->`);
		});
		bind_props($$props, { ref });
	});
}

export { Badge as B };
//# sourceMappingURL=badge-HJ6WNmX7.js.map
