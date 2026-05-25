import { o as head, a as push_element, b as pop_element, F as FILENAME } from "../../../../chunks/ui-libs.js";
_page[FILENAME] = "src/routes/(app)/careers/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      head("1n6ke1x", $$renderer2, ($$renderer3) => {
        $$renderer3.title(($$renderer4) => {
          $$renderer4.push(`<title>Careers | Sephar Studios</title>`);
        });
        $$renderer3.push(`<meta name="description" content="Join Sephar Studios and help build faith-based entertainment experiences for the world."/>`);
        push_element($$renderer3, "meta", 3, 2);
        pop_element();
      });
      $$renderer2.push(`<main class="container mx-auto px-4 py-16">`);
      push_element($$renderer2, "main", 9, 0);
      $$renderer2.push(`<div class="max-w-3xl mx-auto text-center space-y-6">`);
      push_element($$renderer2, "div", 10, 2);
      $$renderer2.push(`<h1 class="text-4xl md:text-5xl font-bold">`);
      push_element($$renderer2, "h1", 11, 4);
      $$renderer2.push(`Careers at Sephar Studios</h1>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground text-lg">`);
      push_element($$renderer2, "p", 12, 4);
      $$renderer2.push(`We are growing our team across engineering, content, design, and operations.</p>`);
      pop_element();
      $$renderer2.push(` <p class="text-muted-foreground">`);
      push_element($$renderer2, "p", 15, 4);
      $$renderer2.push(`Send your resume and portfolio to <a href="mailto:info@sepharstudios.com" class="text-primary hover:underline">`);
      push_element($$renderer2, "a", 17, 6);
      $$renderer2.push(`info@sepharstudios.com</a>`);
      pop_element();
      $$renderer2.push(`.</p>`);
      pop_element();
      $$renderer2.push(`</div>`);
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
export {
  _page as default
};
