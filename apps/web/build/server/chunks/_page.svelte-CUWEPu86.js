import { F as FILENAME } from './index-client-DVey9PBT.js';
import { m as ensure_array_like } from './index-C14HL8mA.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import 'hls.js';
import './dropdown-menu-trigger-DAk9gdtZ.js';
import './button-B5TxIyzE.js';
import './scroll-lock-BKaGX-xL.js';
import './noop-JjG5qwPG.js';
import './create-id-ozwDP4rH.js';
import './watch.svelte-ALR66MkX.js';
import './index-server-_G0R5Qhl.js';
import './events-DndNBaun.js';
import './dom-context.svelte-DOhd7vND.js';
import './popper-layer-force-mount-DvMEtyRB.js';
import './utils2-C-_3GP94.js';

ArchiveVideo[FILENAME] = "src/lib/components/browse/ArchiveVideo.svelte";
function ArchiveVideo($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      {
        $$renderer2.push("<!--[!-->");
        {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">`);
          push_element($$renderer2, "div", 73, 4);
          $$renderer2.push(`<!--[-->`);
          const each_array = ensure_array_like(Array(6));
          for (let i = 0, $$length = each_array.length; i < $$length; i++) {
            each_array[i];
            $$renderer2.push(`<div class="animate-pulse bg-gray-200 h-64 rounded-lg">`);
            push_element($$renderer2, "div", 75, 8);
            $$renderer2.push(`</div>`);
            pop_element();
          }
          $$renderer2.push(`<!--]--></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    },
    ArchiveVideo
  );
}
ArchiveVideo.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};
_page[FILENAME] = "src/routes/(app)/archive/+page.svelte";
function _page($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      ArchiveVideo($$renderer2);
    },
    _page
  );
}
_page.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { _page as default };
//# sourceMappingURL=_page.svelte-CUWEPu86.js.map
