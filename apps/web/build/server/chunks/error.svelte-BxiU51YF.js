import { F as FILENAME } from './index-client-DVey9PBT.js';
import { E as escape_html } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { p as page } from './index2-DN4t2Pgp.js';
import './client-CreTuECU.js';
import './client2-BtPpI286.js';
import './exports-BuGzoaN1.js';
import './index3-CnQVvK5M.js';

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
//# sourceMappingURL=error.svelte-BxiU51YF.js.map
