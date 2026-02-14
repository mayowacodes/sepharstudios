import { h as attributes, l as clsx, E as escape_html, H as bind_props } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

Textarea[FILENAME] = "src/lib/components/ui/textarea/textarea.svelte";
function Textarea($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        value = void 0,
        class: className,
        "data-slot": dataSlot = "textarea",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      $$renderer2.push(`<textarea${attributes({
        "data-slot": dataSlot,
        class: clsx(cn("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className)),
        ...restProps
      })}>`);
      push_element($$renderer2, "textarea", 14, 0);
      const $$body = escape_html(value);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea>`);
      pop_element();
      bind_props($$props, { ref, value });
    },
    Textarea
  );
}
Textarea.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Textarea as T };
//# sourceMappingURL=textarea-CG5A7MHl.js.map
