import { H as bind_props, g as spread_props, I as props_id, h as attributes, F as derived } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { c as createId, b as boxWith, m as mergeProps, a as attachRef, d as createBitsAttrs } from './create-id-ozwDP4rH.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

const labelAttrs = createBitsAttrs({ component: "label", parts: ["root"] });
class LabelRootState {
  static create(opts) {
    return new LabelRootState(opts);
  }
  opts;
  attachment;
  constructor(opts) {
    this.opts = opts;
    this.attachment = attachRef(this.opts.ref);
    this.onmousedown = this.onmousedown.bind(this);
  }
  onmousedown(e) {
    if (e.detail > 1) e.preventDefault();
  }
  #props = derived(() => ({
    id: this.opts.id.current,
    [labelAttrs.root]: "",
    onmousedown: this.onmousedown,
    ...this.attachment
  }));
  get props() {
    return this.#props();
  }
  set props($$value) {
    return this.#props($$value);
  }
}
Label$1[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/bits-ui/dist/bits/label/components/label.svelte";
function Label$1($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const uid = props_id($$renderer2);
      let {
        children,
        child,
        id = createId(uid),
        ref = null,
        for: forProp,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      const rootState = LabelRootState.create({
        id: boxWith(() => id),
        ref: boxWith(() => ref, (v) => ref = v)
      });
      const mergedProps = mergeProps(restProps, rootState.props, { for: forProp });
      if (child) {
        $$renderer2.push("<!--[-->");
        child($$renderer2, { props: mergedProps });
        $$renderer2.push(`<!---->`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<label${attributes({ ...mergedProps, for: forProp })}>`);
        push_element($$renderer2, "label", 31, 1);
        children?.($$renderer2);
        $$renderer2.push(`<!----></label>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      bind_props($$props, { ref });
    },
    Label$1
  );
}
Label$1.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
Label[FILENAME] = "src/lib/components/ui/label/label.svelte";
function Label($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let {
        ref = null,
        class: className,
        $$slots,
        $$events,
        ...restProps
      } = $$props;
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        $$renderer3.push(`<!---->`);
        Label$1($$renderer3, spread_props([
          {
            "data-slot": "label",
            class: cn("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className)
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
    Label
  );
}
Label.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Label as L };
//# sourceMappingURL=label-Bh2yW0Jf.js.map
