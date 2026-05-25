import { o as head, a as push_element, b as pop_element, F as FILENAME } from "../../../../../../chunks/ui-libs.js";
_page[FILENAME] = "src/routes/(admin)/admin/governance/proposals/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("1fzek9k", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Governance Proposals - Admin</title>`);
        });
      });
      $$renderer2.push(`<div class="container mx-auto px-4 py-8 space-y-4">`);
      push_element($$renderer2, "div", 46, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 47, 1);
      $$renderer2.push(`<h1 class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "h1", 48, 2);
      $$renderer2.push(`Governance Proposals</h1>`);
      pop_element();
      $$renderer2.push(` <a href="/admin/governance/create" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">`);
      push_element($$renderer2, "a", 49, 2);
      $$renderer2.push(`Create Proposal</a>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="rounded-xl border border-white/10 overflow-hidden">`);
      push_element($$renderer2, "div", 52, 1);
      $$renderer2.push(`<table class="w-full text-sm">`);
      push_element($$renderer2, "table", 53, 2);
      $$renderer2.push(`<thead class="bg-white/5 text-gray-300">`);
      push_element($$renderer2, "thead", 54, 3);
      $$renderer2.push(`<tr>`);
      push_element($$renderer2, "tr", 55, 4);
      $$renderer2.push(`<th class="px-4 py-3 text-left">`);
      push_element($$renderer2, "th", 56, 5);
      $$renderer2.push(`Title</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-4 py-3 text-left">`);
      push_element($$renderer2, "th", 57, 5);
      $$renderer2.push(`Type</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-4 py-3 text-left">`);
      push_element($$renderer2, "th", 58, 5);
      $$renderer2.push(`Risk</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-4 py-3 text-left">`);
      push_element($$renderer2, "th", 59, 5);
      $$renderer2.push(`Approvals</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-4 py-3 text-left">`);
      push_element($$renderer2, "th", 60, 5);
      $$renderer2.push(`Status</th>`);
      pop_element();
      $$renderer2.push(`<th class="px-4 py-3 text-left">`);
      push_element($$renderer2, "th", 61, 5);
      $$renderer2.push(`Created</th>`);
      pop_element();
      $$renderer2.push(`</tr>`);
      pop_element();
      $$renderer2.push(`</thead>`);
      pop_element();
      $$renderer2.push(`<tbody>`);
      push_element($$renderer2, "tbody", 64, 3);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<tr>`);
        push_element($$renderer2, "tr", 66, 5);
        $$renderer2.push(`<td colspan="6" class="px-4 py-6 text-center text-gray-400">`);
        push_element($$renderer2, "td", 66, 9);
        $$renderer2.push(`Loading proposals...</td>`);
        pop_element();
        $$renderer2.push(`</tr>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></tbody>`);
      pop_element();
      $$renderer2.push(`</table>`);
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
export {
  _page as default
};
