import { h as attributes, l as clsx, H as bind_props } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

Input[FILENAME] = "src/lib/components/ui/input/input.svelte";
function Input($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        value = void 0,
        type,
        files = void 0,
        class: className,
        "data-slot": dataSlot = "input",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      if (type === "file") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<input${attributes(
          {
            "data-slot": dataSlot,
            class: clsx(cn("selection:bg-primary dark:bg-input/30 selection:text-primary-foreground border-input ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 pt-1.5 text-sm font-medium shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className)),
            type: "file",
            ...restProps
          },
          void 0,
          void 0,
          void 0,
          4
        )}/>`);
        push_element($$renderer2, "input", 24, 1);
        pop_element();
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<input${attributes(
          {
            "data-slot": dataSlot,
            class: clsx(cn("border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", className)),
            type,
            value,
            ...restProps
          },
          void 0,
          void 0,
          void 0,
          4
        )}/>`);
        push_element($$renderer2, "input", 39, 1);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref, value, files });
    },
    Input
  );
}
Input.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Input as I };
//# sourceMappingURL=input-BHRan7UY.js.map
