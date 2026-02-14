import { H as bind_props, g as spread_props, I as props_id, h as attributes, F as derived } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { c as createId, b as boxWith, m as mergeProps, a as attachRef, d as createBitsAttrs, l as boolToStrTrueOrUndef } from './create-id-ozwDP4rH.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

const separatorAttrs = createBitsAttrs({ component: "separator", parts: ["root"] });
class SeparatorRootState {
  static create(opts) {
    return new SeparatorRootState(opts);
  }
  opts;
  attachment;
  constructor(opts) {
    this.opts = opts;
    this.attachment = attachRef(opts.ref);
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    role: this.opts.decorative.current ? "none" : "separator",
    "aria-orientation": this.opts.orientation.current,
    "aria-hidden": boolToStrTrueOrUndef(this.opts.decorative.current),
    "data-orientation": this.opts.orientation.current,
    [separatorAttrs.root]: "",
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
Separator$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/separator/components/separator.svelte";
function Separator$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        id = createId(uid),
        ref = null,
        child,
        children,
        decorative = false,
        orientation = "horizontal",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const rootState = SeparatorRootState.create({
        ref: boxWith(() => ref, (v) => ref = v),
        id: boxWith(() => id),
        decorative: boxWith(() => decorative),
        orientation: boxWith(() => orientation)
      });
      const mergedProps = mergeProps(restProps, rootState.props);
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div${attributes({ ...mergedProps })}>`);
        push_element($$renderer2, "div", 35, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Separator$1
  );
}
Separator$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Separator[FILENAME] = "src/lib/components/ui/separator/separator.svelte";
function Separator($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        "data-slot": dataSlot = "separator",
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Separator$1($$renderer3, spread_props([
          {
            "data-slot": dataSlot,
            class: cn("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", className)
          },
          restProps,
          {
            get ref() {
              return ref;
            },
            set ref($$value) {
              ref = $$value;
              $$settled = false;
            }
          }
        ]));
        $$renderer3.push(`<!---->`);
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
      bind_props($$props, { ref });
    },
    Separator
  );
}
Separator.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Separator as S };
//# sourceMappingURL=separator-C0wSgEAM.js.map
