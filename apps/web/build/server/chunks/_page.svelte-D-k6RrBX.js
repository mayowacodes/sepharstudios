import { m as ensure_array_like, u as attr, E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

_page[FILENAME] = "src/routes/(app)/contact/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let formData = { name: "", email: "", subject: "", message: "" };
      let isSubmitting = false;
      $$renderer2.push(`<div class="max-w-4xl mx-auto px-4 py-12">`);
      push_element($$renderer2, "div", 46, 0);
      $$renderer2.push(`<h1 class="text-4xl font-bold text-[#FF5E0E] mb-8 text-center">`);
      push_element($$renderer2, "h1", 47, 2);
      $$renderer2.push(`Contact Us</h1>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <form class="space-y-6">`);
      push_element($$renderer2, "form", 64, 2);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(Object.entries(formData));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let [key, value] = each_array[$$index];
        $$renderer2.push(`<div>`);
        push_element($$renderer2, "div", 66, 4);
        $$renderer2.push(`<label${attr("for", key)} class="block text-sm font-medium text-[#AF6E4D]">`);
        push_element($$renderer2, "label", 67, 6);
        $$renderer2.push(`${escape_html(key.charAt(0).toUpperCase() + key.slice(1))}</label>`);
        pop_element();
        $$renderer2.push(` `);
        if (key === "message") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<textarea${attr("id", key)} required rows="5" class="mt-1 block w-full rounded-md border border-[#AF6E4D] shadow-sm focus:border-[#FF5E0E] focus:ring focus:ring-[#FFBF00] focus:ring-opacity-50 p-2">`);
          push_element($$renderer2, "textarea", 71, 8);
          const $$body = escape_html(formData[key]);
          if ($$body) {
            $$renderer2.push(`${$$body}`);
          }
          $$renderer2.push(`</textarea>`);
          pop_element();
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<input${attr("type", key === "email" ? "email" : "text")}${attr("id", key)}${attr("value", formData[key])} required class="mt-1 block w-full rounded-md border border-[#AF6E4D] shadow-sm focus:border-[#FF5E0E] focus:ring focus:ring-[#FFBF00] focus:ring-opacity-50 p-2"/>`);
          push_element($$renderer2, "input", 79, 8);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--> <div>`);
      push_element($$renderer2, "div", 91, 4);
      $$renderer2.push(`<button type="submit"${attr("disabled", isSubmitting, true)} class="w-full bg-[#FF5E0E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#FF5E0E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">`);
      push_element($$renderer2, "button", 92, 6);
      $$renderer2.push(`${escape_html("Send Message")}</button>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(`</form>`);
      pop_element();
      $$renderer2.push(` <div class="mt-12 text-center">`);
      push_element($$renderer2, "div", 103, 2);
      $$renderer2.push(`<h2 class="text-2xl font-bold text-[#FF5E0E] mb-4">`);
      push_element($$renderer2, "h2", 104, 4);
      $$renderer2.push(`Other Ways to Reach Us</h2>`);
      pop_element();
      $$renderer2.push(` <div class="space-y-2 text-[#AF6E4D]">`);
      push_element($$renderer2, "div", 105, 4);
      $$renderer2.push(`<p>`);
      push_element($$renderer2, "p", 106, 6);
      $$renderer2.push(`Email: <a href="mailto:info@sepharstudios.com" class="underline">`);
      push_element($$renderer2, "a", 106, 16);
      $$renderer2.push(`info@sepharstudios.com</a>`);
      pop_element();
      $$renderer2.push(`</p>`);
      pop_element();
      $$renderer2.push(` <p>`);
      push_element($$renderer2, "p", 107, 6);
      $$renderer2.push(`Phone: <a href="tel:+1234567890" class="underline">`);
      push_element($$renderer2, "a", 107, 16);
      $$renderer2.push(`+1 (234) 567-890</a>`);
      pop_element();
      $$renderer2.push(`</p>`);
      pop_element();
      $$renderer2.push(` <p>`);
      push_element($$renderer2, "p", 108, 6);
      $$renderer2.push(`Address: 123 Faith Avenue, Hollywood, CA 90001</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
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

export { _page as default };
//# sourceMappingURL=_page.svelte-D-k6RrBX.js.map
