import { F as FILENAME } from './index-client-DVey9PBT.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import './index-C14HL8mA.js';

_page[FILENAME] = "src/routes/(creator)/creator/test/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<div class="p-8 text-center">`);
      push_element($$renderer2, "div", 2, 0);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-white mb-4">`);
      push_element($$renderer2, "h1", 3, 2);
      $$renderer2.push(`Creator Layout Test</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-purple-300 text-xl">`);
      push_element($$renderer2, "p", 4, 2);
      $$renderer2.push(`If you can see the main site header/footer, the layout reset is NOT working.</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-green-300 text-xl">`);
      push_element($$renderer2, "p", 5, 2);
      $$renderer2.push(`If you only see this content with creator styling, the layout reset IS working!</p>`);
      pop_element();
      $$renderer2.push(` <div class="mt-8 p-4 bg-purple-600/20 border border-purple-500 rounded">`);
      push_element($$renderer2, "div", 7, 2);
      $$renderer2.push(`<p class="text-white">`);
      push_element($$renderer2, "p", 8, 4);
      $$renderer2.push(`This should have purple/blue creator styling background</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 9, 4);
      $$renderer2.push(`Current URL: /creator/test</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-DzHB2PjJ.js.map
