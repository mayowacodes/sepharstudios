import { o as head, a as push_element, b as pop_element, i as ensure_array_like, F as FILENAME } from "../../../../../chunks/ui-libs.js";
import { B as Book_open } from "../../../../../chunks/book-open.js";
_page[FILENAME] = "src/routes/kids/kiddies/bible-quiz/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("1dpte59", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Bible Quiz - Sephar Kids</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-background px-4 py-8">`);
      push_element($$renderer2, "div", 42, 0);
      $$renderer2.push(`<div class="max-w-3xl mx-auto">`);
      push_element($$renderer2, "div", 43, 2);
      {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="text-center mb-8">`);
        push_element($$renderer2, "div", 58, 6);
        $$renderer2.push(`<div class="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">`);
        push_element($$renderer2, "div", 59, 8);
        Book_open($$renderer2, { class: "w-8 h-8 text-indigo-300" });
        $$renderer2.push(`<!----></div>`);
        pop_element();
        $$renderer2.push(` <h1 class="text-2xl font-bold text-white mb-2">`);
        push_element($$renderer2, "h1", 62, 8);
        $$renderer2.push(`Bible Quiz Time!</h1>`);
        pop_element();
        $$renderer2.push(` <p class="text-white/60 text-sm">`);
        push_element($$renderer2, "p", 63, 8);
        $$renderer2.push(`Pick a story and answer questions to earn STC stars!</p>`);
        pop_element();
        $$renderer2.push(`</div>`);
        pop_element();
        $$renderer2.push(` `);
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">`);
          push_element($$renderer2, "div", 67, 8);
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like([1, 2, 3, 4, 5, 6]);
          for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
            each_array[$$index];
            $$renderer2.push(`<div class="aspect-square bg-white/5 rounded-2xl animate-pulse">`);
            push_element($$renderer2, "div", 69, 12);
            $$renderer2.push(`</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
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
