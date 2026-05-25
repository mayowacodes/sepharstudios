import { b as push_element, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import './client-BZtJixNd.js';
import { a as ReviewResult } from './admin-O9QWk6KR.js';
import './client2-D3ciM3yf.js';
import './exports-BuGzoaN1.js';

_page[FILENAME] = "src/routes/(admin)/admin/review/[id]/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      ({
        result: ReviewResult.APPROVED
      });
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="text-center py-12">`);
        push_element($$renderer2, "div", 381, 0);
        $$renderer2.push(`<div class="text-4xl mb-4">`);
        push_element($$renderer2, "div", 382, 2);
        $$renderer2.push(`📋</div>`);
        pop_element();
        $$renderer2.push(` <div class="text-xl text-white mb-2">`);
        push_element($$renderer2, "div", 383, 2);
        $$renderer2.push(`Loading content...</div>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]-->`);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CZoMYdrZ.js.map
