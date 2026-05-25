import { o as head, a as push_element, b as pop_element, i as ensure_array_like, F as FILENAME } from "../../../../chunks/ui-libs.js";
import { C as Coins } from "../../../../chunks/coins.js";
_page[FILENAME] = "src/routes/(protected)/milestones/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("1dqmcwa", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Milestones - Sephar Studios</title>`);
        });
      });
      $$renderer2.push(`<div class="min-h-screen bg-background px-4 py-10">`);
      push_element($$renderer2, "div", 44, 0);
      $$renderer2.push(`<div class="max-w-3xl mx-auto">`);
      push_element($$renderer2, "div", 45, 2);
      $$renderer2.push(`<div class="flex items-center gap-3 mb-2">`);
      push_element($$renderer2, "div", 46, 4);
      Coins($$renderer2, { class: "w-6 h-6 text-yellow-400" });
      $$renderer2.push(`<!----> <h1 class="text-2xl font-bold">`);
      push_element($$renderer2, "h1", 48, 6);
      $$renderer2.push(`Milestones</h1>`);
      pop_element();
      $$renderer2.push(`</div>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground text-sm mb-8">`);
      push_element($$renderer2, "p", 50, 4);
      $$renderer2.push(`Earn STC tokens by reaching watch and community milestones.</p>`);
      pop_element();
      $$renderer2.push(` `);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="space-y-4">`);
        push_element($$renderer2, "div", 63, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array = ensure_array_like([1, 2, 3, 4, 5]);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          each_array[$$index];
          $$renderer2.push(`<div class="h-20 bg-white/5 rounded-xl animate-pulse">`);
          push_element($$renderer2, "div", 65, 10);
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
