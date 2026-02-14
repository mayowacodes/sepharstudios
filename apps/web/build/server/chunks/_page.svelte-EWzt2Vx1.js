import { F as FILENAME } from './index-client-DVey9PBT.js';
import { u as attr } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';

_page[FILENAME] = "src/routes/(creator)/creator/profile/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let isSaving = false;
      $$renderer2.push(`<div class="space-y-6">`);
      push_element($$renderer2, "div", 136, 0);
      $$renderer2.push(`<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">`);
      push_element($$renderer2, "div", 138, 2);
      $$renderer2.push(`<div>`);
      push_element($$renderer2, "div", 139, 4);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-white mb-2">`);
      push_element($$renderer2, "h1", 140, 6);
      $$renderer2.push(`Creator Profile</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-gray-300">`);
      push_element($$renderer2, "p", 141, 6);
      $$renderer2.push(`Manage your profile and ministry information</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <div class="mt-4 sm:mt-0">`);
      push_element($$renderer2, "div", 145, 4);
      $$renderer2.push(`<button${attr("disabled", isSaving, true)} class="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">`);
      push_element($$renderer2, "button", 146, 6);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`💾 Save Changes`);
      }
      $$renderer2.push(`<!--]--></button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
        {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="flex items-center justify-center py-12">`);
        push_element($$renderer2, "div", 180, 4);
        $$renderer2.push(`<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white">`);
        push_element($$renderer2, "div", 181, 6);
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` <p class="text-white ml-4">`);
        push_element($$renderer2, "p", 182, 6);
        $$renderer2.push(`Loading profile...</p>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-EWzt2Vx1.js.map
