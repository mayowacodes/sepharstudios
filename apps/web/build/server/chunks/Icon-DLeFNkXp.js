import { h as attributes, l as clsx, m as ensure_array_like, v as validate_dynamic_element_tag, o as element } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
Icon[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@lucide/svelte/dist/Icon.svelte";
function Icon($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      const {
        name,
        color = "currentColor",
        size = 24,
        strokeWidth = 2,
        absoluteStrokeWidth = false,
        iconNode = [],
        children,
        $$slots,
        $$events,
        ...props
      } = $$props;
      $$renderer2.push(`<svg${attributes(
        {
          ...defaultAttributes,
          ...props,
          width: size,
          height: size,
          stroke: color,
          "stroke-width": absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
          class: clsx(["lucide-icon lucide", name && `lucide-${name}`, props.class])
        },
        void 0,
        void 0,
        void 0,
        3
      )}>`);
      push_element($$renderer2, "svg", 5, 0);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(iconNode);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [tag, attrs] = each_array[$$index];
        validate_dynamic_element_tag(() => tag);
        push_element($$renderer2, tag, 15, 4);
        element($$renderer2, tag, () => {
          $$renderer2.push(`${attributes({ ...attrs }, void 0, void 0, void 0, 3)}`);
        });
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></svg>`);
      pop_element();
    },
    Icon
  );
}
Icon.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Icon as I };
//# sourceMappingURL=Icon-DLeFNkXp.js.map
