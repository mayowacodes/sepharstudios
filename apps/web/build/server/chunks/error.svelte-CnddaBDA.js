import { b as push_element, l as escape_html, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import { p as page } from './index2-DBoVEfQm.js';
import './client-BZtJixNd.js';
import './client2-D3ciM3yf.js';
import './exports-BuGzoaN1.js';

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

export { Error as default };
//# sourceMappingURL=error.svelte-CnddaBDA.js.map
