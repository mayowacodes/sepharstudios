import { b as push_element, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';

_layout[FILENAME] = "src/routes/(auth)/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      $$renderer2.push(`<div class="animate-in">`);
      push_element($$renderer2, "div", 4, 0);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-B-uiW-3j.js.map
