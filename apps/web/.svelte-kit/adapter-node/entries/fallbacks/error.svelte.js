import { a as push_element, e as escape_html, b as pop_element, F as FILENAME } from "../../chunks/ui-libs.js";
import "clsx";
import { p as page } from "../../chunks/index2.js";
Error[FILENAME] = "C:/Users/Mayowa Animasaun/Documents/Projects/sepharstudios/node_modules/@sveltejs/kit/src/runtime/components/svelte-5/error.svelte";
function Error($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      $$renderer2.push(`<h1>`);
      push_element($$renderer2, "h1", 5, 0);
      $$renderer2.push(`${escape_html(page.status)}</h1>`);
      pop_element();
      $$renderer2.push(` <p>`);
      push_element($$renderer2, "p", 6, 0);
      $$renderer2.push(`${escape_html(page.error?.message)}</p>`);
      pop_element();
    },
    Error
  );
}
Error.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
export {
  Error as default
};
