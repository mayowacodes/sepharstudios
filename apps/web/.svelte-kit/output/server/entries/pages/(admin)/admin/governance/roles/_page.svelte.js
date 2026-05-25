import { o as head, a as push_element, b as pop_element, F as FILENAME } from "../../../../../../chunks/ui-libs.js";
_page[FILENAME] = "src/routes/(admin)/admin/governance/roles/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("1cuy8cy", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Governance Roles - Admin</title>`);
        });
      });
      $$renderer2.push(`<div class="container mx-auto px-4 py-8 space-y-6">`);
      push_element($$renderer2, "div", 35, 0);
      $$renderer2.push(`<h1 class="text-2xl font-bold text-white">`);
      push_element($$renderer2, "h1", 36, 1);
      $$renderer2.push(`Role Permissions</h1>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="text-sm text-gray-400">`);
        push_element($$renderer2, "p", 39, 2);
        $$renderer2.push(`Loading roles...</p>`);
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
