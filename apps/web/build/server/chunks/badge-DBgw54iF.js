import { J as validate_void_dynamic_element, v as validate_dynamic_element_tag, o as element, H as bind_props, h as attributes, l as clsx } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { t as tv } from './button-B5TxIyzE.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

Badge[FILENAME] = "src/lib/components/ui/badge/badge.svelte";
const badgeVariants = tv({
  base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90 border-transparent",
      secondary: "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 border-transparent",
      destructive: "bg-destructive [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70 border-transparent text-white",
      outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
    }
  },
  defaultVariants: { variant: "default" }
});
function Badge($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        href,
        class: className,
        variant = "default",
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const $$tag = href ? "a" : "span";
      validate_void_dynamic_element(() => $$tag);
      validate_dynamic_element_tag(() => $$tag);
      push_element($$renderer2, $$tag, 41, 0);
      element(
        $$renderer2,
        $$tag,
        () => {
          $$renderer2.push(`${attributes({
            "data-slot": "badge",
            href,
            class: clsx(cn(badgeVariants({ variant }), className)),
            ...restProps
          })}`);
        },
        () => {
          children?.($$renderer2);
          $$renderer2.push(`<!---->`);
        }
      );
      pop_element();
      bind_props($$props, { ref });
    },
    Badge
  );
}
Badge.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Badge as B };
//# sourceMappingURL=badge-DBgw54iF.js.map
