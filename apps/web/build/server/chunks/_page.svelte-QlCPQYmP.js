import { b as push_element, e as ensure_array_like, d as pop_element, F as FILENAME } from './ui-libs-Yf6h8PPk.js';
import 'hls.js';
import './dropdown-menu-trigger-uQvQ2CZF.js';
import './button-C1v8XzqW.js';
import './utils2-DYlu6U_t.js';
import './index-D4iwt0su.js';

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
//# sourceMappingURL=_page.svelte-QlCPQYmP.js.map
