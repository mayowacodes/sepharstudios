import { o as head, a as push_element, b as pop_element, i as ensure_array_like, F as FILENAME } from "../../../../chunks/ui-libs.js";
import "../../../../chunks/button.js";
_page[FILENAME] = "src/routes/(protected)/settings/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("a7mnu8", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Settings - Sephar Studios</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen bg-background px-4 py-10">`);
      push_element($$renderer2, "div", 124, 0);
      $$renderer2.push(`<div class="max-w-2xl mx-auto">`);
      push_element($$renderer2, "div", 125, 2);
      $$renderer2.push(`<h1 class="text-2xl font-bold mb-8">`);
      push_element($$renderer2, "h1", 126, 4);
      $$renderer2.push(`Settings</h1>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 133, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like([1, 2, 3]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          each_array[$$index];
          $$renderer2.push(`<div class="h-16 bg-white/5 rounded-xl animate-pulse">`);
          push_element($$renderer2, "div", 135, 10);
          $$renderer2.push(`</div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
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
export {
  _page as default
};
