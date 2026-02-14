import { m as ensure_array_like, E as escape_html, P as store_set, M as store_get, N as unsubscribe_stores } from './index-C14HL8mA.js';
import { M as MovieCard, m as mediaModalStore } from './MovieCard-CvwAgsPz.js';
import { p as push_element, a as pop_element } from './dev-cqarhAJ0.js';
import './client-CreTuECU.js';
import { F as FILENAME } from './index-client-DVey9PBT.js';

MediaGrid[FILENAME] = "src/lib/components/MediaGrid.svelte";
function MediaGrid($$renderer, $$props) {
  $$renderer.component(
    ($$renderer2) => {
      var $$store_subs;
      let { sections = [], mediaItems = [], title = "" } = $$props;
      const openModal = (media) => {
        console.log("clicking", media);
        store_set(mediaModalStore, {
          ...store_get($$store_subs ??= {}, "$mediaModalStore", mediaModalStore),
          isOpen: true,
          media
        });
      };
      $$renderer2.push(`<div class="space-y-8">`);
      push_element($$renderer2, "div", 30, 0);
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(sections);
      for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
        let section = each_array[$$index_1];
        $$renderer2.push(`<section>`);
        push_element($$renderer2, "section", 32, 4);
        $$renderer2.push(`<h2 class="text-xl font-semibold text-white mb-2 px-4">`);
        push_element($$renderer2, "h2", 33, 6);
        $$renderer2.push(`${escape_html(section.title)}</h2>`);
        pop_element();
        $$renderer2.push(` <div class="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth snap-x snap-mandatory">`);
        push_element($$renderer2, "div", 35, 6);
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(section.items);
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let item = each_array_1[$$index];
          $$renderer2.push(`<div class="flex-shrink-0 w-[160px] snap-start">`);
          push_element($$renderer2, "div", 39, 10);
          MovieCard($$renderer2, { movie: item, onClick: () => openModal(item) });
          $$renderer2.push(`<!----></div>`);
          pop_element();
        }
        $$renderer2.push(`<!--]--></div>`);
        pop_element();
        $$renderer2.push(`</section>`);
        pop_element();
      }
      $$renderer2.push(`<!--]--></div>`);
      pop_element();
      if ($$store_subs) unsubscribe_stores($$store_subs);
    },
    MediaGrid
  );
}
MediaGrid.render = function() {
  throw new Error("Component.render(...) is no longer valid in Svelte 5. See https://svelte.dev/docs/svelte/v5-migration-guide#Components-are-no-longer-classes for more information");
};

export { MediaGrid as M };
//# sourceMappingURL=MediaGrid-BrYW30GP.js.map
