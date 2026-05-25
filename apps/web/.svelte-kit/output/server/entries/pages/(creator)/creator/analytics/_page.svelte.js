import { a as push_element, b as pop_element, F as FILENAME } from "../../../../../chunks/ui-libs.js";
import "clsx";
_page[FILENAME] = "src/routes/(creator)/creator/analytics/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let selectedPeriod = "30d";
      let selectedContent = "all";
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 113, 0);
      $$renderer2.push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">`);
      push_element($$renderer2, "div", 115, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 116, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 117, 6);
      $$renderer2.push(`Analytics Dashboard</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 118, 6);
      $$renderer2.push(`Track your content performance and audience engagement</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 sm:mt-0 flex space-x-3">`);
      push_element($$renderer2, "div", 122, 4);
      $$renderer2.select(
        {
          value: selectedPeriod,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "7d" }, ($$renderer4) => {
            $$renderer4.push(`Last 7 days`);
          });
          $$renderer3.option({ value: "30d" }, ($$renderer4) => {
            $$renderer4.push(`Last 30 days`);
          });
          $$renderer3.option({ value: "90d" }, ($$renderer4) => {
            $$renderer4.push(`Last 90 days`);
          });
          $$renderer3.option({ value: "1y" }, ($$renderer4) => {
            $$renderer4.push(`Last year`);
          });
        }
      );
      $$renderer2.push(` `);
      $$renderer2.select(
        {
          value: selectedContent,
          class: "px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "all" }, ($$renderer4) => {
            $$renderer4.push(`All Content`);
          });
          $$renderer3.option({ value: "3" }, ($$renderer4) => {
            $$renderer4.push(`Worship Night Live`);
          });
          $$renderer3.option({ value: "1" }, ($$renderer4) => {
            $$renderer4.push(`Faith in Action`);
          });
          $$renderer3.option({ value: "2" }, ($$renderer4) => {
            $$renderer4.push(`Sunday Sermon Series`);
          });
        }
      );
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center py-12">`);
        push_element($$renderer2, "div", 147, 4);
        $$renderer2.push(`<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white">`);
        push_element($$renderer2, "div", 148, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-white ml-4">`);
        push_element($$renderer2, "p", 149, 6);
        $$renderer2.push(`Loading analytics...</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
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
