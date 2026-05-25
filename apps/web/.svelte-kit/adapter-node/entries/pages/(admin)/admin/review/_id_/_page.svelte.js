import { a as push_element, b as pop_element, F as FILENAME } from "../../../../../../chunks/ui-libs.js";
import "clsx";
import "../../../../../../chunks/client.js";
import { a as ReviewResult, R as ReviewType } from "../../../../../../chunks/admin.js";
_page[FILENAME] = "src/routes/(admin)/admin/review/[id]/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      ({
        reviewType: ReviewType.THEOLOGICAL,
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
export {
  _page as default
};
