import { m as ensure_array_like, u as attr, C as attr_class, x as stringify } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(app)/kids/teens/profile/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let selectedAvatar = localStorage.getItem("avatar") || "/avatars/teen-1.png";
      const avatars = [
        "/avatars/teen-1.png",
        "/avatars/teen-2.png",
        "/avatars/teen-3.png",
        "/avatars/teen-4.png"
      ];
      $$renderer2.push(`<main class="p-8">`);
      push_element($$renderer2, "main", 18, 2);
      $$renderer2.push(`<h1 class="text-3xl font-bold text-purple-700 mb-4">`);
      push_element($$renderer2, "h1", 19, 4);
      $$renderer2.push(`Choose Your Teen Avatar</h1>`);
      pop_element();
      $$renderer2.push(` <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">`);
      push_element($$renderer2, "div", 20, 4);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(avatars);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let avatar = each_array[$$index];
        $$renderer2.push(`<button type="button" class="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-full" aria-label="Select avatar">`);
        push_element($$renderer2, "button", 22, 8);
        $$renderer2.push(`<img${attr("src", avatar)} alt="Avatar"${attr_class(`w-24 h-24 rounded-full border-4 ${stringify(selectedAvatar === avatar ? "border-purple-500" : "border-transparent")} cursor-pointer hover:scale-110 transition`)}/>`);
        push_element($$renderer2, "img", 28, 10);
        pop_element();
        $$renderer2.push(`</button>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      $$renderer2.push(` <p class="mt-6 text-lg">`);
      push_element($$renderer2, "p", 36, 4);
      $$renderer2.push(`Your selected avatar will appear in the top navigation.</p>`);
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
//# sourceMappingURL=_page.svelte-D7tKU4OZ.js.map
