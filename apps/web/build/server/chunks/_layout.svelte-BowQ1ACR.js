import { b as push_element, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';

_layout[FILENAME] = "src/routes/(web3)/+layout.svelte";
function _layout($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { children } = $$props;
      $$renderer2.push(`<div class="web3-layout min-h-screen svelte-1whnx50">`);
      push_element($$renderer2, "div", 20, 0);
      $$renderer2.push(`<div class="container mx-auto px-4 py-8">`);
      push_element($$renderer2, "div", 21, 1);
      children($$renderer2);
      $$renderer2.push(`<!----></div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _layout
  );
}
_layout.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _layout as default };
//# sourceMappingURL=_layout.svelte-BowQ1ACR.js.map
