import { o as head, a as push_element, b as pop_element, n as attr, F as FILENAME } from "../../../../../../chunks/ui-libs.js";
_page[FILENAME] = "src/routes/(admin)/admin/governance/reports/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("182zabw", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Governance Reports - Admin</title>`);
        });
      });
      $$renderer2.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
      push_element($$renderer2, "div", 66, 0);
      $$renderer2.push(`<div class="flex items-center justify-between">`);
      push_element($$renderer2, "div", 67, 1);
      $$renderer2.push(`<h1 class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "h1", 68, 2);
      $$renderer2.push(`Governance Reports</h1>`);
      pop_element();
      $$renderer2.push(` <button class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm"${attr("disabled", true, true)}>`);
      push_element($$renderer2, "button", 69, 2);
      $$renderer2.push(`Export CSV</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-gray-400">`);
        push_element($$renderer2, "p", 73, 2);
        $$renderer2.push(`Generating report...</p>`);
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
