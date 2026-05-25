import { h as head, b as push_element, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import './button-C1v8XzqW.js';
import './input-CTVv5zOe.js';
import './label-99BY3xOG.js';
import './textarea-Ba-I0uui.js';
import { L as Loader_circle } from './loader-circle-B0f5_wVl.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';
import './Icon-DVHDtCfs.js';

_page[FILENAME] = "src/routes/(app)/apply/creator/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let $$settled = true;
      let $$inner_renderer;
      function $$render_inner($$renderer3) {
        head("1fblyd", $$renderer3, ($$renderer4) => {
          $$renderer4.title(($$renderer5) => {
            $$renderer5.push(`<title>Creator Application - Sephar Studios</title>`);
          });
        });
        $$renderer3.push(`<div class="mx-auto max-w-4xl px-4 py-10">`);
        push_element($$renderer3, "div", 167, 0);
        $$renderer3.push(`<div class="mb-8">`);
        push_element($$renderer3, "div", 168, 2);
        $$renderer3.push(`<h1 class="text-3xl font-bold text-white">`);
        push_element($$renderer3, "h1", 169, 4);
        $$renderer3.push(`Creator Application</h1>`);
        pop_element();
        $$renderer3.push(` <p class="text-gray-300 mt-2">`);
        push_element($$renderer3, "p", 170, 4);
        $$renderer3.push(`Apply to publish content on Sephar Studios as an individual or organization.</p>`);
        pop_element();
        $$renderer3.push(`</div>`);
        pop_element();
        $$renderer3.push(` `);
        {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="flex items-center justify-center py-16">`);
          push_element($$renderer3, "div", 174, 4);
          Loader_circle($$renderer3, { class: "h-8 w-8 animate-spin text-primary" });
          $$renderer3.push(`<!----></div>`);
          pop_element();
        }
        $$renderer3.push(`<!--]--></div>`);
        pop_element();
      }
      do {
        $$settled = true;
        $$inner_renderer = $$renderer2.copy();
        $$render_inner($$inner_renderer);
      } while (!$$settled);
      $$renderer2.subsume($$inner_renderer);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-lNOLqGD_.js.map
