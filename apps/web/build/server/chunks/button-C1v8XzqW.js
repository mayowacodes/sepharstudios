import { a as attributes, c as clsx, b as push_element, d as pop_element, B as bind_props, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { c as cn } from './utils2-DYlu6U_t.js';
import { t as tv } from './index-D4iwt0su.js';

Button[FILENAME] = "src/lib/components/ui/button/button.svelte";
const buttonVariants = tv({
  base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs",
      destructive: "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white shadow-xs",
      outline: "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border shadow-xs",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-xs",
      ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-9 px-4 py-2 has-[>svg]:px-3",
      sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
      lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
      icon: "size-9",
      "icon-sm": "size-8",
      "icon-lg": "size-10"
    }
  },
  defaultVariants: { variant: "default", size: "default" }
});
function Button($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        class: className,
        variant = "default",
        size = "default",
        ref = null,
        href = void 0,
        type = "button",
        disabled,
        children,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      if (href) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<a${attributes({
          "data-slot": "button",
          class: clsx(cn(buttonVariants({ variant, size }), className)),
          href: disabled ? void 0 : href,
          "aria-disabled": disabled,
          role: disabled ? "link" : void 0,
          tabindex: disabled ? -1 : void 0,
          ...restProps
        })}>`);
        push_element($$renderer2, "a", 59, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></a>`);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<button${attributes({
          "data-slot": "button",
          class: clsx(cn(buttonVariants({ variant, size }), className)),
          type,
          disabled,
          ...restProps
        })}>`);
        push_element($$renderer2, "button", 72, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Button
  );
}
Button.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Button as B, buttonVariants as b };
//# sourceMappingURL=button-C1v8XzqW.js.map
