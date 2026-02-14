import { C as attr_class, l as clsx } from './index-C14HL8mA.js';
import { c as cn } from './utils2-C-_3GP94.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

Loading_spinner[FILENAME] = "src/lib/authentication/ui/loading-spinner.svelte";
function Loading_spinner($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      let { class: className } = $$props;
      $$renderer2.push(`<svg${attr_class(clsx(cn("mr-2 -ml-1 h-4 w-4 animate-spin text-white", className)))} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">`);
      push_element($$renderer2, "svg", 6, 0);
      $$renderer2.push(`<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">`);
      push_element($$renderer2, "circle", 7, 1);
      $$renderer2.push(`</circle>`);
      pop_element();
      $$renderer2.push(`<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">`);
      push_element($$renderer2, "path", 8, 1);
      $$renderer2.push(`</path>`);
      pop_element();
      $$renderer2.push(`</svg>`);
      pop_element();
    },
    Loading_spinner
  );
}
Loading_spinner.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { Loading_spinner as L };
//# sourceMappingURL=loading-spinner-BYlcQqmo.js.map
