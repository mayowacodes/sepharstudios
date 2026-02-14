import { E as escape_html, m as ensure_array_like } from './index-C14HL8mA.js';
import './client2-BtPpI286.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';

_page[FILENAME] = "src/routes/(app)/kids/profile/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let selectedAgeGroupDisplay = "";
      const avatars = [
        { name: "Lambie", emoji: "🐑" },
        { name: "Dove", emoji: "🕊️" },
        { name: "Lionheart", emoji: "🦁" },
        { name: "Angel", emoji: "👼" }
      ];
      $$renderer2.push(`<main class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 to-yellow-200 text-center p-6">`);
      push_element($$renderer2, "main", 77, 2);
      $$renderer2.push(`<div class="absolute top-4 left-4">`);
      push_element($$renderer2, "div", 79, 4);
      $$renderer2.push(`<button class="flex items-center px-4 py-2 bg-white/80 hover:bg-white rounded-lg transition-colors text-pink-700 font-semibold">`);
      push_element($$renderer2, "button", 80, 6);
      $$renderer2.push(`← Back to Age Selection</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <h1 class="text-4xl font-extrabold text-pink-700 mb-4">`);
      push_element($$renderer2, "h1", 88, 4);
      $$renderer2.push(`Choose Your Profile</h1>`);
      pop_element();
      $$renderer2.push(` <p class="mb-4 text-lg text-pink-800">`);
      push_element($$renderer2, "p", 89, 4);
      $$renderer2.push(`This will be your profile for Faith Kids ${escape_html(selectedAgeGroupDisplay)}.</p>`);
      pop_element();
      $$renderer2.push(` <p class="mb-8 text-sm text-pink-600">`);
      push_element($$renderer2, "p", 90, 4);
      $$renderer2.push(`${escape_html("Upload your photo or select an avatar")} to continue to ${escape_html(selectedAgeGroupDisplay)} content.</p>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="grid grid-cols-2 md:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 133, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(avatars);
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        let avatar = each_array[i];
        $$renderer2.push(`<button class="flex flex-col items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl hover:bg-yellow-100 transition-all">`);
        push_element($$renderer2, "button", 135, 8);
        $$renderer2.push(`<span class="text-6xl mb-2">`);
        push_element($$renderer2, "span", 139, 10);
        $$renderer2.push(`${escape_html(avatar.emoji)}</span>`);
        pop_element();
        $$renderer2.push(` <span class="text-md font-semibold text-pink-700">`);
        push_element($$renderer2, "span", 140, 10);
        $$renderer2.push(`${escape_html(avatar.name)}</span>`);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(`</main>`);
      pop_element();
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-DbbAe9-Q.js.map
